// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3ff',
          100: '#e0e7ff',
          500: '#1e3a8a',
          600: '#1e3a8a',
          700: '#1e3a8a',
          800: '#1e3a8a',
          900: '#1e3a8a',
        },
        mustard: '#eab308',
        'mustard-light': '#facc15',
        'mustard-dark': '#ca8a04',
      },
      backgroundColor: {
        'navy': '#1e3a8a',
        'navy-light': '#374151',
        'footer': '#1f2937', // Darker slate
      },
      textColor: {
        'navy': '#1e3a8a',
        'mustard': '#eab308',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}