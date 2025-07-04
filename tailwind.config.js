/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gmarket: ['"GmarketSans"', 'sans-serif'],
        wanted: ['Wanted Sans', 'sans-serif'],
      },
      keyframes: {
        draw: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        draw: 'draw 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}