/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ig: {
          dark: '#0a0612',
          surface: '#120920',
          card: '#180d2b',
          cardHover: '#201138',
          border: 'rgba(225, 48, 108, 0.2)',
          borderHover: 'rgba(240, 148, 51, 0.45)',
          purple: '#833AB4',
          violet: '#5851DB',
          magenta: '#C13584',
          pink: '#E1306C',
          red: '#FD1D1D',
          orange: '#F56040',
          yellow: '#FCAF45',
          gold: '#FFDC80',
        },
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#e1306c',
          600: '#c13584',
          700: '#833ab4',
        },
        dark: {
          50: '#faf5ff',
          100: '#f3e8ff',
          800: '#1e1133',
          900: '#120920',
          950: '#0a0612',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
