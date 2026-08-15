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
    <div className="flex flex-col gap-6">
      {variants.map((variant) => {
        const activeValue = selected.find((entry) => entry.name === variant.name)?.value;

        return (
          <fieldset key={variant.name}>
            <legend className="mb-2.5 text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
              {variant.name}
              {activeValue && <span className="ml-2 text-ink normal-case">{activeValue}</span>}
            </legend>

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
                      'min-w-12 border-2 px-3.5 py-2 text-sm font-semibold uppercase transition-colors',
                      isActive
                        ? 'border-ink bg-ink text-paper'
                        : 'border-line bg-surface text-ink hover:border-ink',
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
