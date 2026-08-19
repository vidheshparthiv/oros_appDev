import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy API requests to backend to avoid CORS in dev
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/vendors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/orders': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
