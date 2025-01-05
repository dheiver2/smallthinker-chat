import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Alterado de 'dist' para 'build'
    emptyOutDir: true,
  },
})
