export interface Filters {
  make: string;
  model: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

export const emptyFilters: Filters = {
  make: '',
  model: '',
  category: '',
  minPrice: '',
  maxPrice: '',
};

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

export function SearchFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (value: Filters) => void;
}) {
  const set = (key: keyof Filters, next: string) =>
    onChange({ ...value, [key]: next });

  const field =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/20';

  return (
    <section
      aria-label="Search filters"
      className="mb-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-subtle"
    >
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-teal"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Filter Inventory
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Make
          <input
            value={value.make}
            onChange={(event) => set('make', event.target.value)}
            placeholder="e.g. Toyota"
            className={field}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Model
          <input
            value={value.model}
            onChange={(event) => set('model', event.target.value)}
            placeholder="e.g. Camry"
            className={field}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Category
          <select
            value={value.category}
            onChange={(event) => set('category', event.target.value)}
            className={`${field} cursor-pointer`}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Min price
          <input
            type="number"
            min="0"
            value={value.minPrice}
            onChange={(event) => set('minPrice', event.target.value)}
            placeholder="$ Min"
            className={field}
          />
        </label>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Max price
          <input
            type="number"
            min="0"
            value={value.maxPrice}
            onChange={(event) => set('maxPrice', event.target.value)}
            placeholder="$ Max"
            className={field}
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => onChange(emptyFilters)}
        className="mt-4 text-xs font-semibold text-teal underline-offset-4 hover:underline"
      >
        Clear filters
      </button>
    </section>
  );
}
