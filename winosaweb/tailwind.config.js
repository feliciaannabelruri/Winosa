/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#F6B93B",
        goldDark: "#D99800",
        goldSoft: "#FFE08A",
        black: "#0B0F14",
        dark: "#1A1F26",
        light: "#F5F5F5",
        white: "#FFFFFF",
      },

      fontFamily: {
        heading: ["var(--font-poppins)"],
        body: ["var(--font-inter)"],
      },

      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
      },

      boxShadow: {
        gold: "0 8px 24px rgba(246,185,59,0.25)",
      },

      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
    },
  },
  plugins: [],
};