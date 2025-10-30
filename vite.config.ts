
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';
  import { visualizer } from 'rollup-plugin-visualizer';

  export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/A-R-Moodsync/' : '/',
    plugins: [
      react(),
      ...(process.env.ANALYZE ? [visualizer({ filename: 'build/stats.html', gzipSize: true, brotliSize: true })] : [])
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'react';
              if (id.includes('framer-motion') || id.includes('motion')) return 'motion';
              if (id.includes('@radix-ui')) return 'radix';
              if (id.includes('lucide-react')) return 'icons';
              if (id.includes('@supabase')) return 'supabase';
            }
          },
        },
      },
    },
    publicDir: 'public',
    server: {
      port: 3000,
      open: true,
    },
  });