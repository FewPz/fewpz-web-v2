import { motion, useReducedMotion } from 'motion/react'
import { GOOGLE_COLORS, colorClasses } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

interface ColorDashesProps {
  className?: string
  size?: 'sm' | 'md'
  delay?: number
}

/** Four separate rounded dashes (blue, red, yellow, green) used under headings. */
export default function ColorDashes({ className, size = 'md', delay = 0 }: ColorDashesProps) {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className={cn('flex', size === 'md' ? 'gap-1.5' : 'gap-1', className)}>
      {GOOGLE_COLORS.map((c, i) => (
        <motion.span
          key={c}
          className={cn(
            'block origin-left rounded-full',
            size === 'md' ? 'h-[5px] w-10' : 'h-[3px] w-4',
            colorClasses(c).bg,
          )}
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  )
}
