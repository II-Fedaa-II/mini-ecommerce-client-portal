import { ErrorState, LoadingState } from '@/shared/components/ui/states';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

export function ProductListingPage() {
  const { data: products, isLoading, isError, refetch } = useProducts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl tracking-tight">Catalogue</h1>
        <p className="mt-2 text-ink-soft">
          {products ? `${products.length} products available` : 'Browse the full collection'}
        </p>
      </header>

      {isLoading && <LoadingState label="Loading products" />}

      {isError && <ErrorState message="We couldn't load the catalogue." onRetry={() => void refetch()} />}

      {products && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
