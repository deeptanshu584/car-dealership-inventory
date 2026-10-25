import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VehicleCard } from '../components/VehicleCard';
import {
  SearchFilters,
  emptyFilters,
  type Filters,
} from '../components/SearchFilters';
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

  useEffect(() => {
    const id = setTimeout(() => setDebounced(filters), 300);
    return () => clearTimeout(id);
  }, [filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(debounced))
        if (value) params.set(key, value);
      const hasFilters = params.size > 0;
      params.set('page', String(page));
      params.set('limit', '12');
      setResult(
        await api.get<Page<Vehicle>>(
          `/vehicles${hasFilters ? '/search' : ''}?${params.toString()}`,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not load vehicles',
      );
    } finally {
      setLoading(false);
    }
  }, [api, page, debounced]);

  useEffect(() => {
    void load();
  }, [load]);

  async function purchase(vehicle: Vehicle) {
    setBuyingId(vehicle.id);
    setToast('');
    try {
      const updated = await api.post<Vehicle>(
        `/vehicles/${vehicle.id}/purchase`,
        {},
      );
      setResult((current) =>
        current
          ? {
              ...current,
              data: current.data.map((item) =>
                item.id === updated.id ? updated : item,
              ),
            }
          : current,
      );
      setToast('Purchase successful');
    } catch (cause) {
      setToast(
        cause instanceof ApiError && cause.status === 409
          ? 'Out of stock. Inventory refreshed.'
          : cause instanceof Error
            ? cause.message
            : 'Purchase failed',
      );
      if (cause instanceof ApiError && cause.status === 409) void load();
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      {/* Luxury Showroom Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#0b1320] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal text-base font-black text-white shadow-sm ring-1 ring-white/20 transition-transform group-hover:scale-105">
              M
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Motorhouse
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5 text-sm">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-slate-200">
                Hi, {user?.name}
              </span>
            </div>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal/40 bg-teal/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-light transition hover:bg-teal hover:text-white"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Admin
              </Link>
            )}

            <button
              onClick={logout}
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 border-b border-slate-200/80 pb-6">
          <div className="inline-flex items-center gap-2 rounded-md bg-teal/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-teal">
            The collection
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Find your next drive
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            Browse thoughtfully selected vehicles and see live availability.
          </p>
        </div>

        {/* Feedback Toast */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 flex items-center justify-between rounded-xl border border-teal/30 bg-teal/10 px-5 py-3.5 text-sm font-semibold text-teal-dark shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <svg
                className="h-5 w-5 text-teal"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{toast}</span>
            </div>
            <button
              onClick={() => setToast('')}
              className="text-xs font-bold uppercase text-teal-dark hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Controls */}
        <SearchFilters
          value={filters}
          onChange={(value) => {
            setFilters(value);
            setPage(1);
          }}
        />

        {/* Vehicle Catalog Grid & States */}
        {loading ? (
          <div
            aria-label="Loading vehicles"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex h-[360px] animate-pulse flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle motion-reduce:animate-none"
              >
                <div>
                  <div className="flex justify-between">
                    <div className="h-5 w-20 rounded bg-slate-200" />
                    <div className="h-5 w-24 rounded-full bg-slate-200" />
                  </div>
                  <div className="my-4 h-28 w-full rounded-xl bg-slate-100" />
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="mb-4 flex justify-between">
                    <div className="h-4 w-12 rounded bg-slate-200" />
                    <div className="h-7 w-28 rounded bg-slate-200" />
                  </div>
                  <div className="h-11 w-full rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-900 shadow-subtle"
          >
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => void load()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-dark"
            >
              Retry
            </button>
          </div>
        ) : result?.data.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.data.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onPurchase={purchase}
                  busy={buyingId === vehicle.id}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-subtle transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-subtle">
                Page {page}
              </div>
              <button
                disabled={page * 12 >= result.total}
                onClick={() => setPage(page + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-subtle transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-subtle">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-base font-semibold text-ink">
              No vehicles are available yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
