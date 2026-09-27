import { Fragment } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import ColorDashes from '@/components/google/ColorDashes'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  description?: string
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

/** Navy display heading + four-color dashes + optional grey description. */
export default function SectionHeading({ title, description, className }: SectionHeadingProps) {
  const reduce = useReducedMotion()
  const words = title.split(' ')

  return (
    <div className={cn('mb-12 sm:mb-14', className)}>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-g-navy">
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && ' '}
            <motion.span
              className="inline-block"
              initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08, ease }}
            >
              {word}
            </motion.span>
          </Fragment>
        ))}
      </h2>
      <ColorDashes className="mt-5" delay={0.15 + words.length * 0.08} />
      {description && (
        <motion.p
          className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
