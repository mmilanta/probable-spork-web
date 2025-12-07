import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => ({
  // Use '/probable-spork-web/' for GitHub Pages, '/' for local builds
  base: process.env.VITE_BASE_PATH || '/',
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
}));