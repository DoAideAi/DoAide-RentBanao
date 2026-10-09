/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0a0a',
          primary: '#10B981',
          'primary-hover': '#059669',
          secondary: '#F59E0B',
          card: '#141414',
          border: '#2a2a2a',
          muted: '#888888',
        },
      },
    },
  },
  plugins: [],
}
