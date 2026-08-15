import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

export function ProductListingPage() {
  const { data: products, isLoading, isError, refetch } = useProducts();

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
              Fifteen things worth owning, photographed properly and priced without theatre.
              Every size and colourway on this page is in the warehouse today.
            </p>
            <p className="display text-5xl text-paper">
              {products ? String(products.length).padStart(2, '0') : '—'}
              <span className="ml-2 font-sans text-[11px] font-bold tracking-[0.14em] text-paper/60 uppercase">
                products
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {isLoading && <LoadingState label="Loading the catalogue" />}
        {isError && (
          <ErrorState message="We couldn't load the catalogue." onRetry={() => void refetch()} />
        )}

        {products && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
