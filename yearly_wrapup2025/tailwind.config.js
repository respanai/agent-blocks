
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        apple: {
          bg: '#F5F5F7',
          text: '#1D1D1F',
          gray: '#86868B',
          blue: '#0066CC',
          dark: '#1D1D1F',
        }
      },
      fontSize: {
        '10xl': '10rem',
        '11xl': '12rem',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
      }
    },
  },
  plugins: [],
}
