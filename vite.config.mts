import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

// 현재 파일의 디렉토리 경로 가져오기
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/**/*'],
      outDir: 'dist',
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Roulette',
      fileName: (format) => `roulette.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'next'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          next: 'Next',
        },
        exports: 'named',
      },
    },
    watch: process.env.WATCH === 'true' ? {} : null,
    sourcemap: true,
    minify: 'terser',
    outDir: 'dist',
  },
  optimizeDeps: {
    include: ['clsx', 'tailwind-merge'],
  },
});