import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { cn, formatPrice } from '@/shared/lib/utils';
import { VariantSelector } from '../components/VariantSelector';
import { useProduct } from '../hooks/useProducts';
import type { VariantSelection } from '../types';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const { addItem } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedVariants, setSelectedVariants] = useState<VariantSelection[]>([]);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  if (isLoading) return <LoadingState label="Loading product" />;
  if (isError || !product) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <ErrorState message="We couldn't load this product." onRetry={() => void refetch()} />
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
      toast.error(`Please choose a ${missingVariant.name}.`);
      return;
    }

    try {
      await addItem.mutateAsync({
        productId: loadedProduct.id,
        quantity,
        selectedVariants,
      });
      toast.success(`${loadedProduct.title} added to your cart.`);
    } catch (error) {
      toast.error(
        errorMessage(error, 'Could not add this item to your cart.'),
      );
    }
  }

  async function handleWishlistToggle() {
    try {
      if (wishlisted) {
        await removeFromWishlist.mutateAsync(loadedProduct.id);
        toast.success('Removed from your wishlist.');
      } else {
        await addToWishlist.mutateAsync(loadedProduct.id);
        toast.success('Saved to your wishlist.');
      }
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update your wishlist.'));
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/products" className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
        ← Back to catalogue
      </Link>

      <header className="mt-6 border-b border-line pb-6">
        <h1 className="text-3xl leading-tight tracking-tight">{product.title}</h1>
        <p className="mt-2 text-xl text-ink-soft">{formatPrice(product.price)}</p>
      </header>

      <p className="mt-6 leading-relaxed text-ink-soft">{product.description}</p>

      <p className="mt-4 text-sm text-ink-muted">
        {isOutOfStock ? 'Currently out of stock' : `${product.stock} remaining in stock`}
      </p>

      {product.variants.length > 0 && (
        <div className="mt-8">
          <VariantSelector variants={product.variants} selected={selectedVariants} onChange={setSelectedVariants} />
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
        <label className="flex items-center gap-3 text-sm text-ink-soft" htmlFor="quantity">
          Quantity
          <input
            id="quantity"
            type="number"
            min={1}
            max={Math.max(product.stock, 1)}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="h-11 w-20 border border-line bg-surface px-3 text-base text-ink focus:border-accent focus:outline-none"
          />
        </label>

        <Button onClick={() => void handleAddToCart()} disabled={isOutOfStock || addItem.isPending}>
          {addItem.isPending ? 'Adding…' : 'Add to cart'}
        </Button>

        <Button variant="outline" onClick={() => void handleWishlistToggle()}>
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-current text-accent')} aria-hidden />
          {wishlisted ? 'In wishlist' : 'Add to wishlist'}
        </Button>
      </div>

    </main>
  );
}
