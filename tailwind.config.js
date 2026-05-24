/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
      },
      colors: {
        ink: '#08080f',
        violet: '#111122',
        gold: '#d4a853',
        'gold-light': '#f0d080',
        cinnabar: '#c41e3a',
        'cinnabar-light': '#e85d3a',
        purple: '#7c3aed',
        'purple-light': '#a78bfa',
        jade: '#2d8a6e',
        'jade-light': '#4ade80',
      },
    },
  },
  plugins: [],
}
