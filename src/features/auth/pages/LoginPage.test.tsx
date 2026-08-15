import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { tokenStore } from '@/shared/api/tokenStore';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('stores the access token in memory after a successful sign-in', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'demo@mini-ecommerce.test');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(tokenStore.get()).toBe('mock-access-token'));
    // The token must never be persisted where an XSS payload could read it.
    expect(localStorage.getItem('mini-ecommerce.user')).not.toContain('mock-access-token');
  });

  it('surfaces the server error message when credentials are rejected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'demo@mini-ecommerce.test');
    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
  });
});
