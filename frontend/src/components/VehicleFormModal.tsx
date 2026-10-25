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
  const input =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-form-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 id="vehicle-form-title" className="text-2xl font-bold text-ink">
            {vehicle ? 'Edit vehicle' : 'Add vehicle'}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Make
            <input
              required
              value={make}
              onChange={(event) => setMake(event.target.value)}
              className={input}
            />
          </label>
          <label className="text-sm font-semibold">
            Model
            <input
              required
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className={input}
            />
          </label>
          <label className="text-sm font-semibold">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={input}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Price
            <input
              required
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className={input}
            />
          </label>
          <label className="text-sm font-semibold">
            Quantity
            <input
              required
              type="number"
              min="0"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className={input}
            />
          </label>
          {error && (
            <p role="alert" className="sm:col-span-2 text-red-700">
              {error}
            </p>
          )}
          <div className="sm:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="rounded-lg bg-teal px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {vehicle ? 'Save changes' : 'Create vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
