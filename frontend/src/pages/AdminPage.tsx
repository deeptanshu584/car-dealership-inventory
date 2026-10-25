import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  VehicleFormModal,
  type VehiclePayload,
} from '../components/VehicleFormModal';
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
    try {
      setVehicles((await api.get<Page<Vehicle>>('/vehicles?limit=100')).data);
      setError('');
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not load vehicles',
      );
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(value: VehiclePayload) {
    if (editing && editing !== 'new') {
      const updated = await api.put<Vehicle>(`/vehicles/${editing.id}`, value);
      setVehicles((rows) =>
        rows.map((row) => (row.id === updated.id ? updated : row)),
      );
    } else {
      const created = await api.post<Vehicle>('/vehicles', value);
      setVehicles((rows) => [created, ...rows]);
    }
  }

  async function remove() {
    if (!deleting) return;
    try {
      await api.delete(`/vehicles/${deleting.id}`);
      setVehicles((rows) => rows.filter((row) => row.id !== deleting.id));
      setDeleting(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not delete vehicle',
      );
    }
  }

  async function addStock(vehicle: Vehicle) {
    const quantity = Number(restock[vehicle.id]);
    if (!Number.isInteger(quantity) || quantity <= 0)
      return setError('Enter a positive whole-number restock quantity');
    try {
      const updated = await api.post<Vehicle>(
        `/vehicles/${vehicle.id}/restock`,
        { quantity },
      );
      setVehicles((rows) =>
        rows.map((row) => (row.id === vehicle.id ? updated : row)),
      );
      setRestock((values) => ({ ...values, [vehicle.id]: '' }));
      setError('');
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not restock vehicle',
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0b1320] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal text-sm font-black text-white shadow-sm ring-1 ring-white/20">
              M
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Motorhouse
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            ← View inventory
          </Link>
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-teal/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-teal">
              Management
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Admin inventory
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Add new arrivals, update specifications, restock units, or remove
              vehicles.
            </p>
          </div>
          <button
            onClick={() => setEditing('new')}
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-dark hover:shadow-md"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add vehicle
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-subtle"
          >
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="text-xs uppercase hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-subtle">
            <p className="font-medium">Loading inventory…</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-subtle">
            <p className="text-base font-semibold text-ink">
              No vehicles yet. Add your first vehicle.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-subtle transition-all duration-150 hover:border-slate-300 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                      {vehicle.make} {vehicle.model}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      {vehicle.category} · ${vehicle.price.toLocaleString()} ·{' '}
                      {vehicle.quantity} in stock
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => setEditing(vehicle)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-subtle hover:bg-slate-50 hover:text-ink"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(vehicle)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-rose-700 shadow-subtle hover:bg-rose-100"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-rose-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Restock Sub-bar */}
                <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-slate-100 pt-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Restock quantity
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Add qty"
                      value={restock[vehicle.id] ?? ''}
                      onChange={(event) =>
                        setRestock((values) => ({
                          ...values,
                          [vehicle.id]: event.target.value,
                        }))
                      }
                      className="mt-1 block w-32 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-ink focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20"
                    />
                  </label>
                  <button
                    onClick={() => void addStock(vehicle)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal"
                  >
                    Restock
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Edit / Add Modal */}
      {editing && (
        <VehicleFormModal
          vehicle={editing === 'new' ? undefined : editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2
              id="delete-title"
              className="text-xl font-bold tracking-tight text-ink"
            >
              Delete {deleting.make} {deleting.model}?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void remove()}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-rose-700"
              >
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
