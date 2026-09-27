import { useId } from 'react'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Small rectangular flag for a locale, drawn as SVG (flag emoji don't render on Windows).
 * th → Thailand, en → United Kingdom.
 */
export default function FlagIcon({ locale, className }: { locale: Locale; className?: string }) {
  const id = useId()

  return (
    <span
      aria-hidden
      className={cn('inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10', className)}
    >
      {locale === 'th' ? (
        <svg viewBox="0 0 9 6" preserveAspectRatio="xMidYMid slice" className="size-full">
          <rect width="9" height="6" fill="#A51931" />
          <rect y="1" width="9" height="4" fill="#F4F5F8" />
          <rect y="2" width="9" height="2" fill="#2D2A4A" />
        </svg>
      ) : (
        <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="size-full">
          <clipPath id={`${id}-t`}>
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
          </clipPath>
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      )}
    </span>
  )
}
