'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FiHome, FiPackage, FiGrid, FiShoppingBag, FiUsers,
  FiTag, FiBarChart2, FiLogOut, FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { href: '/admin', icon: FiHome, label: 'Dashboard', exact: true },
  { href: '/admin/products', icon: FiPackage, label: 'Products' },
  { href: '/admin/categories', icon: FiGrid, label: 'Categories' },
  { href: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { href: '/admin/users', icon: FiUsers, label: 'Users' },
  { href: '/admin/coupons', icon: FiTag, label: 'Coupons' },
];

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login?redirect=/admin');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (href, exact) => exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark fixed h-full z-30 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-dark-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-xl">🍿</div>
            <div>
              <div className="font-display font-bold text-white text-base">Namkeen Store</div>
              <div className="text-xs text-primary-400 font-semibold">Admin Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                isActive(href, exact)
                  ? 'bg-primary-500 text-white shadow-orange'
                  : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              }`}>
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-white text-sm truncate">{user?.name}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors font-semibold text-sm">
            <FiLogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-w-0">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
