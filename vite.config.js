import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/TechPhys/',
  root: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        academic: resolve(__dirname, 'src/labs/2d-academic/index.html'),
        ar: resolve(__dirname, 'src/labs/3d-ar/index.html'),
        guide: resolve(__dirname, 'src/labs/neural-guide/index.html'),
        sandbox: resolve(__dirname, 'src/labs/legacy-sandbox/index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/yandex-api': {
        target: 'https://llm.api.cloud.yandex.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yandex-api/, '')
      },
      '/gemini-api': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini-api/, '')
      }
    }
  }
});
