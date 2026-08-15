import { setupServer } from 'msw/node';
import { authHandlers } from '@/features/auth/api/authApi.mocks';
import { cartHandlers } from '@/features/cart/api/cartApi.mocks';
import { productHandlers } from '@/features/products/api/productsApi.mocks';
import { wishlistHandlers } from '@/features/wishlist/api/wishlistApi.mocks';

/**
 * Test-runner plumbing only — every handler is defined by the feature that owns it,
 * so no feature's mock data lives outside that feature's folder.
 */
export const server = setupServer(...authHandlers, ...productHandlers, ...cartHandlers, ...wishlistHandlers);
