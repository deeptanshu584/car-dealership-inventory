import { useState, type FormEvent } from 'react';
import type { Vehicle } from '../types';

export interface VehiclePayload {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

const categories = [
  'SEDAN',
  'SUV',
  'HATCHBACK',
  'COUPE',
  'CONVERTIBLE',
  'TRUCK',
  'VAN',
  'ELECTRIC',
];

export function VehicleFormModal({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle?: Vehicle;
  onClose: () => void;
  onSave: (value: VehiclePayload) => Promise<void>;
}) {
  const [make, setMake] = useState(vehicle?.make ?? '');
  const [model, setModel] = useState(vehicle?.model ?? '');
  const [category, setCategory] = useState(vehicle?.category ?? 'SEDAN');
  const [price, setPrice] = useState(String(vehicle?.price ?? ''));
  const [quantity, setQuantity] = useState(String(vehicle?.quantity ?? ''));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const parsedPrice = Number(price),
      parsedQuantity = Number(quantity);
    if (
      parsedPrice <= 0 ||
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(price)
    )
      return setError('Enter a valid price and whole-number quantity');
    setBusy(true);
    setError('');
    try {
      await onSave({
        make: make.trim(),
        model: model.trim(),
        category,
        price: parsedPrice,
        quantity: parsedQuantity,
      });
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Could not save vehicle',
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-form-title"
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2
              id="vehicle-form-title"
              className="text-2xl font-bold tracking-tight text-ink"
            >
              {vehicle ? 'Edit vehicle' : 'Add vehicle'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {vehicle
                ? 'Update details and specifications for this inventory item.'
                : 'Enter vehicle specifications to list in the showroom catalog.'}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Make
            <input
              required
              value={make}
              onChange={(event) => setMake(event.target.value)}
              placeholder="e.g. Porsche"
              className={inputClass}
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Model
            <input
              required
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder="e.g. Taycan"
              className={inputClass}
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 sm:col-span-2">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Price
            <input
              required
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="e.g. 89999.00"
              className={inputClass}
            />
          </label>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Quantity
            <input
              required
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="e.g. 5"
              className={inputClass}
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 sm:col-span-2"
            >
              {error}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="rounded-xl bg-teal px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-teal-dark disabled:opacity-60"
            >
              {vehicle ? 'Save changes' : 'Create vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
