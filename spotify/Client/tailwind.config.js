/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        slideUp: 'slideUp ease-in-out',
      },

      keyframes: {
        slideUp: {
          '0%, 60%': {height: '100vh'},
          '100%': {height: '0vh'}
        },
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

