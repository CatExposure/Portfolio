/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slideUp: 'slideUp ease-in-out',
        slideLeft: 'slideLeft linear infinite',
        slideBgRight: 'slideBgRight linear infinite',
      },

      keyframes: {
        slideUp: {
          '0%, 70%': {height: '100vh'},
          '100%': {height: '0vh'}
        },
        slideLeft: {
          '0%': {left: '100%', transform: 'translateX(0%)'},
          '100%': {left: '0%', transform: 'translateX(-100%)'}
        },
        slideBgRight: {
          '0%': {'background-position': '0%'},
          '100%': {'background-position': '-200%'}
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animated")
  ],
}

