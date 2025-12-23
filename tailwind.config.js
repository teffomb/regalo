/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        "bosque": "#013220",
        "borgo": "#800020",
        "gold-glow": "#FFD700",
      },
      fontFamily: {
        script: ["'Dancing Script'", "cursive"],
      },
    },
  },
  plugins: [],
};

