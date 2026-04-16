import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: '.',
      router: {
        routesDirectory: 'app',
        generatedRouteTree: 'app/routeTree.gen.ts',
        routeFileIgnorePattern: '^(routeTree\\.gen\\.ts|api)$',
      },
    }),
    viteReact(),
  ],
})
