export interface Filters { make: string; model: string; category: string; minPrice: string; maxPrice: string; }
export const emptyFilters: Filters = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };
const categories = ['SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'TRUCK', 'VAN', 'ELECTRIC'];

export function SearchFilters({ value, onChange }: { value: Filters; onChange: (value: Filters) => void }) {
  const set = (key: keyof Filters, next: string) => onChange({ ...value, [key]: next });
  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-ink outline-none focus:border-teal focus:ring-2 focus:ring-teal/30';
  return <section aria-label="Search filters" className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <label className="text-sm font-semibold text-ink">Make<input value={value.make} onChange={event => set('make', event.target.value)} placeholder="e.g. Toyota" className={`mt-1 ${field}`} /></label>
      <label className="text-sm font-semibold text-ink">Model<input value={value.model} onChange={event => set('model', event.target.value)} placeholder="e.g. Camry" className={`mt-1 ${field}`} /></label>
      <label className="text-sm font-semibold text-ink">Category<select value={value.category} onChange={event => set('category', event.target.value)} className={`mt-1 ${field}`}><option value="">All categories</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select></label>
      <label className="text-sm font-semibold text-ink">Min price<input type="number" min="0" value={value.minPrice} onChange={event => set('minPrice', event.target.value)} className={`mt-1 ${field}`} /></label>
      <label className="text-sm font-semibold text-ink">Max price<input type="number" min="0" value={value.maxPrice} onChange={event => set('maxPrice', event.target.value)} className={`mt-1 ${field}`} /></label>
    </div><button type="button" onClick={() => onChange(emptyFilters)} className="mt-4 text-sm font-semibold text-teal underline-offset-4 hover:underline">Clear filters</button>
  </section>;
}
