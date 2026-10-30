/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#06110C',
        darkSurface: '#171717',
        crimson: {
          DEFAULT: '#A31C18',
          hover: '#C2241F',
          dark: '#801512',
          light: '#F87171',
        },
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#A31C18',
          600: '#8e1714',
          700: '#751310',
        },
      },
    },
  },
  plugins: [],
};
