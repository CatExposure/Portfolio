/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [
    require('@headlessui/tailwindcss')
  ],
  variants: {
    backgroundColor: ['loaded'],
  },
}

