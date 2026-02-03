/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obl-primary': '#1a1a1a',
        'obl-accent': '#3b82f6',
        'obl-header': '#1e40af',
        'obl-runner-up': '#64748b',
        'obl-champion': '#ca8a04',
        'obl-defunct': '#9ca3af',
      },
    },
  },
  plugins: [],
}
