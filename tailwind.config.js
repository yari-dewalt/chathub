/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      "phone": {"max": "610px"}
    },
    extend: {
      fontFamily: {
        general: ["Roboto", "sans-serif"]
      }
    },
  },
  plugins: [
    require("tailwindcss-animation-delay")
  ],
}

