import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@/features/products/hooks/useProducts';
import { VariantSelector } from '@/features/products/components/VariantSelector';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { formatPrice } from '@/shared/lib/utils';
import { useCart } from '../hooks/useCart';
import type { CartLine } from '../types';

export function CartLineItem({ line }: { line: CartLine }) {
  const { updateItem, removeItem } = useCart();
  const { data: product } = useProduct(line.productId);
  const [isEditingVariants, setIsEditingVariants] = useState(false);
  const toast = useToast();

  const hasVariants = (product?.variants.length ?? 0) > 0;

  // These changes are saved server-side and can legitimately fail (stock moved, item
  // already removed). Firing and forgetting would leave the shopper with a row that
  // silently snaps back, so every outcome is reported.
  function handleQuantityChange(quantity: number) {
    updateItem.mutate(
      { itemId: line.itemId, quantity },
      {
        onError: (error) =>
          toast.error(errorMessage(error, 'Could not update the quantity.')),
      },
    );
  }

  function handleVariantChange(selectedVariants: CartLine['selectedVariants']) {
    updateItem.mutate(
      { itemId: line.itemId, selectedVariants },
      {
        onSuccess: () => toast.success('Options updated.'),
        onError: (error) =>
          toast.error(errorMessage(error, 'Could not change the options.')),
      },
    );
  }

  function handleRemove() {
    removeItem.mutate(line.itemId, {
      onSuccess: () => toast.success(`${line.title} removed from your cart.`),
      onError: (error) =>
        toast.error(errorMessage(error, 'Could not remove that item.')),
    });
  }

  return (
    <li className="flex flex-col gap-4 border-b border-line py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to={`/products/${line.productId}`}
            className="text-lg hover:underline hover:underline-offset-4"
          >
            {line.title}
          </Link>
          <p className="mt-1 text-sm text-ink-soft">
            {formatPrice(line.price)} each
          </p>

          {line.selectedVariants.length > 0 && (
            <p className="mt-2 text-sm text-ink-muted">
              {line.selectedVariants
                .map((variant) => `${variant.name}: ${variant.value}`)
                .join(' · ')}
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
              handleQuantityChange(Math.max(1, Number(e.target.value)))
            }
            className="h-9 w-20 border border-line bg-surface px-2 text-sm text-ink focus:border-accent focus:outline-none"
          />
        </label>

        {hasVariants && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingVariants((open) => !open)}
          >
            {isEditingVariants ? 'Done' : 'Change options'}
          </Button>
        )}

        <Button
          variant="danger"
          size="sm"
          onClick={handleRemove}
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
            onChange={handleVariantChange}
          />
        </div>
      )}
    </li>
  );
}
