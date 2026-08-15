import { CheckCircle2 } from 'lucide-react';
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
      <main className="mx-auto max-w-3xl px-6 py-12">
        <ErrorState message="We couldn't load this order." onRetry={() => void refetch()} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-success" aria-hidden />
        <h1 className="text-3xl tracking-tight">Order confirmed</h1>
      </div>

      <p className="mt-3 text-ink-soft">
        Thank you — your order <span className="text-ink">#{order.id.slice(-8)}</span> was placed on{' '}
        {new Date(order.createdAt).toLocaleDateString()}.
      </p>

      <section className="mt-8 border border-line bg-surface">
        <h2 className="border-b border-line px-6 py-4 text-lg">What you ordered</h2>

        <ul className="px-6">
          {order.items.map((line, index) => (
            <li
              key={`${line.productId}-${index}`}
              className="flex justify-between gap-4 border-b border-line py-4 last:border-b-0"
            >
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
          <span className="text-ink-soft">Total paid</span>
          <span className="text-xl">{formatPrice(order.total)}</span>
        </div>
      </section>

      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to="/products">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
