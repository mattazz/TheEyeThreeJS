import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import path from 'path'

// Determine the environment file to load
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'

// Load environment variables from the appropriate file
const env = dotenv.config({ path: path.resolve(__dirname, envFile) })
dotenvExpand.expand(env)

console.log('VITE_BASE_URL:', process.env.VITE_BASE_URL)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
})