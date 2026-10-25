import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VehicleFormModal, type VehiclePayload } from '../components/VehicleFormModal';
import { useAuth } from '../context/AuthContext';
import type { Page, Vehicle } from '../types';

export function AdminPage() {
  const { api } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Vehicle | 'new' | null>(null);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [restock, setRestock] = useState<Record<string, string>>({});
  const load = useCallback(async () => {
    setLoading(true);
    try { setVehicles((await api.get<Page<Vehicle>>('/vehicles?limit=100')).data); setError(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load vehicles'); }
    finally { setLoading(false); }
  }, [api]);
  useEffect(() => { void load(); }, [load]);
  async function save(value: VehiclePayload) {
    if (editing && editing !== 'new') {
      const updated = await api.put<Vehicle>(`/vehicles/${editing.id}`, value);
      setVehicles(rows => rows.map(row => row.id === updated.id ? updated : row));
    } else {
      const created = await api.post<Vehicle>('/vehicles', value);
      setVehicles(rows => [created, ...rows]);
    }
  }
  async function remove() {
    if (!deleting) return;
    try { await api.delete(`/vehicles/${deleting.id}`); setVehicles(rows => rows.filter(row => row.id !== deleting.id)); setDeleting(null); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not delete vehicle'); }
  }
  async function addStock(vehicle: Vehicle) {
    const quantity = Number(restock[vehicle.id]);
    if (!Number.isInteger(quantity) || quantity <= 0) return setError('Enter a positive whole-number restock quantity');
    try { const updated = await api.post<Vehicle>(`/vehicles/${vehicle.id}/restock`, { quantity }); setVehicles(rows => rows.map(row => row.id === vehicle.id ? updated : row)); setRestock(values => ({ ...values, [vehicle.id]: '' })); setError(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not restock vehicle'); }
  }
  return <div className="min-h-screen bg-mist"><header className="bg-ink text-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link to="/" className="text-xl font-extrabold">Motorhouse</Link><Link to="/" className="text-sm font-semibold hover:underline">View inventory</Link></div></header><main className="mx-auto max-w-6xl px-5 py-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-teal">Management</p><h1 className="mt-2 text-3xl font-extrabold text-ink">Admin inventory</h1></div><button onClick={() => setEditing('new')} className="rounded-xl bg-teal px-5 py-3 font-semibold text-white hover:bg-teal/90">Add vehicle</button></div>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}
    {loading ? <p>Loading inventory…</p> : vehicles.length === 0 ? <div className="rounded-2xl bg-white p-10 text-center text-slate-600">No vehicles yet. Add your first vehicle.</div> : <div className="space-y-4">{vehicles.map(vehicle => <article key={vehicle.id} className="rounded-2xl bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-ink">{vehicle.make} {vehicle.model}</h2><p className="mt-1 text-sm text-slate-600">{vehicle.category} · ${vehicle.price.toLocaleString()} · {vehicle.quantity} in stock</p></div><div className="flex gap-2"><button onClick={() => setEditing(vehicle)} className="rounded-lg border px-3 py-2 text-sm font-semibold">Edit</button><button onClick={() => setDeleting(vehicle)} className="rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700">Delete</button></div></div><div className="mt-4 flex items-end gap-2"><label className="text-sm font-semibold">Restock quantity<input type="number" min="1" step="1" value={restock[vehicle.id] ?? ''} onChange={event => setRestock(values => ({ ...values, [vehicle.id]: event.target.value }))} className="mt-1 block w-32 rounded-lg border px-3 py-2" /></label><button onClick={() => void addStock(vehicle)} className="rounded-lg bg-ink px-3 py-2 font-semibold text-white">Restock</button></div></article>)}</div>}
  </main>{editing && <VehicleFormModal vehicle={editing === 'new' ? undefined : editing} onClose={() => setEditing(null)} onSave={save} />}{deleting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"><div role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 id="delete-title" className="text-xl font-bold">Delete {deleting.make} {deleting.model}?</h2><p className="mt-2 text-slate-600">This action cannot be undone.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setDeleting(null)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={() => void remove()} className="rounded-lg bg-red-700 px-4 py-2 font-semibold text-white">Confirm delete</button></div></div></div>}</div>;
}
