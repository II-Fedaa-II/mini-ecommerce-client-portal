import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '@/shared/api/httpClient';
import { Button } from '@/shared/components/ui/button';
import { FieldLabel, Input } from '@/shared/components/ui/input';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/products';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      void navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left plate carries the identity so the form itself can stay plain. */}
      <section className="hidden flex-col justify-between border-r-2 border-ink bg-ink p-10 text-paper lg:flex">
        <p className="display text-3xl text-paper">
          Shop<span className="text-accent">hub</span>
        </p>

        <h1 className="display text-[clamp(4rem,8vw,7rem)] text-paper">
          Fifteen
          <br />
          things
          <br />
          <span className="text-accent">worth</span>
          <br />
          owning.
        </h1>

        <p className="max-w-xs text-sm leading-relaxed text-paper/60">
          Photographed properly, priced without theatre, and in the warehouse today.
        </p>
      </section>

      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="display text-4xl lg:hidden">
            Shop<span className="text-accent [-webkit-text-stroke:1px_var(--color-ink)]">hub</span>
          </p>

          <h2 className="display mt-2 text-5xl lg:mt-0">Sign in</h2>
          <p className="mt-2 text-sm text-ink-soft">Your bag and saved items are waiting.</p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="border-2 border-danger bg-surface px-3 py-2.5 text-sm text-danger" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-soft">
            New here?{' '}
            <Link to="/signup" className="font-semibold text-ink underline underline-offset-4">
              Create an account
            </Link>
          </p>

          <div className="mt-8 border-2 border-dashed border-line p-4">
            <p className="text-[11px] font-bold tracking-[0.14em] text-ink-soft uppercase">
              Demo account
            </p>
            <p className="mt-2 text-sm text-ink">demo@mini-ecommerce.test</p>
            <p className="text-sm text-ink">Password123!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
