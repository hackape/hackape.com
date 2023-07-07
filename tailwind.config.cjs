/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    container: {
      padding: "2rem",
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
