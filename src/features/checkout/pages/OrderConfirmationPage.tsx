import { Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { formatPrice } from '@/shared/lib/utils';
import { useOrder } from '../hooks/useCheckout';

export function OrderConfirmationPage() {
  const { id = '' } = useParams();
  const { data: order, isLoading, isError, refetch } = useOrder(id);

  if (isLoading) return <LoadingState label="Loading your order" />;
  if (isError || !order) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-14">
        <ErrorState message="We couldn't load this order." onRetry={() => void refetch()} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <section className="border-2 border-ink bg-ink px-6 py-12 text-paper sm:px-10">
        <span className="inline-flex h-12 w-12 items-center justify-center border-2 border-accent bg-accent">
          <Check className="h-6 w-6 text-ink" aria-hidden strokeWidth={3} />
        </span>

        <h1 className="display mt-6 text-[clamp(3rem,10vw,7rem)] text-paper">
          Order
          <br />
          <span className="text-accent">confirmed.</span>
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/70">
          Thank you. Order{' '}
          <span className="tabular font-semibold text-paper">#{order.id.slice(-8)}</span> was placed
          on {new Date(order.createdAt).toLocaleDateString()}. We have emailed a copy of this
          summary.
        </p>
      </section>

      <section className="mt-6 border-2 border-ink bg-surface">
        <h2 className="border-b-2 border-ink px-6 py-3">
          <span className="display text-2xl">What you ordered</span>
        </h2>

        <ul className="px-6">
          {order.items.map((line, index) => (
            <li
              key={`${line.productId}-${index}`}
              className="flex justify-between gap-6 border-b-2 border-line py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="display text-xl leading-none">{line.title}</p>
                <p className="mt-1.5 text-[11px] font-semibold tracking-widest text-ink-soft uppercase">
                  Qty {line.quantity}
                  {line.selectedVariants.length > 0 &&
                    ` · ${line.selectedVariants.map((v) => `${v.name}: ${v.value}`).join(' · ')}`}
                </p>
              </div>
              <p className="tabular shrink-0 font-semibold">{formatPrice(line.subtotal)}</p>
            </li>
          ))}
        </ul>

        <div className="flex items-baseline justify-between border-t-2 border-ink px-6 py-4">
          <span className="text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
            Total paid
          </span>
          <span className="display tabular text-4xl">{formatPrice(order.total)}</span>
        </div>
      </section>

      <div className="mt-6">
        <Button asChild size="lg">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
