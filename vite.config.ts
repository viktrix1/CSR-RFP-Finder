import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This injects the API_KEY from Vercel's build environment into the client-side code
    // Falls back to empty string to prevent "undefined" causing syntax errors in some edge cases
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ""),
  },
});