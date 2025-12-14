/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        background: '#f9fafb',
        card: '#ffffff',
        text: '#1f2937',
        accent1: '#8b5cf6', // Purple
        accent2: '#f59e0b', // Amber
        accent3: '#ef4444', // Red
        accent4: '#06b6d4', // Cyan
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in forwards',
        'slideIn': 'slideIn 0.5s ease-out forwards',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      screens: {
        'xs': '480px',
        // Other breakpoints are already defined by Tailwind
      },
    },
  },
  plugins: [],
}