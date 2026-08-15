import type { VariantSelection } from '@/features/products/types';

export interface OrderLine {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedVariants: VariantSelection[];
  subtotal: number;
}

export interface Order {
  id: string;
  items: OrderLine[];
  total: number;
  createdAt: string;
}
