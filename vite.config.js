import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true,          // listen on all interfaces
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'petechiate-willetta-subspinose.ngrok-free.dev', // ngrok hostname
      protocol: 'https',
    },
    allowedHosts: ['petechiate-willetta-subspinose.ngrok-free.dev'], // allow ngrok
  },
})