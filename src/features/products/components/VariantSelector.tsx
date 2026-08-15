import type { ProductVariant, VariantSelection } from '../types';
import { cn } from '@/shared/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: VariantSelection[];
  onChange: (selection: VariantSelection[]) => void;
}

export function VariantSelector({ variants, selected, onChange }: VariantSelectorProps) {
  if (variants.length === 0) return null;

  function selectOption(name: string, value: string) {
    const next = selected.filter((entry) => entry.name !== name);
    next.push({ name, value });
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-5">
      {variants.map((variant) => {
        const activeValue = selected.find((entry) => entry.name === variant.name)?.value;

        return (
          <fieldset key={variant.name}>
            <legend className="mb-2 text-sm text-ink-soft">{variant.name}</legend>
            <div className="flex flex-wrap gap-2">
              {variant.options.map((option) => {
                const isActive = activeValue === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => selectOption(variant.name, option)}
                    className={cn(
                      'border px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'border-ink bg-ink text-white'
                        : 'border-line bg-surface text-ink-soft hover:border-ink-muted hover:text-ink',
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
