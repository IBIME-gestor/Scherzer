/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        scherzer: {
          rojo: '#C81D25',
          rojoOscuro: '#8E0E15',
          amarillo: '#F4C430',
          negro: '#111111',
          gris: '#F2F2F0',
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
