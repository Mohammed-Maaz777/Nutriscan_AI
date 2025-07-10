/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#c7d2fe',
          DEFAULT: '#6366f1',
          dark: '#4f46e5'
        },
        accent: '#9333ea',
      },
      animation: {
        bounceSlow: 'bounce 2.5s infinite',
      },
      boxShadow: {
        soft: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        height: 'height',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
