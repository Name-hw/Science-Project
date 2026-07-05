import { dirname, resolve } from 'node:path'
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: '/Science-Project/',
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        First: resolve(import.meta.dirname, 'src/First/index.html')
      },
    },
  },
  server: {
    port: 8080,
    open: true,
  },
});
