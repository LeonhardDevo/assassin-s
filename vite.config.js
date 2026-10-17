import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        terms: 'terms.html',
        privacy: 'privacy.html',
        contact: 'contact.html',
      },
    },
  },
})
