import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/nonogram-game/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    emptyOutDir: true,
    sourcemap: true,
    manifest: true
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
}); 