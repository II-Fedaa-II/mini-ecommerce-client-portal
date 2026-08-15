import { Heart, LogOut, ShoppingBag } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWishlist } from '@/features/wishlist/hooks/useWishlist';
import { cn } from '@/shared/lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  async function handleLogout() {
    await logout();
    void navigate('/login', { replace: true });
  }

  const iconLink = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative flex h-10 items-center gap-2 border-2 px-3 text-[11px] font-bold tracking-[0.12em] uppercase transition-colors',
      isActive ? 'border-ink bg-ink text-paper' : 'border-ink bg-transparent text-ink hover:bg-accent',
    );

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <NavLink to="/products" className="display text-3xl tracking-tight">
          Shop<span className="text-accent [-webkit-text-stroke:1px_var(--color-ink)]">hub</span>
        </NavLink>

        <nav className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/wishlist" className={iconLink} aria-label="Saved items">
            <Heart className="h-4 w-4" aria-hidden strokeWidth={2.5} />
            <span className="hidden sm:inline">Saved</span>
            {wishlistCount > 0 && <Badge value={wishlistCount} />}
          </NavLink>

          <NavLink to="/cart" className={iconLink} aria-label="Shopping bag">
            <ShoppingBag className="h-4 w-4" aria-hidden strokeWidth={2.5} />
            <span className="hidden sm:inline">Bag</span>
            {cartCount > 0 && <Badge value={cartCount} />}
          </NavLink>

          <span className="hidden max-w-[12ch] truncate text-[11px] font-bold tracking-[0.12em] text-ink-soft uppercase md:inline">
            {user?.name}
          </span>

          <button
            onClick={() => void handleLogout()}
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            <LogOut className="h-4 w-4" aria-hidden strokeWidth={2.5} />
          </button>
        </nav>
      </div>
    </header>
  );
}

function Badge({ value }: { value: number }) {
  return (
    <span className="tabular absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center border-2 border-ink bg-accent px-1 text-[10px] font-bold text-ink">
      {value}
    </span>
  );
}
