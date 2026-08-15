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

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative inline-flex items-center gap-2 px-1 py-1 text-sm transition-colors',
      isActive ? 'text-ink' : 'text-ink-soft hover:text-ink',
    );

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/products" className="text-xl tracking-tight">
          Mini E-Commerce
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink to="/products" className={linkClass}>
            Catalogue
          </NavLink>

          <NavLink to="/wishlist" className={linkClass}>
            <Heart className="h-4 w-4" aria-hidden />
            Wishlist
            {wishlistCount > 0 && <CountBadge value={wishlistCount} />}
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Cart
            {cartCount > 0 && <CountBadge value={cartCount} />}
          </NavLink>

          <span className="hidden text-sm text-ink-muted sm:inline">{user?.name}</span>

          <button
            className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
            onClick={() => void handleLogout()}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
}

function CountBadge({ value }: { value: number }) {
  return (
    <span className="ml-1 min-w-5 border border-line px-1.5 text-center text-xs leading-5 text-ink-soft">{value}</span>
  );
}
