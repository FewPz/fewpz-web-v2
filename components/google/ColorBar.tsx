import { motion, useReducedMotion } from 'motion/react'
import { GOOGLE_COLORS, colorClasses } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

interface ColorBarProps {
  className?: string
  /**
   * none: always visible
   * hover: wipes in when the nearest `group` is hovered
   * view: wipes in once when scrolled into view
   */
  reveal?: 'none' | 'hover' | 'view'
}

/** Contiguous four-segment strip, used along the top edge of cards. */
export default function ColorBar({ className, reveal = 'none' }: ColorBarProps) {
  const reduce = useReducedMotion()
  const segments = GOOGLE_COLORS.map((c) => <span key={c} className={cn('h-full flex-1', colorClasses(c).bg)} />)

  if (reveal === 'view' && !reduce) {
    return (
      <motion.div
        aria-hidden
        className={cn('flex h-1 w-full', className)}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {segments}
      </motion.div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        'flex h-1 w-full',
        reveal === 'hover' &&
          '[clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)]',
        className,
      )}
    >
      {segments}
    </div>
  )
}
