import type { VariantSelection } from '@/features/products/types';

export interface CartLine {
  itemId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedVariants: VariantSelection[];
  subtotal: number;
}

export interface Cart {
  items: CartLine[];
  total: number;
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
  selectedVariants?: VariantSelection[];
}

export interface UpdateCartItemInput {
  itemId: string;
  quantity?: number;
  selectedVariants?: VariantSelection[];
}
