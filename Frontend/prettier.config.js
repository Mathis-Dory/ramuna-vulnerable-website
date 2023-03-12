module.exports = {
  arrowParens: "always",
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "ignore",
  printWidth: 100,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
};
