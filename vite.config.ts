
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Resilient config for Vercel/CI environments
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // Explicitly define the entry point relative to the project root
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
    host: true
  }
});
