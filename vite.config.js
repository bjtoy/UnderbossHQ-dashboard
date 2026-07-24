import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { debugLogPlugin } from './scripts/debug-log-plugin.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), debugLogPlugin()],
})
