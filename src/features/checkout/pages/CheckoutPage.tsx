import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { formatPrice } from '@/shared/lib/utils';
import { usePlaceOrder } from '../hooks/useCheckout';

export function CheckoutPage() {
  const { cart, isLoading, isError, refetch } = useCart();
  const placeOrder = usePlaceOrder();
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Generated once per mounted checkout, so a double-click or a retry after a flaky
   * response reuses the same key and the server returns the original order instead of
   * placing a second one.
   */
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  async function handlePlaceOrder() {
    try {
      const order = await placeOrder.mutateAsync(idempotencyKey);
      toast.success('Order placed.');
      void navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      toast.error(errorMessage(err, 'We could not place your order.'));
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl tracking-tight">Checkout</h1>

      {isLoading && <LoadingState label="Loading your order summary" />}

      {isError && <ErrorState message="We couldn't load your cart." onRetry={() => void refetch()} />}

      {cart && cart.items.length === 0 && (
        <EmptyState
          title="Nothing to check out"
          description="Your cart is empty."
          action={
            <Button asChild variant="outline">
              <Link to="/products">Browse catalogue</Link>
            </Button>
          }
        />
      )}

      {cart && cart.items.length > 0 && (
        <>
          <section className="border border-line bg-surface">
            <h2 className="border-b border-line px-6 py-4 text-lg">Order summary</h2>

            <ul className="px-6">
              {cart.items.map((line) => (
                <li key={line.itemId} className="flex justify-between gap-4 border-b border-line py-4 last:border-b-0">
                  <div>
                    <p>{line.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">
                      Qty {line.quantity}
                      {line.selectedVariants.length > 0 &&
                        ` · ${line.selectedVariants.map((v) => `${v.name}: ${v.value}`).join(' · ')}`}
                    </p>
                  </div>
                  <p>{formatPrice(line.subtotal)}</p>
                </li>
              ))}
            </ul>

            <div className="flex justify-between border-t border-line px-6 py-4">
              <span className="text-ink-soft">Total</span>
              <span className="text-xl">{formatPrice(cart.total)}</span>
            </div>
          </section>


          <div className="mt-6 flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link to="/cart">Back to cart</Link>
            </Button>

            <Button onClick={() => void handlePlaceOrder()} disabled={placeOrder.isPending}>
              {placeOrder.isPending ? 'Placing order…' : 'Place order'}
            </Button>
          </div>

          <p className="mt-4 text-sm text-ink-muted">
            No payment is taken — this is a mocked checkout for the assessment.
          </p>
        </>
      )}
    </main>
  );
}
