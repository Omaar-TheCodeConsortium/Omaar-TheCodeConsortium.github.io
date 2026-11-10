import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // scripts/prerender.mjs reads the manifest to link each pre-rendered page to its own CSS and JS.
  build: { manifest: true },
  // Bundle GSAP into the pre-render build so Node does not have to resolve its sub-path imports.
  ssr: { noExternal: ['gsap', '@gsap/react'] },
})
