import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  // root: resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  plugins: [svgr(),react()],
})
