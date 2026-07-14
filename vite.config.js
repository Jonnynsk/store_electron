import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, 'catalog/catalog.json');

export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
    }),
    {
      name: 'serve-catalog-json',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url !== '/catalog/catalog.json') {
            next();
            return;
          }

          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(fs.readFileSync(catalogPath));
        });
      },
    },
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
