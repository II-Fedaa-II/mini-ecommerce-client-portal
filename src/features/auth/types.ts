export interface AuthRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: AuthRole | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

/** Mirrors the backend's PERMISSIONS catalogue — every entry gates a real endpoint. */
export const PERMISSIONS = {
  PRODUCTS_READ: 'products:read',
  CART_MANAGE: 'cart:manage',
  WISHLIST_MANAGE: 'wishlist:manage',
  ORDERS_CREATE: 'orders:create',
  ORDERS_READ_OWN: 'orders:read-own',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
