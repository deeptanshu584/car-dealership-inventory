import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-ink to-ink-deep px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-lg font-black text-white shadow-sm ring-1 ring-white/20">
            M
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">
              Motorhouse
            </p>
            <p className="text-[11px] font-medium text-slate-400">
              Inventory Portal
            </p>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to explore and manage showroom inventory.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </label>

          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Password
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700"
            >
              {error}
            </p>
          )}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-teal px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-600">
          New here?{' '}
          <Link
            className="font-bold text-teal underline-offset-4 hover:underline"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
