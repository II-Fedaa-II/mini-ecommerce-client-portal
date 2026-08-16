import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Pagination } from '@/shared/components/ui/Pagination';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { errorMessage } from '@/shared/lib/errorMessage';
import { formatPrice } from '@/shared/lib/utils';
import { useOrderHistory } from '../hooks/useCheckout';

const PAGE_SIZE = 8;

export function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isPlaceholderData, refetch } = useOrderHistory(page, PAGE_SIZE);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <header className="mb-8 border-b-2 border-ink pb-6">
        <h1 className="display text-[clamp(3rem,9vw,6rem)]">Your orders</h1>
      </header>

      {isLoading && <LoadingState label="Loading your orders" />}
      {isError && (
        <ErrorState
          message={errorMessage(error, "We couldn't load your orders.")}
          onRetry={() => void refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          title="No orders yet"
          description="Everything you buy will show up here, with the exact items and total for each order."
          action={
            <Button asChild>
              <Link to="/products">Start shopping</Link>
            </Button>
          }
        />
      )}

      {data && data.items.length > 0 && (
        <ul
          className={
            isPlaceholderData ? 'flex flex-col opacity-50 transition-opacity' : 'flex flex-col transition-opacity'
          }
        >
          {data.items.map((order) => (
            <li key={order.id} className="border-2 border-ink border-t-0 first:border-t-2">
              <Link
                to={`/orders/${order.id}`}
                className="flex items-center justify-between gap-6 bg-surface px-6 py-5 transition-colors hover:bg-paper"
              >
                <div className="min-w-0">
                  <p className="display text-2xl leading-none">
                    Order <span className="tabular">#{order.id.slice(-8)}</span>
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold tracking-[0.1em] text-ink-soft uppercase">
                    {new Date(order.createdAt).toLocaleDateString()} ·{' '}
                    {order.items.reduce((sum, line) => sum + line.quantity, 0)} item
                    {order.items.reduce((sum, line) => sum + line.quantity, 0) === 1 ? '' : 's'}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <p className="display tabular text-2xl">{formatPrice(order.total)}</p>
                  <ArrowRight className="h-4 w-4 text-ink-muted" aria-hidden strokeWidth={2.5} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
          disabled={isPlaceholderData}
        />
      )}
    </main>
  );
}
