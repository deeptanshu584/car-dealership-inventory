const PATHS: Record<string, string> = {
  SUV: 'M8 32 L22 32 L36 16 L76 16 L94 28 L114 28 C117 28 120 31 120 34 L120 39 L4 39 L4 35 C4 33 6 32 8 32 Z M24 39 A6 6 0 1 0 36 39 Z M88 39 A6 6 0 1 0 100 39 Z',
  COUPE:
    'M6 33 L24 33 L48 18 L76 18 L104 28 L116 29 C118 29 120 31 120 34 L120 39 L4 39 L4 35 C4 34 5 33 6 33 Z M26 39 A6 6 0 1 0 38 39 Z M88 39 A6 6 0 1 0 100 39 Z',
  HATCHBACK:
    'M8 33 L24 33 L38 20 L72 20 L88 32 L112 32 C115 32 118 34 118 36 L118 39 L4 39 L4 35 C4 34 6 33 8 33 Z M24 39 A6 6 0 1 0 36 39 Z M84 39 A6 6 0 1 0 96 39 Z',
  CONVERTIBLE:
    'M6 34 L28 34 L48 24 L56 24 L60 30 L104 30 L116 31 C118 31 120 33 120 35 L120 39 L4 39 L4 36 C4 35 5 34 6 34 Z M26 39 A6 6 0 1 0 38 39 Z M88 39 A6 6 0 1 0 100 39 Z',
  TRUCK:
    'M6 34 L22 34 L34 18 L68 18 L72 28 L114 28 L116 39 L4 39 L4 36 C4 35 5 34 6 34 Z M26 39 A6 6 0 1 0 38 39 Z M90 39 A6 6 0 1 0 102 39 Z',
  ELECTRIC:
    'M6 33 L24 33 L44 19 L78 19 L100 29 L114 30 C117 30 119 32 119 35 L119 39 L4 39 L4 35 C4 34 5 33 6 33 Z M26 39 A6 6 0 1 0 38 39 Z M88 39 A6 6 0 1 0 100 39 Z',
  VAN: 'M8 32 L20 32 L24 16 L94 16 L108 26 L116 28 C118 28 120 30 120 33 L120 39 L4 39 L4 35 C4 33 6 32 8 32 Z M24 39 A6 6 0 1 0 36 39 Z M88 39 A6 6 0 1 0 100 39 Z',
  SEDAN:
    'M6 33 L24 33 L42 20 L76 20 L96 30 L114 30 C117 30 119 32 119 35 L119 39 L4 39 L4 35 C4 34 5 33 6 33 Z M26 39 A6 6 0 1 0 38 39 Z M88 39 A6 6 0 1 0 100 39 Z',
};

export function VehicleSilhouette({ category }: { category: string }) {
  const path = PATHS[category] || PATHS.SEDAN;

  return (
    <div
      aria-hidden="true"
      className="relative mb-4 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/60 p-4 text-slate-700 transition-colors group-hover:from-teal/5 group-hover:to-slate-100"
    >
      <div className="absolute inset-0 bg-[radial-gradient(#0f766e_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
      <svg
        viewBox="0 0 124 48"
        className="relative h-full w-auto max-w-[85%] drop-shadow-sm transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} fill="currentColor" />
        <circle cx="26" cy="39" r="3" fill="#cbd5e1" />
        <circle cx="88" cy="39" r="3" fill="#cbd5e1" />
      </svg>
    </div>
  );
}
