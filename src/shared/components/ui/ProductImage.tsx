import { useState, type SyntheticEvent } from 'react';

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

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.onerror = null;
    setFailed(true);
  }

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className={letterClassName ?? 'display text-6xl text-line'}>
          {alt.slice(0, 1)}
        </span>
      </div>
    );
  }

  return (
    <img src={src} alt={alt} loading="lazy" className={className} onError={handleError} />
  );
}
