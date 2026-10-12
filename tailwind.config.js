/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      colors: {
        fortu: {
          dark: 'rgb(var(--fortu-dark) / <alpha-value>)',
          'dark-raised': 'rgb(var(--fortu-dark-raised) / <alpha-value>)',
          medium: 'rgb(var(--fortu-medium) / <alpha-value>)',
          light: 'rgb(var(--fortu-light) / <alpha-value>)',
          'off-white': 'rgb(var(--fortu-off-white) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}


