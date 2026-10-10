import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * Runs inline in <head> before first paint, so there's no light flash on dark pages.
 * A saved choice wins; otherwise the OS setting is used.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})()`

function readTheme(): Theme {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  window.dispatchEvent(new Event('themechange'))
}

/**
 * Switches theme. With an origin point (e.g. the toggle button) the new theme
 * grows out of it as a circle using the View Transitions API, where supported.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Private mode etc. — the switch still works for this page view
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!origin || reduceMotion || !document.startViewTransition) {
    applyTheme(theme)
    return
  }

  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(() => flushSync(() => applyTheme(theme)))
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

/** Current theme, kept in sync with toggles elsewhere and with the OS setting (until the visitor picks one). */
export function useTheme() {
  // 'light' on the server and first client render; corrected right after mount
  const [theme, setState] = useState<Theme>('light')

  useEffect(() => {
    const sync = () => setState(readTheme())
    sync()

    const media = matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = (e: MediaQueryListEvent) => {
      let saved: string | null = null
      try {
        saved = localStorage.getItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'dark' : 'light')
    }

    window.addEventListener('themechange', sync)
    media.addEventListener('change', onSystemChange)
    return () => {
      window.removeEventListener('themechange', sync)
      media.removeEventListener('change', onSystemChange)
    }
  }, [])

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => setTheme(readTheme() === 'dark' ? 'light' : 'dark', origin),
    [],
  )

  return { theme, toggle }
}
