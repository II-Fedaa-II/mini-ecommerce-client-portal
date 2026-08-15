import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { Button } from '@/shared/components/ui/button';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { formatPrice } from '@/shared/lib/utils';
import { useWishlist } from '../hooks/useWishlist';

export function WishlistPage() {
  const { wishlist, isLoading, isError, refetch, removeItem } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();

  async function moveToCart(product: { id: string; title: string }) {
    try {
      await addItem.mutateAsync({ productId: product.id, quantity: 1 });
    } catch (error) {
      toast.error(errorMessage(error, 'Could not add that item to your cart.'));
      return;
    }

    try {
      await removeItem.mutateAsync(product.id);
    } catch {
      // The cart add succeeded, so the move mostly worked — say so rather than
      // implying the whole action failed.
      toast.error(`${product.title} was added to your cart but stayed in your wishlist.`);
      return;
    }

    toast.success(`${product.title} moved to your cart.`);
  }

  async function removeFromWishlist(product: { id: string; title: string }) {
    try {
      await removeItem.mutateAsync(product.id);
      toast.success(`${product.title} removed from your wishlist.`);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update your wishlist.'));
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl tracking-tight">Wishlist</h1>

      {isLoading && <LoadingState label="Loading your wishlist" />}

      {isError && <ErrorState message="We couldn't load your wishlist." onRetry={() => void refetch()} />}

      {wishlist && wishlist.length === 0 && (
        <EmptyState
          title="Nothing saved yet"
          description="Tap “Add to wishlist” on any product to keep it here for later."
          action={
            <Button asChild variant="outline">
              <Link to="/products">Browse catalogue</Link>
            </Button>
          }
        />
      )}

      {wishlist && wishlist.length > 0 && (
        <ul className="border-t border-line">
          {wishlist.map((product) => {
            const hasVariants = product.variants.length > 0;

            return (
              <li key={product.id} className="flex items-start justify-between gap-4 border-b border-line py-6">
                <div>
                  <Link to={`/products/${product.id}`} className="text-lg hover:underline hover:underline-offset-4">
                    {product.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-soft">{formatPrice(product.price)}</p>
                  {hasVariants && <p className="mt-2 text-sm text-ink-muted">Choose options on the product page</p>}
                </div>

                <div className="flex shrink-0 gap-2">
                  {hasVariants ? (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/products/${product.id}`}>Choose options</Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => void moveToCart(product)}
                      disabled={addItem.isPending || product.stock === 0}
                    >
                      Move to cart
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => void removeFromWishlist(product)}
                    disabled={removeItem.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
