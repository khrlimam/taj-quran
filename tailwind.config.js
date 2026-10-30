/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        islamic: {
          green: {
            deep: '#03231a',
            dark: '#064e3b',
            primary: '#047857',
            light: '#10b981',
            muted: '#065f46'
          },
          gold: {
            light: '#fde047',
            primary: '#d4af37',
            rich: '#c5a059',
            dark: '#996515',
            burnished: '#b45309'
          },
          parchment: {
            50: '#fdfbf7',
            100: '#f9f6ee',
            200: '#f4ede0',
            300: '#e8dcbe'
          },
          lapis: {
            dark: '#07162c',
            primary: '#0c2340',
            light: '#1e3a8a'
          }
        }
      },
      fontFamily: {
        arabic: ['"Amiri"', '"Scheherazade New"', 'Traditional Arabic', 'Tahoma', 'serif'],
        title: ['"Cinzel Decorative"', '"Amiri"', 'serif']
      },
      boxShadow: {
        'book': '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(212, 175, 55, 0.3)',
        'spine': 'inset 0 0 30px rgba(0, 0, 0, 0.6)',
        'page': '0 10px 30px -5px rgba(0, 0, 0, 0.3)'
      }
    },
  },
  plugins: [],
}
