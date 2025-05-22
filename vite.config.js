import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // ... other config
  optimizeDeps: {
    exclude: ['algo.js'], // Exclude the WASM module from optimization
  },
  plugins: [
    tailwindcss(),
  ],
});