import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VehicleCard } from '../components/VehicleCard';
import { SearchFilters, emptyFilters, type Filters } from '../components/SearchFilters';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import type { Page, Vehicle } from '../types';

export function DashboardPage() {
  const { api, user, logout } = useAuth();
  const [result, setResult] = useState<Page<Vehicle> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [debounced, setDebounced] = useState<Filters>(filters);
  useEffect(() => { const id = setTimeout(() => setDebounced(filters), 300); return () => clearTimeout(id); }, [filters]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(debounced)) if (value) params.set(key, value);
      const hasFilters = params.size > 0;
      params.set('page', String(page)); params.set('limit', '12');
      setResult(await api.get<Page<Vehicle>>(`/vehicles${hasFilters ? '/search' : ''}?${params.toString()}`));
    }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load vehicles'); }
    finally { setLoading(false); }
  }, [api, page, debounced]);
  useEffect(() => { void load(); }, [load]);
  async function purchase(vehicle: Vehicle) {
    setBuyingId(vehicle.id); setToast('');
    try {
      const updated = await api.post<Vehicle>(`/vehicles/${vehicle.id}/purchase`, {});
      setResult(current => current ? { ...current, data: current.data.map(item => item.id === updated.id ? updated : item) } : current);
      setToast('Purchase successful');
    } catch (cause) {
      setToast(cause instanceof ApiError && cause.status === 409 ? 'Out of stock. Inventory refreshed.' : cause instanceof Error ? cause.message : 'Purchase failed');
      if (cause instanceof ApiError && cause.status === 409) void load();
    } finally { setBuyingId(null); }
  }
  return <div className="min-h-screen bg-mist">
    <header className="bg-gradient-to-r from-ink to-teal text-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5"><Link to="/" className="text-xl font-extrabold tracking-tight">Motorhouse</Link><div className="flex items-center gap-4 text-sm"><span className="hidden sm:inline">Hi, {user?.name}</span>{user?.role === 'ADMIN' && <Link to="/admin" className="font-semibold underline-offset-4 hover:underline">Admin</Link>}<button onClick={logout} className="rounded-lg border border-white/50 px-3 py-2 hover:bg-white/10">Log out</button></div></div></header>
    <main className="mx-auto max-w-7xl px-5 py-10"><div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-teal">The collection</p><h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">Find your next drive</h1><p className="mt-3 max-w-2xl text-slate-600">Browse thoughtfully selected vehicles and see live availability.</p></div>
    {toast && <div role="status" aria-live="polite" className="mb-5 rounded-xl bg-teal/10 p-4 font-medium text-ink">{toast}</div>}
    <SearchFilters value={filters} onChange={value => { setFilters(value); setPage(1); }} />
    {loading ? <div aria-label="Loading vehicles" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-slate-200 motion-reduce:animate-none" />)}</div> : error ? <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6"><p>{error}</p><button onClick={() => void load()} className="mt-3 font-semibold text-teal underline">Retry</button></div> : result?.data.length ? <><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{result.data.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={purchase} busy={buyingId === vehicle.id} />)}</div><div className="mt-8 flex items-center justify-center gap-4"><button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page}</span><button disabled={page * 12 >= result.total} onClick={() => setPage(page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></div></> : <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">No vehicles are available yet.</div>}
    </main></div>;
}
