import { Heart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { PERMISSIONS } from '@/features/auth/types';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { Button } from '@/shared/components/ui/button';
import { ProductImage } from '@/shared/components/ui/ProductImage';
import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { cn, formatPrice } from '@/shared/lib/utils';
import { VariantSelector } from '../components/VariantSelector';
import { useProduct } from '../hooks/useProducts';
import type { VariantSelection } from '../types';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { can } = useAuth();
  const { data: product, isLoading, isError, error, refetch } = useProduct(id);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const canUseCart = can(PERMISSIONS.CART_MANAGE);
  const canUseWishlist = can(PERMISSIONS.WISHLIST_MANAGE);

  const [selectedVariants, setSelectedVariants] = useState<VariantSelection[]>([]);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  if (isLoading) return <LoadingState label="Loading product" />;
  if (isError || !product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <ErrorState
          message={errorMessage(error, "We couldn't load this product.")}
          onRetry={() => void refetch()}
        />
      </main>
    );
  }

  const loadedProduct = product;
  const missingVariant = loadedProduct.variants.find(
    (variant) => !selectedVariants.some((entry) => entry.name === variant.name),
  );
  const isOutOfStock = loadedProduct.stock === 0;
  const wishlisted = isInWishlist(loadedProduct.id);

  async function handleAddToCart() {
    if (missingVariant) {
      toast.error(`Choose a ${missingVariant.name.toLowerCase()} first.`);
      return;
    }

    try {
      await addItem.mutateAsync({
        productId: loadedProduct.id,
        quantity,
        selectedVariants,
      });
      toast.success(`${loadedProduct.title} added to your bag.`);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not add this item to your bag.'));
    }
  }

  async function handleWishlistToggle() {
    try {
      if (wishlisted) {
        await removeFromWishlist.mutateAsync(loadedProduct.id);
        toast.success('Removed from saved items.');
      } else {
        await addToWishlist.mutateAsync(loadedProduct.id);
        toast.success('Saved for later.');
      }
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update your saved items.'));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
      <Link
        to="/products"
        className="text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase transition-colors hover:text-ink"
      >
        ← All products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div className="border-2 border-ink bg-surface">
          <div className="aspect-square overflow-hidden bg-paper">
            <ProductImage
              src={loadedProduct.imageUrl}
              alt={loadedProduct.title}
              className="h-full w-full object-cover"
              letterClassName="display text-9xl text-line"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="display text-[clamp(2.5rem,6vw,4.5rem)]">{loadedProduct.title}</h1>

          <p className="display tabular mt-3 text-5xl">
            <span className="marker">{formatPrice(loadedProduct.price)}</span>
          </p>

          <p className="mt-6 max-w-prose leading-relaxed text-ink-soft">
            {loadedProduct.description}
          </p>

          <p
            className={cn(
              'mt-4 text-[11px] font-bold tracking-[0.14em] uppercase',
              isOutOfStock ? 'text-danger' : 'text-ink-soft',
            )}
          >
            {isOutOfStock ? 'Out of stock' : `${loadedProduct.stock} in stock`}
          </p>

          {loadedProduct.variants.length > 0 && (
            <div className="mt-8 border-t-2 border-ink pt-8">
              <VariantSelector
                variants={loadedProduct.variants}
                selected={selectedVariants}
                onChange={setSelectedVariants}
              />
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-stretch gap-3 border-t-2 border-ink pt-8">
            <div className="flex items-center border-2 border-ink">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-11 items-center justify-center transition-colors hover:bg-accent"
              >
                <Minus className="h-4 w-4" aria-hidden strokeWidth={2.5} />
              </button>

              <span
                className="tabular w-12 text-center text-lg font-bold"
                aria-live="polite"
                aria-label={`Quantity ${quantity}`}
              >
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(Math.max(loadedProduct.stock, 1), q + 1))}
                className="flex h-12 w-11 items-center justify-center transition-colors hover:bg-accent"
              >
                <Plus className="h-4 w-4" aria-hidden strokeWidth={2.5} />
              </button>
            </div>

            {canUseCart && (
              <Button
                className="flex-1"
                onClick={() => void handleAddToCart()}
                disabled={isOutOfStock || addItem.isPending}
              >
                {addItem.isPending ? 'Adding…' : 'Add to bag'}
              </Button>
            )}

            {canUseWishlist && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12"
                aria-label={wishlisted ? 'Remove from saved items' : 'Save for later'}
                onClick={() => void handleWishlistToggle()}
              >
                <Heart
                  className={cn('h-5 w-5', wishlisted && 'fill-current')}
                  aria-hidden
                  strokeWidth={2.5}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
