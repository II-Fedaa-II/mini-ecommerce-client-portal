import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { FieldLabel, Input } from '@/shared/components/ui/input';
import { Pagination } from '@/shared/components/ui/Pagination';
import { EmptyState, ErrorState, LoadingState } from '@/shared/components/ui/states';
import { errorMessage } from '@/shared/lib/errorMessage';
import { formatPrice } from '@/shared/lib/utils';
import { useOrderHistory } from '../hooks/useCheckout';

const PAGE_SIZE = 8;

export function OrderHistoryPage() {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const hasActiveFilter = Boolean(dateFrom || dateTo);

  const { data, isLoading, isError, error, isPlaceholderData, refetch } = useOrderHistory({
    page,
    limit: PAGE_SIZE,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  function handleDateFromChange(value: string) {
    setDateFrom(value);
    setPage(1);
  }

  function handleDateToChange(value: string) {
    setDateTo(value);
    setPage(1);
  }

  function clearFilter() {
    setDateFrom('');
    setDateTo('');
    setPage(1);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <header className="mb-8 border-b-2 border-ink pb-6">
        <h1 className="display text-[clamp(3rem,9vw,6rem)]">Your orders</h1>
      </header>

      <div className="mb-8 flex flex-wrap items-end gap-4 border-2 border-ink bg-surface p-5">
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="date-from">From</FieldLabel>
          <Input
            id="date-from"
            type="date"
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => handleDateFromChange(e.target.value)}
            className="h-11 w-44"
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="date-to">To</FieldLabel>
          <Input
            id="date-to"
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => handleDateToChange(e.target.value)}
            className="h-11 w-44"
          />
        </div>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilter}
            className="mb-0.5 flex items-center gap-1 text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase transition-colors hover:text-danger"
          >
            <X className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
            Clear
          </button>
        )}
      </div>

      {isLoading && <LoadingState label="Loading your orders" />}
      {isError && (
        <ErrorState
          message={errorMessage(error, "We couldn't load your orders.")}
          onRetry={() => void refetch()}
        />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          title={hasActiveFilter ? 'No orders in that range' : 'No orders yet'}
          description={
            hasActiveFilter
              ? 'Try a wider date range.'
              : 'Everything you buy will show up here, with the exact items and total for each order.'
          }
          action={
            hasActiveFilter ? (
              <Button variant="outline" onClick={clearFilter}>
                Clear filter
              </Button>
            ) : (
              <Button asChild>
                <Link to="/products">Start shopping</Link>
              </Button>
            )
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
