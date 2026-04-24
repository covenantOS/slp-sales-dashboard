/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"DM Sans"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#ececef',
          200: '#d6d6db',
          300: '#adadb5',
          400: '#7c7c85',
          500: '#52525a',
          600: '#34343a',
          700: '#23232a',
          800: '#18181d',
          900: '#0e0e12',
          950: '#070709',
        },
        slp: {
          50: '#fff1f1',
          100: '#ffd5d5',
          200: '#ffadad',
          300: '#ff7b7b',
          400: '#f14a47',
          500: '#cf312b',
          600: '#b01e1a',
          700: '#8f1714',
          800: '#6b1110',
          900: '#470b0b',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,7,9,0.06), 0 2px 4px rgba(7,7,9,0.06)',
        soft: '0 12px 40px -12px rgba(7,7,9,0.25)',
        glow: '0 0 0 1px rgba(207,49,43,0.2), 0 10px 30px -10px rgba(207,49,43,0.35)',
        red: '0 6px 20px -6px rgba(207,49,43,0.55)',
      },
      backgroundImage: {
        'grad-red': 'linear-gradient(135deg, #cf312b 0%, #8f1714 100%)',
        'grad-ink': 'linear-gradient(135deg, #18181d 0%, #0e0e12 100%)',
      },
    },
  },
  plugins: [],
};
