import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { formatPrice } from '@/shared/lib/utils';
import { CartLineItem } from '../components/CartLineItem';
import { useCart } from '../hooks/useCart';

export function CartPage() {
  const { cart, isLoading, isError, refetch } = useCart();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl tracking-tight">Your cart</h1>

      {isLoading && <LoadingState label="Loading your cart" />}

      {isError && <ErrorState message="We couldn't load your cart." onRetry={() => void refetch()} />}

      {cart && cart.items.length === 0 && (
        <EmptyState
          title="Your cart is empty"
          description="Browse the catalogue and add something you like."
          action={
            <Button asChild variant="outline">
              <Link to="/products">Browse catalogue</Link>
            </Button>
          }
        />
      )}

      {cart && cart.items.length > 0 && (
        <>
          <ul className="border-t border-line">
            {cart.items.map((line) => (
              <CartLineItem key={line.itemId} line={line} />
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <span className="text-lg text-ink-soft">Total</span>
            <span className="text-2xl">{formatPrice(cart.total)}</span>
          </div>

          <div className="mt-6 flex justify-end">
            <Button asChild>
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
