import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

let electronPlugin: any = null
try {
  require.resolve('vite-plugin-electron/simple')
  require('electron')
  const electron = require('vite-plugin-electron/simple').default
  electronPlugin = electron({
    main: {
      entry: 'electron/main.ts',
      onstart(args: any) {
        try {
          args.startup()
        } catch (e: any) {
          console.log('[vite] Electron not ready, running in web mode:', e.message)
        }
      },
      vite: {
        build: {
          outDir: 'dist-electron',
          rollupOptions: {
            external: ['electron']
          }
        }
      }
    },
    preload: {
      input: path.join(__dirname, 'electron/preload.ts')
    },
    renderer: process.env.NODE_ENV === 'test' ? undefined : {}
  })
} catch (e: any) {
  console.log('[vite] Electron plugin disabled:', e.message?.split('\n')[0])
}

export default defineConfig({
  plugins: [
    react(),
    ...(electronPlugin ? [electronPlugin] : [])
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000
  }
})
