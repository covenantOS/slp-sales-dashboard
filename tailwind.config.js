/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f5f7fa',
          100: '#e9edf3',
          200: '#cbd3df',
          300: '#9ca8bb',
          400: '#6b7890',
          500: '#475269',
          600: '#2f3a4e',
          700: '#1e2738',
          800: '#141b2a',
          900: '#0b1220',
          950: '#060a14',
        },
        brand: {
          50: '#e6fcf4',
          100: '#c2f7e2',
          200: '#8df0c8',
          300: '#4de2a8',
          400: '#18cc8a',
          500: '#08b175',
          600: '#038e5d',
          700: '#046f4b',
          800: '#07583d',
          900: '#074833',
        },
        accent: {
          50: '#eaf4ff',
          100: '#d1e7ff',
          200: '#a9d0ff',
          300: '#74b0ff',
          400: '#3e8bff',
          500: '#1f6cff',
          600: '#0f51e6',
          700: '#0c3fb8',
          800: '#0f3691',
          900: '#112f73',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(9,30,66,0.05), 0 1px 3px rgba(9,30,66,0.08)',
        soft: '0 10px 40px -12px rgba(11,18,32,0.25)',
        glow: '0 0 0 1px rgba(8,177,117,0.25), 0 8px 24px -8px rgba(8,177,117,0.35)',
      },
    },
  },
  plugins: [],
};
