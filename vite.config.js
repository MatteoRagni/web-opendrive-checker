import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopyPyodide } from "./vite-plugin-pyodide";
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, '.'),
  build: {
    outDir: './dist'
  },
  optimizeDeps: { exclude: ["pyodide"] },
  plugins: [viteStaticCopyPyodide(), vue()],
  css: {
     preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
            'mixed-decls',
            'color-functions',
            'global-builtin',
          ],
        },
     },
  },
})
