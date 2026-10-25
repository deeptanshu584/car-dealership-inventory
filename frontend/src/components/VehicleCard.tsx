import type { Vehicle } from '../types';
import { VehicleSilhouette } from './VehicleSilhouette';

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
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-elevated motion-reduce:transform-none motion-reduce:transition-none">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
            {vehicle.category}
          </span>
          <span
            className={`text-xs font-semibold ${
              vehicle.quantity === 0
                ? 'text-red-600'
                : vehicle.quantity <= 3
                  ? 'text-amber-700'
                  : 'text-teal'
            }`}
          >
            {stockLabel}
          </span>
        </div>

        {/* Premium showroom vector silhouette */}
        <VehicleSilhouette category={vehicle.category} />

        <h2 className="text-xl font-bold tracking-tight text-ink">
          {vehicle.make} {vehicle.model}
        </h2>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-4 flex items-baseline justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Price
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-ink">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(vehicle.price)}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
          onClick={() => onPurchase?.(vehicle)}
          disabled={vehicle.quantity === 0 || busy}
          className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {busy ? 'Purchasing…' : 'Purchase'}
        </button>
      </div>
    </article>
  );
}
