import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Variable"', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        nunito: ['"Nunito Variable"', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Editorial serif for result headlines. Deliberately a system stack:
        // the iOS shell bundles its content and must render identically with
        // no network, so a webfont here would be a regression.
        display: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        // Chunky rounded display face for the landing hero and marquee.
        // Self-hosted like Nunito so the iOS shell renders it offline.
        fredoka: ['"Fredoka Variable"', 'Fredoka', '"Nunito Variable"', 'Nunito', 'ui-rounded', 'sans-serif'],
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
        coral: { 50: '#FFF5F0', 100: '#FFE8DD', 200: '#FFD0BA', 300: '#FFB08E', 400: '#FF8A5C', 500: '#F06830', 600: '#D9571F' },
        mint: { 50: '#EEFCF5', 100: '#D5F5E3', 200: '#A8E6C3', 300: '#6DD5A0', 400: '#3BC07B', 500: '#20A05E' },
        peach: { 50: '#FFF7F2', 100: '#FFE9DB', 200: '#FFD4B8', 300: '#FFB88E', 400: '#FF9B63' },
        rose: { 50: '#FFF0F3', 100: '#FFD9E0', 200: '#FFB3C2', 300: '#FF8DA3', 400: '#FF6685' },
        teal: { 50: '#EEFAFB', 100: '#D2F1F3', 200: '#A5E3E8', 300: '#6DCFD6', 400: '#3BBAC4' }
      }
    },
  },
  plugins: [
    // Safe-area insets for the iOS shell (see ios-app/). These resolve to 0 in
    // every browser that has not opted into `viewport-fit=cover`, which the
    // website deliberately has not — only the native shell sets it, at runtime
    // (src/hooks/useNativeShell.js). So these are inert on the web.
    //
    // Each utility SETS the padding rather than adding to it, so only put one
    // on an element that has no competing padding utility on the same side.
    // Where an element already has padding (a header's py-3, say), write the
    // sum inline instead: pt-[calc(0.75rem+env(safe-area-inset-top))].
    plugin(({ addUtilities }) => {
      addUtilities({
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom)' },
        '.pl-safe': { paddingLeft: 'env(safe-area-inset-left)' },
        '.pr-safe': { paddingRight: 'env(safe-area-inset-right)' },
        '.mt-safe': { marginTop: 'env(safe-area-inset-top)' },
        '.mb-safe': { marginBottom: 'env(safe-area-inset-bottom)' },
      });
    }),
  ],
}
