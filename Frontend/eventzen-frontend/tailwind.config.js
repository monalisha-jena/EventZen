/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  darkMode: 'class',  // ← add this
  content: ["./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}