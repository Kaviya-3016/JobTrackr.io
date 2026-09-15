import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/applications': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/analytics': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/resumes': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/ai': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/interviews': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/waitlist': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/export': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
