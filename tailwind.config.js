/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        // Legacy alias — a few older components still reference font-nunito.
        nunito: ['"Plus Jakarta Sans Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(2px)' },
        },
      },
      colors: {
        cream: { 50: '#FFFDF7', 100: '#FFF9E8', 200: '#FFF3D1' },
        sky: { 50: '#F0F7FF', 100: '#DCEEFB', 200: '#B6D9F7', 300: '#7BBCF0', 400: '#3B9AE5', 500: '#1A7FD4' },
        // Muted clay/terracotta — warm but never loud.
        coral: { 50: '#FAF4F0', 100: '#F3E5DC', 200: '#E8CCBC', 300: '#DBAD94', 400: '#CC785C', 500: '#B96149', 600: '#A0523D' },
        mint: { 50: '#EEFCF5', 100: '#D5F5E3', 200: '#A8E6C3', 300: '#6DD5A0', 400: '#3BC07B', 500: '#20A05E' },
        peach: { 50: '#FFF7F2', 100: '#FFE9DB', 200: '#FFD4B8', 300: '#FFB88E', 400: '#FF9B63' },
        rose: { 50: '#FFF0F3', 100: '#FFD9E0', 200: '#FFB3C2', 300: '#FF8DA3', 400: '#FF6685' },
        teal: { 50: '#EEFAFB', 100: '#D2F1F3', 200: '#A5E3E8', 300: '#6DCFD6', 400: '#3BBAC4' }
      }
    },
  },
  plugins: [],
}
