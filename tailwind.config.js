/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ac-black': '#050505',
        'ac-dark': '#1a1a1a',
        'ac-red': '#cc0000',
        'ac-gold': '#d4af37',
        'ac-silver': '#c0c0c0',
        'ac-blue-glow': '#0a192f',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cinematic-gradient': 'linear-gradient(to bottom, rgba(5,5,5,0) 0%, rgba(5,5,5,1) 100%)',
      }
    },
  },
  plugins: [],
}
