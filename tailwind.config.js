/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fdfaf5',
          100: '#faf5eb',
          200: '#f5ead6',
          300: '#eedcbd',
        },
        brown: {
          50: '#fdf8f0',
          100: '#f5e6d0',
          200: '#e8c99a',
          300: '#d4a76a',
          400: '#b8834a',
          500: '#8d6035',
          600: '#6b4a28',
          700: '#5d4037',
          800: '#4a3020',
          900: '#3b2010',
        },
        paw: {
          light: '#f4a261',
          main: '#e76f51',
          dark: '#c14f33',
        }
      },
      fontFamily: {
        'rounded': ['"M PLUS Rounded 1c"', 'sans-serif'],
        'handwrite': ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'notebook': '0 4px 6px -1px rgba(93,64,55,0.15), 0 2px 4px -2px rgba(93,64,55,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
        'page': '2px 4px 20px rgba(93,64,55,0.15), -2px 0 8px rgba(93,64,55,0.05)',
      },
    },
  },
  plugins: [],
}
