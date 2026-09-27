/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts, Link } from '@tanstack/react-router'
import appCss from './globals.css?url'
import Navbar from '@/components/Navbar'
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying'
import DecryptedText from '@/components/DecryptedText'
import MinecraftEasterEgg from '@/components/MinecraftEasterEgg'
import CircuitRails from '@/components/google/CircuitRails'
import ColorDashes from '@/components/google/ColorDashes'
import { PillDot, pillClassName } from '@/components/google/PillLink'
import { LocaleProvider, getInitialLocale, useI18n } from '@/lib/i18n'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  beforeLoad: () => ({ locale: getInitialLocale() }),
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
        href: 'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&family=Bai+Jamjuree:wght@200;300;400;500;600;700&family=Inter:wght@100..900&display=swap',
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
  const { t } = useI18n()
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 select-none">
      <CircuitRails />
      <div className="relative flex flex-col items-center text-center">
        <p className="text-[7rem] sm:text-[9rem] font-bold leading-none tracking-tighter text-g-navy">404</p>
        <ColorDashes className="mt-6" delay={0.2} />
        <div className="mt-8 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            <DecryptedText
              key={t({ en: 'Page not found', th: 'ไม่พบหน้านี้' })}
              text={t({ en: 'Page not found', th: 'ไม่พบหน้านี้' })}
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
              key={t({ en: "The page you're looking for doesn't exist or has been moved.", th: 'หน้าที่คุณกำลังหาไม่มีอยู่ หรืออาจถูกย้ายไปแล้ว' })}
              text={t({ en: "The page you're looking for doesn't exist or has been moved.", th: 'หน้าที่คุณกำลังหาไม่มีอยู่ หรืออาจถูกย้ายไปแล้ว' })}
              animateOn="view"
              sequential
              speed={20}
              revealDirection="start"
              className="text-muted-foreground"
              encryptedClassName="text-muted-foreground/40"
            />
          </p>
        </div>
        <Link to="/" className={`${pillClassName} mt-8`}>
          <PillDot />
          {t({ en: 'Back home', th: 'กลับหน้าแรก' })}
        </Link>
      </div>
    </main>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const { locale } = Route.useRouteContext()
  return (
    <html lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased font-google-sans pb-[5rem] md:pb-0">
        <LocaleProvider initialLocale={locale}>
          <Navbar />
          {children}
          {import.meta.env.VITE_DISABLE_SPOTIFY !== 'true' && <SpotifyNowPlaying />}
          <MinecraftEasterEgg />
        </LocaleProvider>
        <Scripts />
      </body>
    </html>
  )
}
