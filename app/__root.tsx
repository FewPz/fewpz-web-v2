/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import appCss from './globals.css?url'
import Navbar from '@/components/Navbar'
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Peeranat Matsor - FewPz' },
      { name: 'description', content: 'Portfolio of Fewpz - Full-stack Developer based in Bangkok, Thailand' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@200;300;400;500;600;700&family=Inter:wght@100..900&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased font-bai-jamjuree">
        <Navbar />
        {children}
        {import.meta.env.VITE_DISABLE_SPOTIFY !== 'true' && <SpotifyNowPlaying />}
        <Scripts />
      </body>
    </html>
  )
}
