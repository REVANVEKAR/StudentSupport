/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff8c00',
        secondary: '#f5f5f5',
      },
      boxShadow: {
        'custom': '0 2px 5px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
} 