/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          950: '#00313A',
          900: '#004D5A',
          800: '#006D77',
          700: '#0A8A95',
          600: '#14919B',
          400: '#3DB8C4',
        },
        sand: {
          400: '#D4B483',
          300: '#C9A96E',
          200: '#E8D5B0',
          100: '#F5F0E8',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) both',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'modal-in': 'modal-in 0.25s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}