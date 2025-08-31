import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: 'src/pages/tin-tuc-su-kien', 
      extensions: ['tsx'],
      routeStyle: 'next',
    }),
  ],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
})
