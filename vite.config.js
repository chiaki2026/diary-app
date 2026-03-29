import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ command }) => ({
  plugins: command === 'build'
    ? [react(), viteSingleFile()]
    : [react()],
  base: command === 'build' ? './' : '/',
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
}))
