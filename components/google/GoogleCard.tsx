import type { ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import ColorBar from '@/components/google/ColorBar'
import { cn } from '@/lib/utils'

interface GoogleCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: ReactNode
  /** Four-color strip along the top edge: static, revealed on hover / in view, or none */
  strip?: 'static' | 'hover' | 'view' | 'none'
}

/** Flat white card with a light border and a four-color top strip. */
export default function GoogleCard({ strip = 'static', className, children, ...props }: GoogleCardProps) {
  return (
    <motion.div
      className={cn('group relative overflow-hidden rounded-xl border border-border bg-card', className)}
      {...props}
    >
      {strip !== 'none' && (
        <ColorBar reveal={strip === 'static' ? 'none' : strip} className="absolute inset-x-0 top-0 z-10" />
      )}
      {children}
    </motion.div>
  )
}
