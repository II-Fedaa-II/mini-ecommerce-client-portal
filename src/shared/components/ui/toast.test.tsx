import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ToastProvider, useToast } from './toast';

function Harness() {
  const toast = useToast();
  return (
    <>
      <button onClick={() => toast.success('Saved.')}>trigger success</button>
      <button onClick={() => toast.error('Out of stock.')}>trigger error</button>
    </>
  );
}

function renderHarness() {
  return render(
    <ToastProvider>
      <Harness />
    </ToastProvider>,
  );
}

describe('ToastProvider', () => {
  it('announces a success politely', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'trigger success' }));

    const toast = await screen.findByRole('status');
    expect(toast).toHaveTextContent('Saved.');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('announces an error assertively so it is not missed', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'trigger error' }));

    const toast = await screen.findByRole('alert');
    expect(toast).toHaveTextContent('Out of stock.');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('stacks multiple notifications rather than replacing them', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'trigger success' }));
    await user.click(screen.getByRole('button', { name: 'trigger error' }));

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  it('can be dismissed by hand', async () => {
    const user = userEvent.setup();
    renderHarness();

    await user.click(screen.getByRole('button', { name: 'trigger error' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));

    await waitFor(() =>
      expect(screen.queryByRole('alert')).not.toBeInTheDocument(),
    );
  });

  it('throws when used outside a provider, so a missing provider fails loudly', () => {
    // React logs the error boundary trace; the assertion is the contract that matters.
    expect(() => render(<Harness />)).toThrow(/ToastProvider/);
  });
});
