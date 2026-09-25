/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#1e2130",
        card: "#252a3a",
        border: "#2e3447",
        accent: "#3b7ef8",
        muted: "#8892a4",
        dark: "#141720",
      },
    },
  },
  plugins: [],
};
