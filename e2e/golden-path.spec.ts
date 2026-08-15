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

  await expect(page.getByRole('heading', { name: 'Catalogue' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Classic Cotton T-Shirt/ })).toBeVisible();

  await page.getByRole('link', { name: /Classic Cotton T-Shirt/ }).first().click();

  await expect(page.getByRole('heading', { name: 'Classic Cotton T-Shirt' })).toBeVisible();
  await expect(page.getByText(/remaining in stock/)).toBeVisible();

  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Black', exact: true }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  // Feedback arrives as a toast naming the product, not an inline message.
  await expect(page.getByRole('status')).toContainText(
    'Classic Cotton T-Shirt added to your cart.',
  );

  await page.getByRole('button', { name: /Add to wishlist/ }).click();
  await expect(page.getByRole('button', { name: /In wishlist/ })).toBeVisible();

  await page.getByRole('link', { name: /Wishlist/ }).click();
  await expect(page.getByRole('heading', { name: 'Wishlist' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Classic Cotton T-Shirt' })).toBeVisible();

  await page.getByRole('link', { name: /Cart/ }).click();
  await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
  await expect(page.getByText('Size: M · Color: Black')).toBeVisible();

  await page.getByLabel(/Quantity for Classic Cotton T-Shirt/).fill('3');
  await expect(page.getByTestId('cart-total')).toHaveText('$59.97');

  await page.getByRole('link', { name: 'Proceed to checkout' }).click();
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Order summary' })).toBeVisible();

  await page.getByRole('button', { name: 'Place order' }).click();

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  await expect(page.getByText('Total paid')).toBeVisible();

  // Checkout must clear the cart server-side, not just locally.
  await page.getByRole('link', { name: /Cart/ }).click();
  await expect(page.getByText('Your cart is empty')).toBeVisible();
});
