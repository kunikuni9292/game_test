import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // GitHub Pages用の相対パス設定
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          cannon: ['cannon-es']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
