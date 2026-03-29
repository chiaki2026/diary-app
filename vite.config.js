import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/diary-app/',
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
})
