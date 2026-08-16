import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@/features/products/hooks/useProducts';
import { VariantSelector } from '@/features/products/components/VariantSelector';
import { Button } from '@/shared/components/ui/button';
import { ProductImage } from '@/shared/components/ui/ProductImage';
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
  // already removed), so every outcome is reported rather than silently reverting.
  function changeQuantity(quantity: number) {
    updateItem.mutate(
      { itemId: line.itemId, quantity },
      {
        onError: (error) => toast.error(errorMessage(error, 'Could not update the quantity.')),
      },
    );
  }

  function handleVariantChange(selectedVariants: CartLine['selectedVariants']) {
    updateItem.mutate(
      { itemId: line.itemId, selectedVariants },
      {
        onSuccess: () => toast.success('Options updated.'),
        onError: (error) => toast.error(errorMessage(error, 'Could not change the options.')),
      },
    );
  }

  function handleRemove() {
    removeItem.mutate(line.itemId, {
      onSuccess: () => toast.success(`${line.title} removed from your bag.`),
      onError: (error) => toast.error(errorMessage(error, 'Could not remove that item.')),
    });
  }

  return (
    <li className="border-b-2 border-ink last:border-b-0">
      <div className="flex gap-4 py-5 sm:gap-6">
        <Link
          to={`/products/${line.productId}`}
          className="h-24 w-20 shrink-0 overflow-hidden border-2 border-ink bg-paper sm:h-32 sm:w-28"
        >
          <ProductImage
            src={product?.imageUrl ?? null}
            alt={line.title}
            className="h-full w-full object-cover"
            letterClassName="display text-3xl text-line"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={`/products/${line.productId}`}
                className="display block text-2xl leading-none hover:text-accent hover:[-webkit-text-stroke:1px_var(--color-ink)]"
              >
                {line.title}
              </Link>

              {line.selectedVariants.length > 0 && (
                <p className="mt-1.5 text-[11px] font-semibold tracking-[0.1em] text-ink-soft uppercase">
                  {line.selectedVariants.map((v) => `${v.name}: ${v.value}`).join(' · ')}
                </p>
              )}
            </div>

            <p className="display tabular shrink-0 text-2xl">{formatPrice(line.subtotal)}</p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2">
            <div className="flex items-center border-2 border-ink">
              <button
                type="button"
                aria-label={`Decrease quantity of ${line.title}`}
                onClick={() => changeQuantity(Math.max(1, line.quantity - 1))}
                disabled={line.quantity <= 1 || updateItem.isPending}
                className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden strokeWidth={3} />
              </button>

              <span
                className="tabular w-9 text-center text-sm font-bold"
                aria-label={`Quantity for ${line.title}`}
              >
                {line.quantity}
              </span>

              <button
                type="button"
                aria-label={`Increase quantity of ${line.title}`}
                onClick={() => changeQuantity(line.quantity + 1)}
                disabled={updateItem.isPending}
                className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-accent disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden strokeWidth={3} />
              </button>
            </div>

            {hasVariants && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditingVariants((o) => !o)}>
                {isEditingVariants ? 'Done' : 'Change options'}
              </Button>
            )}

            <button
              onClick={handleRemove}
              disabled={removeItem.isPending}
              aria-label={`Remove ${line.title}`}
              className="ml-auto flex h-9 w-9 items-center justify-center border-2 border-transparent text-ink-muted transition-colors hover:border-danger hover:text-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {isEditingVariants && product && (
        <div className="mb-5 border-2 border-line bg-surface p-5">
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
