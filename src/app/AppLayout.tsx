import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/components/Navbar';

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
