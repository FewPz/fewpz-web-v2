import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nitro } from 'nitro/vite'
import { fileURLToPath } from 'url'

export default defineConfig({
  server: { port: 3000 },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: '.',
      router: {
        routesDirectory: 'app',
        generatedRouteTree: 'app/routeTree.gen.ts',
        routeFileIgnorePattern: '^(routeTree\\.gen\\.ts|api)$',
      },
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    viteReact(),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : 'node-server',
    }),
  ],
})