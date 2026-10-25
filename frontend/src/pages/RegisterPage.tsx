import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) return setError('Password needs 8 characters, a letter, and a digit');
    setBusy(true); setError('');
    try { await register(name, email, password); navigate('/'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Registration failed'); }
    finally { setBusy(false); }
  }
  const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal focus:ring-2 focus:ring-teal/30';
  return <main className="min-h-screen bg-mist flex items-center justify-center px-4 py-12"><div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-ink/10">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">Motorhouse</p><h1 className="mt-3 text-3xl font-bold text-ink">Create your account</h1>
    <p className="mt-2 text-slate-600">Find your next car in a few clicks.</p>
    <form onSubmit={submit} className="mt-8 space-y-4">
      <label className="block text-sm font-semibold text-ink">Name<input required value={name} onChange={event => setName(event.target.value)} autoComplete="name" className={inputClass} /></label>
      <label className="block text-sm font-semibold text-ink">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" className={inputClass} /></label>
      <label className="block text-sm font-semibold text-ink">Password<input required type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" className={inputClass} /></label>
      <label className="block text-sm font-semibold text-ink">Confirm password<input required type="password" value={confirm} onChange={event => setConfirm(event.target.value)} autoComplete="new-password" className={inputClass} /></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-teal px-4 py-3 font-semibold text-white transition hover:bg-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:opacity-60">{busy ? 'Creating account…' : 'Create account'}</button>
    </form><p className="mt-6 text-center text-sm text-slate-600">Already registered? <Link className="font-semibold text-teal hover:underline" to="/login">Sign in</Link></p>
  </div></main>;
}
