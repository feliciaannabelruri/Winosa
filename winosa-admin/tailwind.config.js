/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna aksen utama - yellow-500 sesuai style baru
        primary: {
          DEFAULT: '#EAB308', // yellow-500
          dark: '#CA8A04',    // yellow-600
          light: '#FDE047',   // yellow-300
        },
        // Dark colors
        dark: {
          DEFAULT: '#111111',
          sidebar: '#000000', // full black seperti style baru
          card: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Sora', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        // Tambah custom radius untuk sidebar
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}