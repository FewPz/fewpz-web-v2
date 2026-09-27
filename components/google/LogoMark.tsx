import { GOOGLE_COLORS, colorClasses } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

/** 2×2 grid of Google-colored dots used next to the wordmark. */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('grid grid-cols-2 gap-[3px]', className)}>
      {GOOGLE_COLORS.map((c) => (
        <span key={c} className={cn('size-[7px] rounded-full', colorClasses(c).bg)} />
      ))}
    </span>
  )
}
