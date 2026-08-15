import { expect, test, type APIRequestContext } from '@playwright/test';

const DEMO_EMAIL = 'demo@mini-ecommerce.test';
const DEMO_PASSWORD = 'Password123!';
const API_URL = process.env.E2E_API_URL ?? 'http://localhost:4000';

/**
 * This suite runs against the real API and database, so the shopper's cart and wishlist
 * survive between runs. Reset them first, otherwise a re-run starts from whatever the
 * previous run left behind and the "Add to wishlist" affordance is already toggled.
 */
async function resetShopperState(request: APIRequestContext): Promise<void> {
  const login = await request.post(`${API_URL}/auth/login`, {
    data: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
  });
  const { accessToken } = (await login.json()) as { accessToken: string };
  const headers = { Authorization: `Bearer ${accessToken}` };

  const cart = (await (await request.get(`${API_URL}/cart`, { headers })).json()) as {
    items: { itemId: string }[];
  };
  for (const item of cart.items) {
    await request.delete(`${API_URL}/cart/${item.itemId}`, { headers });
  }

  const wishlist = (await (await request.get(`${API_URL}/wishlist`, { headers })).json()) as { id: string }[];
  for (const product of wishlist) {
    await request.delete(`${API_URL}/wishlist/${product.id}`, { headers });
  }
}

test.beforeEach(async ({ request }) => {
  await resetShopperState(request);
});

/**
 * One comprehensive journey rather than a scenario matrix: sign in, browse, inspect a
 * product, add it to the cart with variants, adjust it, wishlist something, then check out.
 */
test('golden path: login through checkout', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(DEMO_EMAIL);
  await page.getByLabel('Password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: /Everything/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Classic Cotton T-Shirt/ })).toBeVisible();

  await page.getByRole('link', { name: /Classic Cotton T-Shirt/ }).first().click();

  await expect(page.getByRole('heading', { name: 'Classic Cotton T-Shirt' })).toBeVisible();
  await expect(page.getByText(/in stock/)).toBeVisible();

  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Black', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag' }).click();
  // Feedback arrives as a toast naming the product, not an inline message.
  await expect(page.getByRole('status')).toContainText(
    'Classic Cotton T-Shirt added to your bag.',
  );

  await page.getByRole('button', { name: /Save for later/ }).click();
  await expect(page.getByRole('button', { name: /Remove from saved items/ })).toBeVisible();

  await page.getByRole('link', { name: /Saved items/ }).click();
  await expect(page.getByRole('heading', { name: 'Saved for later' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Classic Cotton T-Shirt' }).first()).toBeVisible();

  await page.getByRole('link', { name: /Shopping bag/ }).click();
  await expect(page.getByRole('heading', { name: 'Your bag' })).toBeVisible();
  await expect(page.getByText('Size: M · Color: Black')).toBeVisible();

  const increaseQty = page.getByLabel('Increase quantity of Classic Cotton T-Shirt');
  await increaseQty.click();
  await increaseQty.click();
  await expect(page.getByTestId('cart-total')).toHaveText('$59.97');

  await page.getByRole('link', { name: 'Checkout' }).click();
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Order summary' })).toBeVisible();

  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  await expect(page.getByText('Total paid')).toBeVisible();

  // Checkout must clear the cart server-side, not just locally.
  await page.getByRole('link', { name: /Shopping bag/ }).click();
  await expect(page.getByText('Nothing in here yet')).toBeVisible();
});
