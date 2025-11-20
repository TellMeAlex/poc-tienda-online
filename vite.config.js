import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/POC/',
  server: {
    proxy: {
      '/api/loader': {
        target: 'https://airis-loader-711296505139.europe-southwest1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/loader/, ''),
        secure: false,
      },
    },
  },
})
