import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/nonogram-game/',
  build: {
    // Generate a unique hash for asset filenames
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Clear the outDir before building
    emptyOutDir: true,
    // Add cache busting
    sourcemap: true,
    manifest: true
  }
}); 