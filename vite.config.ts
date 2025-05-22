import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Ensure proper handling of CSS and other assets
    assetsInlineLimit: 4096,
    // Ensure proper chunk sizes
    chunkSizeWarningLimit: 2000,
    // Output for production builds
    outDir: 'dist',
    // Generate clean CSS
    cssCodeSplit: true,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    // Improve loading performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
});