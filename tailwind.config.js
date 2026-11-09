/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans Thai', 'sans-serif'],
        display: ['Syne', 'Noto Sans Thai', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        antonio: {
          bg: '#0B0C10',
          surface: '#13151C',
          card: '#181B24',
          border: '#262A38',
          cream: '#F6F4EE',
          muted: '#9CA3B5',
          accent: '#FF5A36',
          accentHover: '#FF7455',
          emerald: '#10B981',
          blue: '#3B82F6',
        }
      }
    },
  },
  plugins: [],
};
