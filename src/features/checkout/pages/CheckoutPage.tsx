import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/features/cart/hooks/useCart';
import { Button } from '@/shared/components/ui/button';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/shared/components/ui/states';
import { useToast } from '@/shared/components/ui/toast';
import { errorMessage } from '@/shared/lib/errorMessage';
import { formatPrice } from '@/shared/lib/utils';
import { usePlaceOrder } from '../hooks/useCheckout';

export function CheckoutPage() {
  const { cart, isLoading, isError, error, refetch } = useCart();
  const placeOrder = usePlaceOrder();
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * Generated once per mounted checkout, so a double-click or a retry
   * after a flaky response reuses the same key and the server returns
   * the original order instead of placing a second one.
   */
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  async function handlePlaceOrder() {
    try {
      const order = await placeOrder.mutateAsync(idempotencyKey);

      toast.success('Order placed.');

      void navigate(`/orders/${order.id}`, {
        replace: true,
      });
    } catch (err) {
      toast.error(
        errorMessage(err, 'We could not place your order.'),
      );
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase transition-colors hover:text-ink"
      >
        ← Back
      </button>

      {/* Header */}
      <header className="mb-8 border-b-2 border-ink pb-6">
        <h1 className="display text-[clamp(3rem,9vw,6rem)]">
          Checkout
        </h1>
      </header>

      {/* Loading */}
      {isLoading && (
        <LoadingState label="Loading your order" />
      )}

      {/* Error */}
      {isError && (
        <ErrorState
          message={errorMessage(
            error,
            "We couldn't load your bag.",
          )}
          onRetry={() => void refetch()}
        />
      )}

      {/* Empty cart */}
      {cart && cart.items.length === 0 && (
        <EmptyState
          title="Nothing to check out"
          description="Your bag is empty."
          action={
            <Button asChild>
              <Link to="/products">
                Browse the catalogue
              </Link>
            </Button>
          }
        />
      )}

      {/* Checkout content */}
      {cart && cart.items.length > 0 && (
        <>
          <section className="border-2 border-ink bg-surface">
            {/* Order summary heading */}
            <h2 className="border-b-2 border-ink bg-accent px-6 py-3">
              <span className="display text-2xl">
                Order summary
              </span>
            </h2>

            {/* Items */}
            <ul className="px-6">
              {cart.items.map((line) => (
                <li
                  key={line.itemId}
                  className="flex justify-between gap-6 border-b-2 border-line py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="display text-xl leading-none">
                      {line.title}
                    </p>

                    <p className="mt-1.5 text-[11px] font-semibold tracking-[0.1em] text-ink-soft uppercase">
                      Qty {line.quantity}

                      {line.selectedVariants.length > 0 &&
                        ` · ${line.selectedVariants
                          .map(
                            (variant) =>
                              `${variant.name}: ${variant.value}`,
                          )
                          .join(' · ')}`}
                    </p>
                  </div>

                  <p className="tabular shrink-0 font-semibold">
                    {formatPrice(line.subtotal)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="flex items-baseline justify-between border-t-2 border-ink px-6 py-4">
              <span className="text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
                Total
              </span>

              <span className="display tabular text-4xl">
                {formatPrice(cart.total)}
              </span>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>

            <Button
              size="lg"
              onClick={() => void handlePlaceOrder()}
              disabled={placeOrder.isPending}
            >
              {placeOrder.isPending
                ? 'Placing order…'
                : 'Place order'}
            </Button>
          </div>

          <p className="mt-4 text-right text-[11px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
            No payment is taken — this is a mocked checkout
          </p>
        </>
      )}
    </main>
  );
}