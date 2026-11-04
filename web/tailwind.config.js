/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#060709',
          900: '#0B0D13',
          850: '#10131B',
          800: '#161A24',
          700: '#222838',
          600: '#343B4E',
        },
        titanium: {
          100: '#F5F5F7',
          200: '#E4E4E8',
          300: '#D1D1D8',
          400: '#9E9EA8',
          500: '#71717E',
        },
        phosphor: {
          teal: '#00F5D4',
          cyan: '#00BBF9',
          amber: '#FFB703',
          orange: '#FB5607',
          red: '#FF0054'
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'optical': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 24px 48px -12px rgba(0, 0, 0, 0.75)',
        'tactile': '0 2px 0 0 rgba(255, 255, 255, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'phosphor-glow': '0 0 20px -4px rgba(0, 245, 212, 0.4)',
      }
    },
  },
  plugins: [],
}
