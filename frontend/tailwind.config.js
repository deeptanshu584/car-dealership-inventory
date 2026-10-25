/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#112335',
          deep: '#0a1622',
          surface: '#1c3147',
        },
        teal: {
          DEFAULT: '#0f766e',
          light: '#14b8a6',
          dark: '#115e59',
          accent: '#0d9488',
        },
        mist: '#f4f8f7',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      boxShadow: {
        subtle:
          '0 1px 3px 0 rgba(17, 35, 53, 0.04), 0 1px 2px -1px rgba(17, 35, 53, 0.04)',
        elevated:
          '0 12px 30px -8px rgba(17, 35, 53, 0.08), 0 4px 12px -4px rgba(17, 35, 53, 0.03)',
      },
    },
  },
  plugins: [],
};
