import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '@/shared/api/httpClient';
import { Button } from '@/shared/components/ui/button';
import { FieldLabel, Input } from '@/shared/components/ui/input';
import { useAuth } from '../hooks/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Checked client-side before the request fires, so a shopper finds out about a typo'd
   * email or a mismatched password without waiting on a round trip — but the backend
   * re-validates everything regardless, since client checks are a UX nicety, not a
   * security boundary.
   */
  function validate(): string | null {
    if (name.trim().length < 2) return 'Enter your name.';
    if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim().toLowerCase(), password, name.trim());
      void navigate('/products', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between border-r-2 border-ink bg-ink p-10 text-paper lg:flex">
        <p className="display text-3xl text-paper">
          Shop<span className="text-accent">hub</span>
        </p>

        <h1 className="display text-[clamp(4rem,8vw,7rem)] text-paper">
          Join
          <br />
          the
          <br />
          <span className="text-accent">warehouse.</span>
        </h1>

        <p className="max-w-xs text-sm leading-relaxed text-paper/60">
          Create an account to save items, track orders, and check out faster.
        </p>
      </section>

      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="display text-4xl lg:hidden">
            Shop<span className="text-accent [-webkit-text-stroke:1px_var(--color-ink)]">hub</span>
          </p>

          <h2 className="display mt-2 text-5xl lg:mt-0">Create account</h2>
          <p className="mt-2 text-sm text-ink-soft">Takes about thirty seconds.</p>

          <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                autoComplete="new-password"
                required
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-ink-muted">At least {MIN_PASSWORD_LENGTH} characters.</p>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="border-2 border-danger bg-surface px-3 py-2.5 text-sm text-danger" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-ink-soft">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-ink underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
