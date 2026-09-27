import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie, getRequestHeader } from '@tanstack/react-start/server'

export type Locale = 'en' | 'th'

/** A string that differs per language. Plain strings are shown as-is in both. */
export type Localized = Record<Locale, string>
export type Text = string | Localized

const COOKIE = 'locale'
const ONE_YEAR = 60 * 60 * 24 * 365

function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'th'
}

function fromLanguageTag(tag: string | undefined | null): Locale {
  return tag?.trim().toLowerCase().startsWith('th') ? 'th' : 'en'
}

/**
 * The visitor's language: their saved choice (cookie) if any, otherwise their browser language.
 * Runs on the server during SSR, so the first paint is already in the right language.
 */
export const getInitialLocale = createIsomorphicFn()
  .server((): Locale => {
    const saved = getCookie(COOKIE)
    if (isLocale(saved)) return saved
    return fromLanguageTag(getRequestHeader('accept-language'))
  })
  .client((): Locale => {
    const saved = document.cookie.match(/(?:^|;\s*)locale=(en|th)\b/)?.[1]
    if (isLocale(saved)) return saved
    return fromLanguageTag(navigator.language)
  })

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${COOKIE}=${next}; path=/; max-age=${ONE_YEAR}; samesite=lax`
    document.documentElement.lang = next
  }, [])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>')
  const { locale, setLocale } = ctx
  const t = useCallback((text: Text) => (typeof text === 'string' ? text : text[locale]), [locale])
  return { locale, setLocale, t }
}
