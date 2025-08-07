/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      colors: {
        'brutal-pink': '#FF005C',
        'brutal-cyan': '#00F0FF',
        'brutal-yellow': '#FFE500',
        'brutal-green': '#00FF88',
        'brutal-purple': '#8B00FF',
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0 black',
        'brutal': '6px 6px 0 black',
        'brutal-lg': '9px 9px 0 black',
        'brutal-xl': '12px 12px 0 black',
      },
    },
  },
  plugins: [],
}
