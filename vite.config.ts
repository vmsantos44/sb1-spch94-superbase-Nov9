import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'zustand',
            'recharts',
            'xlsx',
            'jspdf',
            'lucide-react'
          ],
          'data': ['./src/data/sampleData.ts'],
          'utils': ['./src/utils/calculations.ts'],
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});