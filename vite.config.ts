import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5173,
    open: true,
    host: '0.0.0.0',
    allowedHosts: ['couriers-timetable-client.onrender.com'],
  },
})
