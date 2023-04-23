# Frontend Documentation

## Set up

This project does not use `npm` or `yarn` to manage dependencies. Instead, it uses `pnpm` to manage dependencies. To install `pnpm`, run the following command:

### `npm install pnpm -g`

## Available Scripts

In order to run the project, you must first install the dependencies. Then, you can run the following command:

### `pnpm start`

## Development

1. Please use lazy components to import components. This will help reduce the size of the bundle.
2. React-cli is installed to help you, if you want to create a compoenent, please use the following command: `pnpm dlx react-cli component <component-name>`.
3. Tailwind is used to reduce the css size. Please use tailwind classes to style your components.
4. The DaisyUI library is used to style the components. Please use the classes provided by the library to style your components. You can check the documentation for already implemented components.
5. MaterialUI is also installed in case you do not find what you want in the DaisyUI library.
6. Please use the colors used in the tailwind config file. If you want to add a new color, please add it to the tailwind config file.
