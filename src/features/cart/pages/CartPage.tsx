import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { formatPrice } from '@/shared/lib/utils';
import { CartLineItem } from '../components/CartLineItem';
import { useCart } from '../hooks/useCart';

export function CartPage() {
  const { cart, isLoading, isError, refetch } = useCart();
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-6">
        <h1 className="display text-[clamp(3rem,9vw,6rem)]">Your bag</h1>
        {cart && cart.items.length > 0 && (
          <p className="tabular text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        )}
      </header>

      {isLoading && <LoadingState label="Loading your bag" />}
      {isError && <ErrorState message="We couldn't load your bag." onRetry={() => void refetch()} />}

      {cart && cart.items.length === 0 && (
        <EmptyState
          title="Nothing in here yet"
          description="Once you add something it will show up here, with the size and colour you picked."
          action={
            <Button asChild>
              <Link to="/products">Browse the catalogue</Link>
            </Button>
          }
        />
      )}

      {cart && cart.items.length > 0 && (
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
          <ul className="border-t-2 border-ink">
            {cart.items.map((line) => (
              <CartLineItem key={line.itemId} line={line} />
            ))}
          </ul>

          <aside className="border-2 border-ink bg-ink p-6 text-paper lg:sticky lg:top-24">
            <h2 className="display text-3xl text-paper">Summary</h2>

            <dl className="mt-5 flex flex-col gap-2.5 border-t-2 border-paper/20 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-paper/60">Subtotal</dt>
                <dd className="tabular">{formatPrice(cart.total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-paper/60">Delivery</dt>
                <dd className="text-paper/60">Calculated at checkout</dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t-2 border-paper/20 pt-5">
              <span className="text-[11px] font-bold tracking-[0.14em] text-paper/60 uppercase">
                Total
              </span>
              <span className="display tabular text-4xl text-accent" data-testid="cart-total">
                {formatPrice(cart.total)}
              </span>
            </div>

            <Button asChild variant="accent" className="mt-6 w-full">
              <Link to="/checkout">Checkout</Link>
            </Button>

            <Link
              to="/products"
              className="mt-4 block text-center text-[11px] font-bold tracking-[0.12em] text-paper/60 uppercase transition-colors hover:text-paper"
            >
              Keep shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
