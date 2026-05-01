/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        display: ['Orbitron', 'monospace'],
        body: ['Rajdhani', 'sans-serif'],
        soft: ['Nunito', 'sans-serif'],
      },
      colors: {
        cyan: { DEFAULT: '#00e5ff', dim: '#007a8a' },
        neural: '#ff3366',
        phrenic: '#00e5ff',
      }
    },
  },
  plugins: [],
}