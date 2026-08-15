import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@/features/products/hooks/useProducts';
import { VariantSelector } from '@/features/products/components/VariantSelector';
import { Button } from '@/shared/components/ui/button';
import { formatPrice } from '@/shared/lib/utils';
import { useCart } from '../hooks/useCart';
import type { CartLine } from '../types';

export function CartLineItem({ line }: { line: CartLine }) {
  const { updateItem, removeItem } = useCart();
  const { data: product } = useProduct(line.productId);
  const [isEditingVariants, setIsEditingVariants] = useState(false);

  const hasVariants = (product?.variants.length ?? 0) > 0;

  return (
    <li className="flex flex-col gap-4 border-b border-line py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to={`/products/${line.productId}`} className="text-lg hover:underline hover:underline-offset-4">
            {line.title}
          </Link>
          <p className="mt-1 text-sm text-ink-soft">{formatPrice(line.price)} each</p>

          {line.selectedVariants.length > 0 && (
            <p className="mt-2 text-sm text-ink-muted">
              {line.selectedVariants.map((variant) => `${variant.name}: ${variant.value}`).join(' · ')}
            </p>
          )}
        </div>

        <p className="text-lg">{formatPrice(line.subtotal)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          Qty
          <input
            type="number"
            min={1}
            value={line.quantity}
            aria-label={`Quantity for ${line.title}`}
            onChange={(e) =>
              updateItem.mutate({ itemId: line.itemId, quantity: Math.max(1, Number(e.target.value)) })
            }
            className="h-9 w-20 border border-line bg-surface px-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>

        {hasVariants && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditingVariants((open) => !open)}>
            {isEditingVariants ? 'Done' : 'Change options'}
          </Button>
        )}

        <Button
          variant="danger"
          size="sm"
          onClick={() => removeItem.mutate(line.itemId)}
          disabled={removeItem.isPending}
        >
          Remove
        </Button>
      </div>

      {isEditingVariants && product && (
        <div className="border border-line bg-canvas p-4">
          <VariantSelector
            variants={product.variants}
            selected={line.selectedVariants}
            onChange={(selectedVariants) => updateItem.mutate({ itemId: line.itemId, selectedVariants })}
          />
        </div>
      )}
    </li>
  );
}
