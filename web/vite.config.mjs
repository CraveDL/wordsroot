import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Builds web/ into public/ (next to data.json, which tools/build-db.js writes).
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: './',
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000', '/data.json': 'http://localhost:3000' } },
  build: {
    outDir: fileURLToPath(new URL('../public', import.meta.url)),
    emptyOutDir: false,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: { entryFileNames: 'assets/app.js', chunkFileNames: 'assets/[name].js', assetFileNames: 'assets/[name][extname]' },
    },
  },
});
