import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:5000',
    changeOrigin: true
  }
};

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Siren/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: false,
    proxy: apiProxy
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    open: false,
    proxy: apiProxy
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}));
