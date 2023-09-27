import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@assets': path.resolve(__dirname, './src/assets/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@routes': path.resolve(__dirname, './src/routes/'),
      '@styles': path.resolve(__dirname, './src/styles/'),
      '@util': path.resolve(__dirname, './src/util/'),
    },
  },
});
