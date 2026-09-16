import { defineConfig } from 'vite'

export default defineConfig({
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
