/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        romunia: {
          primary: "#293462",

          secondary: "#D61C4E",

          accent: "#FEB139",

          black: "#000000",

          white: "#FFFFFF",

          info: "rgba(213,51,189,0.6)",

          success: "rgba(21,176,52,0.78)",

          warning: "#FBBD23",

          error: "rgba(255,0,0,0.73)",
        },
      },
    ],
  },
};
