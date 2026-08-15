import { Link } from 'react-router-dom';
import { formatPrice } from '@/shared/lib/utils';
import type { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="flex flex-col border border-line bg-surface p-5 transition-colors hover:border-ink-muted"
    >
      <h2 className="text-lg leading-snug">{product.title}</h2>

      <p className="mt-1 text-ink-soft">{formatPrice(product.price)}</p>

      {product.variants.length > 0 && (
        <dl className="mt-4 flex flex-col gap-1 border-t border-line pt-4 text-sm">
          {product.variants.map((variant) => (
            <div key={variant.name} className="flex gap-2">
              <dt className="text-ink-muted">{variant.name}</dt>
              <dd className="text-ink-soft">{variant.options.join(', ')}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-4 text-sm text-ink-muted">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
    </Link>
  );
}
