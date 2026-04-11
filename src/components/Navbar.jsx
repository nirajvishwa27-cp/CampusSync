// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { logoutUser } from '../features/auth/authService';
import toast from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import { ROLES } from '../lib/constants';

export default function Navbar() {
  const authUser = useStore((s) => s.authUser);
  const clearAuth = useStore((s) => s.clearAuth);
  const theme = useStore((s) => s.theme);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuth();
      setMobileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      toast.error(error?.message || 'Logout failed.');
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/floorplan', label: 'Floor Plan' },
    ...(authUser?.role === ROLES.ADMIN
      ? [
          { to: '/admin', label: 'Admin' },
          { to: '/admin/analytics', label: 'Analytics' },
        ]
      : []),
    ...(authUser?.role === ROLES.FACULTY
      ? [{ to: '/faculty', label: 'Faculty' }]
      : []),
  ];

  const linkClass = `rounded-lg border-2 border-transparent px-3 py-2 text-sm font-bold transition-all ${
    isDark
      ? 'text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100'
      : 'text-slate-600 hover:border-slate-900 hover:bg-yellow-400 hover:text-slate-900'
  }`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b-2 ${isDark ? 'border-slate-700 bg-[#1a1a1a]' : 'border-slate-900 bg-[#fdfbf7]'}/95 backdrop-blur-sm`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${isDark ? 'bg-yellow-600' : 'bg-yellow-400'} text-xs font-black ${isDark ? 'text-slate-100' : 'text-slate-900'} shadow-sm ring-1 ring-slate-900/20`}
            >
              CS
            </div>
            <div>
              <span
                className={`font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
              >
                CampusSync
              </span>
              <p
                className={`hidden font-mono text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'} sm:block`}
              >
                Home
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {authUser && (
              <span
                className={`hidden rounded-full border-2 ${isDark ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-900 bg-white text-slate-700'} px-3 py-1 text-xs font-bold uppercase lg:block`}
              >
                {authUser.role}
              </span>
            )}
            {authUser && (
              <span
                className={`hidden max-w-[140px] truncate text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} lg:block`}
              >
                {authUser.name}
              </span>
            )}

            <button
              onClick={handleLogout}
              className={`rounded-xl border-2 border-slate-900 px-4 py-2 text-sm font-bold transition-all duration-200 active:scale-95 ${
                isDark
                  ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-yellow-400'
              } hidden sm:inline-flex`}
            >
              Logout
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 transition-all md:hidden ${
                isDark
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'bg-white text-slate-900 hover:bg-yellow-400'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className={`mt-3 rounded-xl border-2 p-2 md:hidden ${isDark ? 'border-slate-700 bg-slate-800/95' : 'border-slate-900 bg-white'}`}
          >
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold ${
                    isDark
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-slate-700 hover:bg-yellow-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className={`mt-1 rounded-lg border-2 border-slate-900 px-3 py-2.5 text-sm font-bold ${
                  isDark
                    ? 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-white text-slate-900 hover:bg-yellow-400'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
