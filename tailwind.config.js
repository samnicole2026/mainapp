/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['IBM Plex Mono', 'Courier', 'monospace'],
      },
      colors: {
        'brutal-pink': '#FF005C',
        'brutal-cyan': '#00F0FF',
        'brutal-yellow': '#FFD600',
        'brutal-green': '#00FF85',
      },
      boxShadow: {
        'brutal': '6px 6px 0 #000000',
        'brutal-sm': '4px 4px 0 #000000',
        'brutal-lg': '8px 8px 0 #000000',
      },
    },
  },
  plugins: [],
}
