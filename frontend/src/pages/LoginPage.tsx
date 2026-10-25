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
    try { await login(email, password); navigate('/'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Sign in failed'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-mist flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-ink/10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">Motorhouse</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">Welcome back</h1>
      <p className="mt-2 text-slate-600">Sign in to explore and manage inventory.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block text-sm font-semibold text-ink">Email<input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal focus:ring-2 focus:ring-teal/30" /></label>
        <label className="block text-sm font-semibold text-ink">Password<input required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal focus:ring-2 focus:ring-teal/30" /></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-teal px-4 py-3 font-semibold text-white transition hover:bg-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">New here? <Link className="font-semibold text-teal underline-offset-4 hover:underline" to="/register">Create an account</Link></p>
    </div>
  </main>;
}
