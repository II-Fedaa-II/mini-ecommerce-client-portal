import { Link } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { Button } from '@/shared/components/ui/button';
import { ProductImage } from '@/shared/components/ui/ProductImage';
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
      toast.error(errorMessage(error, 'Could not add that item to your bag.'));
      return;
    }

    try {
      await removeItem.mutateAsync(product.id);
    } catch {
      toast.error(`${product.title} was added to your bag but stayed on this list.`);
      return;
    }

    toast.success(`${product.title} moved to your bag.`);
  }

  async function removeFromWishlist(product: { id: string; title: string }) {
    try {
      await removeItem.mutateAsync(product.id);
      toast.success(`${product.title} removed.`);
    } catch (error) {
      toast.error(errorMessage(error, 'Could not update your saved items.'));
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <header className="mb-8 border-b-2 border-ink pb-6">
        <h1 className="display text-[clamp(3rem,9vw,6rem)]">Saved for later</h1>
      </header>

      {isLoading && <LoadingState label="Loading your saved items" />}
      {isError && (
        <ErrorState message="We couldn't load your saved items." onRetry={() => void refetch()} />
      )}

      {wishlist && wishlist.length === 0 && (
        <EmptyState
          title="Nothing saved"
          description="Tap the heart on any product page to keep it here."
          action={
            <Button asChild>
              <Link to="/products">Browse the catalogue</Link>
            </Button>
          }
        />
      )}

      {wishlist && wishlist.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((product) => {
            const hasVariants = product.variants.length > 0;

            return (
              <li key={product.id} className="flex flex-col border-2 border-ink bg-surface">
                <Link
                  to={`/products/${product.id}`}
                  className="aspect-4/5 overflow-hidden border-b-2 border-ink bg-paper"
                >
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <Link to={`/products/${product.id}`} className="display text-2xl leading-[0.9]">
                    {product.title}
                  </Link>
                  <p className="display tabular text-2xl">{formatPrice(product.price)}</p>

                  <div className="mt-auto flex gap-2 pt-2">
                    {hasVariants ? (
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to={`/products/${product.id}`}>Choose options</Link>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => void moveToCart(product)}
                        disabled={addItem.isPending || product.stock === 0}
                      >
                        Move to bag
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
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
