import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// Retrieve the target from environment variables
const target = process.env.VITE_PROXY_TARGET;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api' : {
        target: target,
        secure: false
      },
    },
  },
  plugins: [react()],
})
