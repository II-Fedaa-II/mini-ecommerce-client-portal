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

export interface PaginatedOrders {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
