import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['algo.js', 'pyodide'], // Exclude both from optimization
  },
  build: {
    rollupOptions: {
      external: ['pyodide'], // Don't bundle pyodide
    }
  },
  plugins: [
    tailwindcss(),
  ],
});