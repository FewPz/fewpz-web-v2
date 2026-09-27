import { motion, useReducedMotion } from 'motion/react'
import { GOOGLE_COLORS, colorClasses } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

/** Four bouncing Google-colored dots, used as a loader / scroll cue. */
export default function GoogleDots({ className, size = 8 }: { className?: string; size?: number }) {
  const reduce = useReducedMotion()

  return (
    <div className={cn('flex items-end gap-1.5', className)} role="presentation">
      {GOOGLE_COLORS.map((c, i) => (
        <motion.span
          key={c}
          className={cn('block rounded-full', colorClasses(c).bg)}
          style={{ width: size, height: size }}
          animate={reduce ? undefined : { y: [0, -size, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
        />
      ))}
    </div>
  )
}
