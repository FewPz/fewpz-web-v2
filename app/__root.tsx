/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts, Link } from '@tanstack/react-router'
import appCss from './globals.css?url'
import Navbar from '@/components/Navbar'
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying'
import DecryptedText from '@/components/DecryptedText'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
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

function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 select-none">
      <div className="text-center space-y-6">
        <p className="text-[10rem] font-bold leading-none tracking-tighter text-foreground/5">
          404
        </p>
        <div className="-mt-8 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            <DecryptedText
              text="Page not found"
              animateOn="view"
              sequential
              speed={40}
              revealDirection="start"
              className="text-foreground"
              encryptedClassName="text-muted-foreground"
            />
          </h1>
          <p className="text-muted-foreground text-sm">
            <DecryptedText
              text="The page you're looking for doesn't exist or has been moved."
              animateOn="view"
              sequential
              speed={20}
              revealDirection="start"
              className="text-muted-foreground"
              encryptedClassName="text-muted-foreground/40"
            />
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          ← Back home
        </Link>
      </div>
    </main>
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
