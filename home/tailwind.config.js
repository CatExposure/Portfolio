/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slideUp: 'slideUp ease-in-out'
      },

      keyframes: {
        slideUp: {
          '0%, 70%': {height: '100vh'},
          '100%': {height: '0vh'}
        }
      },
      animationDuration: {
        "1100": "1100ms"
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}

