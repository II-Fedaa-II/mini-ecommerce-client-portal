import { useMemo, useState } from 'react';
import { Pagination } from '@/shared/components/ui/Pagination';
import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import type { ProductSort } from '../types';

const PAGE_SIZE = 9;

export function ProductListingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ProductSort>('title_asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort,
      search: search.trim() || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock || undefined,
    }),
    [page, sort, search, minPrice, maxPrice, inStock],
  );

  const { data, isLoading, isError, isPlaceholderData, refetch } = useProducts(query);

  const hasActiveFilters = Boolean(search || minPrice || maxPrice || inStock);

  // Any filter change invalidates the current page; jumping back to page 1 avoids
  // landing on a now-empty page (e.g. page 3 of a search that only has one result).
  function resetToFirstPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function clearFilters() {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setInStock(false);
    setPage(1);
  }

  return (
    <main>
      {/* The masthead is the thesis: the catalogue announces itself at poster scale
          before a single product appears. */}
      <section className="border-b-2 border-ink bg-ink px-6 py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="display text-[clamp(3.5rem,12vw,9rem)] text-paper">
            Everything
            <br />
            <span className="text-accent">in stock.</span>
          </h1>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t-2 border-paper/25 pt-6">
            <p className="max-w-md text-sm leading-relaxed text-paper/70">
              Worth owning, photographed properly and priced without theatre. Every size and
              colourway on this page is in the warehouse today.
            </p>
            <p className="display text-5xl text-paper">
              {data ? String(data.total).padStart(2, '0') : '—'}
              <span className="ml-2 font-sans text-[11px] font-bold tracking-[0.14em] text-paper/60 uppercase">
                products
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <ProductFilters
          search={search}
          onSearchChange={resetToFirstPage(setSearch)}
          sort={sort}
          onSortChange={resetToFirstPage(setSort)}
          minPrice={minPrice}
          onMinPriceChange={resetToFirstPage(setMinPrice)}
          maxPrice={maxPrice}
          onMaxPriceChange={resetToFirstPage(setMaxPrice)}
          inStock={inStock}
          onInStockChange={resetToFirstPage(setInStock)}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {isLoading && <LoadingState label="Loading the catalogue" />}
        {isError && (
          <ErrorState message="We couldn't load the catalogue." onRetry={() => void refetch()} />
        )}

        {data && data.items.length === 0 && (
          <p className="border-2 border-dashed border-line bg-surface px-6 py-16 text-center text-ink-soft">
            No products match those filters.
          </p>
        )}

        {data && data.items.length > 0 && (
          <div
            className={isPlaceholderData ? 'opacity-50 transition-opacity' : 'transition-opacity'}
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {data && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            disabled={isPlaceholderData}
          />
        )}
      </section>
    </main>
  );
}
