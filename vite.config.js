import { defineConfig } from 'vite';

export default defineConfig({
  // ... other config
  optimizeDeps: {
    exclude: ['algo.js'], // Exclude the WASM module from optimization
  },
});