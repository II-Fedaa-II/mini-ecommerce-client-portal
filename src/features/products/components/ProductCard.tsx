import { Link } from 'react-router-dom';
import { ProductImage } from '@/shared/components/ui/ProductImage';
import { formatPrice } from '@/shared/lib/utils';
import type { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  const isOut = product.stock === 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col border-2 border-ink bg-surface transition-transform duration-200 ease-out hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-ink bg-paper">
        <ProductImage
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {isOut && (
          <span className="absolute top-0 left-0 bg-ink px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-paper uppercase">
            Sold out
          </span>
        )}

        {/* Slides up on hover — the one motion moment on the card. */}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-accent px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.14em] text-ink uppercase transition-transform duration-200 ease-out group-hover:translate-y-0">
          View product
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="display text-2xl leading-[0.9]">{product.title}</h2>

        {product.variants.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {product.variants.map((variant) => (
              <li
                key={variant.name}
                className="border border-line px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-ink-soft uppercase"
              >
                {variant.name} · {variant.options.length}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-baseline justify-between gap-3 border-t-2 border-ink pt-3">
          <span className="display tabular text-3xl">{formatPrice(product.price)}</span>
          <span className="tabular text-[11px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
            {isOut ? '—' : `${product.stock} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}
