import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { VariantSelector } from './VariantSelector';
import type { ProductVariant, VariantSelection } from '../types';

const variants: ProductVariant[] = [
  { name: 'Size', options: ['S', 'M', 'L'] },
  { name: 'Color', options: ['Black', 'White'] },
];

function Harness({ onChange }: { onChange?: (next: VariantSelection[]) => void }) {
  const [selected, setSelected] = useState<VariantSelection[]>([]);
  return (
    <VariantSelector
      variants={variants}
      selected={selected}
      onChange={(next) => {
        setSelected(next);
        onChange?.(next);
      }}
    />
  );
}

describe('VariantSelector', () => {
  it('renders a group per variant with all of its options', () => {
    render(<Harness />);

    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'M' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'White' })).toBeInTheDocument();
  });

  it('marks the chosen option as pressed', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'M' }));

    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'S' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('replaces the previous value when another option of the same variant is picked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'S' }));
    await user.click(screen.getByRole('button', { name: 'L' }));

    expect(onChange).toHaveBeenLastCalledWith([{ name: 'Size', value: 'L' }]);
  });

  it('keeps selections from different variants side by side', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'M' }));
    await user.click(screen.getByRole('button', { name: 'Black' }));

    expect(onChange).toHaveBeenLastCalledWith([
      { name: 'Size', value: 'M' },
      { name: 'Color', value: 'Black' },
    ]);
  });

  it('renders nothing when the product has no variants', () => {
    const { container } = render(<VariantSelector variants={[]} selected={[]} onChange={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
