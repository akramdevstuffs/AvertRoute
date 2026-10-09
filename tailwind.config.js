/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0284c7',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
          navy: '#0f172a',
          dark: '#090d16'
        },
        risk: {
          low: '#10b981',       // emerald-500
          moderate: '#f59e0b',  // amber-500
          high: '#f97316',      // orange-500
          extreme: '#ef4444'    // red-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
