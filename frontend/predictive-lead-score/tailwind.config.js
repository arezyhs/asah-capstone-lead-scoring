// tailwind.config.js (contoh menambahkan warna kustom)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#85CC2C', // Sekarang Anda bisa menggunakan `bg-primary`, `text-primary`
        'primary-dark': '#72b02a', // Untuk `hover:bg-primary-dark`
      },
    },
  },
  plugins: [],
}