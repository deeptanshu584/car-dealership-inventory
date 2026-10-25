import type { Vehicle } from '../types';

export function VehicleCard({
  vehicle,
  onPurchase,
  busy = false,
}: {
  vehicle: Vehicle;
  onPurchase?: (vehicle: Vehicle) => void;
  busy?: boolean;
}) {
  const stockLabel =
    vehicle.quantity === 0
      ? 'Out of stock'
      : vehicle.quantity <= 3
        ? `Low stock · ${vehicle.quantity} left`
        : `${vehicle.quantity} in stock`;
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal">
            {vehicle.category}
          </p>
          <h2 className="mt-2 text-xl font-bold text-ink">
            {vehicle.make} {vehicle.model}
          </h2>
        </div>
        <span aria-hidden className="rounded-full bg-mist p-3 text-2xl">
          🚘
        </span>
      </div>
      <p className="mt-8 text-2xl font-extrabold text-ink">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(vehicle.price)}
      </p>
      <p
        className={`mt-2 text-sm font-medium ${vehicle.quantity === 0 ? 'text-red-600' : vehicle.quantity <= 3 ? 'text-amber-700' : 'text-teal'}`}
      >
        {stockLabel}
      </p>
      <button
        type="button"
        aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
        onClick={() => onPurchase?.(vehicle)}
        disabled={vehicle.quantity === 0 || busy}
        className="mt-6 w-full rounded-xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {busy ? 'Purchasing…' : 'Purchase'}
      </button>
    </article>
  );
}
