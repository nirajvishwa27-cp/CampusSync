// src/pages/Login.jsx
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../features/auth/authService';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import { ROLES } from '../lib/constants';

const getRoleHome = (role) => {
  if (role === ROLES.ADMIN) return '/admin';
  if (role === ROLES.FACULTY) return '/faculty';
  return '/dashboard';
};

export default function Login({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const setAuthUser = useStore((s) => s.setAuthUser);
  const navigate = useNavigate();
  const location = useLocation();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password)
      return toast.error('Fill in all fields.');

    // Password validation
    if (mode === 'register' && form.password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    // Email validation
    if (!form.email.includes('@')) {
      return toast.error('Please enter a valid email address.');
    }

    setLoading(true);
    try {
      let user;
      if (mode === 'login') {
        user = await loginUser(form.email, form.password);
      } else {
        if (!form.name) return toast.error('Name required.');
        user = await registerUser(
          form.name,
          form.email,
          form.password,
          form.role
        );
      }
      setAuthUser(user);
      toast.success(`Welcome, ${user.name}!`);
      const redirectTo = location.state?.redirectTo;
      navigate(redirectTo || getRoleHome(user.role), { replace: true });
    } catch (err) {
      toast.error(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-500/30">
            CS
          </div>
          <h1 className="type-heading-lg" style={{ color: 'var(--text)' }}>
            CampusSync
          </h1>
          <p className="mt-1 type-body" style={{ color: 'var(--text-muted)' }}>
            Real-time campus room availability
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--bg-elevated)',
            boxShadow: '0 14px 32px rgba(var(--shadow), 0.12)',
          }}
        >
          {/* Tab toggle */}
          <div
            className="mb-6 flex rounded-xl p-1"
            style={{ background: 'var(--bg-soft)' }}
          >
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all capitalize ${
                  mode === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:text-slate-700'
                }`}
                style={mode === m ? undefined : { color: 'var(--text-muted)' }}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="mb-1.5 block type-eyebrow text-slate-500">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Jane Doe"
                    className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                      background: 'var(--bg-elevated)',
                    }}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block type-eyebrow text-slate-500">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={update('role')}
                    className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                      background: 'var(--bg-elevated)',
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block type-eyebrow text-slate-500">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@university.edu"
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  background: 'var(--bg-elevated)',
                }}
              />
            </div>

            <div>
              <label className="mb-1.5 block type-eyebrow text-slate-500">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  background: 'var(--bg-elevated)',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/30 transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
          </button>

          {mode === 'login' && (
            <p
              className="mt-4 text-center type-caption"
              style={{ color: 'var(--text-subtle)' }}
            >
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          )}
        </div>

        <p
          className="mt-4 text-center type-caption"
          style={{ color: 'var(--text-subtle)' }}
        >
          Campus Room Availability System
        </p>
      </div>
    </div>
  );
}
