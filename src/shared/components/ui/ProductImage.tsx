import { useState, type SyntheticEvent } from 'react';
import { API_URL } from '@/shared/api/httpClient';

/** Uploaded images come back as `/uploads/xxx`, relative to the API origin, not this
 * app's — an absolute URL (seeded Unsplash photos) is left untouched. */
export function resolveImageUrl(src: string | null | undefined): string | null {
  if (!src) return null;
  return /^https?:\/\//.test(src) ? src : `${API_URL}${src}`;
}

interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
  letterClassName?: string;
}

/**
 * A dead or slow-to-404 URL (a deprecated Unsplash photo, a moved upload) must not ship
 * as blank space — it degrades to the same monogram placeholder a product with no image
 * ever shows, so the two failure modes are visually indistinguishable to a shopper.
 */
export function ProductImage({ src, alt, className, letterClassName }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(src);

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.onerror = null;
    setFailed(true);
  }

  if (!resolved || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className={letterClassName ?? 'display text-6xl text-line'}>
          {alt.slice(0, 1)}
        </span>
      </div>
    );
  }

  return (
    <img src={resolved} alt={alt} loading="lazy" className={className} onError={handleError} />
  );
}
