import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // La librería "xlsx" (carga de alumnos por Excel) revisa internamente la
  // variable global "process" de Node, que no existe en el navegador. Sin
  // esto, cualquier página crashea con pantalla en blanco apenas carga el
  // paquete de JavaScript, porque todas las rutas se agrupan en un solo bundle.
  define: {
    'process.env': {},
  },
})
