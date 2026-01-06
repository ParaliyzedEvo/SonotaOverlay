import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'api_functions_unbundled.js'),
      name: 'ApiFunctions',
      fileName: 'api_functions',
      formats: ['es']
    },
    outDir: '../',
    emptyOutDir: false,
    rollupOptions: {
      external: [],
    }
  }
});