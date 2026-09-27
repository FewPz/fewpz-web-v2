import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { GOOGLE_HEX, type GoogleColor } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

const TILE_W = 190
const TILE_H = 560
/** The right rail is the left one mirrored and shifted, so the two sides don't line up. */
const RIGHT_OFFSET = 180

type Pt = readonly [number, number]

type Shape =
  | { type: 'line'; d: string; color: GoogleColor; ends?: Pt[] }
  | { type: 'dot'; at: Pt; color: GoogleColor }
  | { type: 'square'; at: Pt; color: GoogleColor }
  | { type: 'dots'; at: Pt[]; color: GoogleColor }

// One repeating tile of line-and-dot doodles.
const TILE: Shape[] = [
  { type: 'line', d: 'M20 20 V86 Q20 100 34 100 H92', color: 'blue', ends: [[20, 20], [92, 100]] },
  { type: 'square', at: [75, 45], color: 'blue' },
  { type: 'line', d: 'M108 20 L168 80', color: 'green', ends: [[168, 80]] },
  { type: 'dot', at: [144, 117], color: 'yellow' },
  { type: 'line', d: 'M168 125 V183 Q168 197 154 197 H100', color: 'red', ends: [[168, 125], [100, 197]] },
  { type: 'dots', at: [142, 160, 178, 196, 214, 232].map((y) => [36, y] as const), color: 'yellow' },
  { type: 'dot', at: [68, 173], color: 'green' },
  { type: 'dot', at: [172, 237], color: 'green' },
  { type: 'line', d: 'M85 277 H38 Q24 277 24 291 V383 Q24 397 38 397 H85', color: 'green' },
  { type: 'line', d: 'M127 252 V319 Q127 333 141 333 H172', color: 'blue', ends: [[172, 333]] },
  { type: 'dot', at: [28, 445], color: 'red' },
  { type: 'line', d: 'M60 453 H125', color: 'yellow', ends: [[60, 453]] },
  { type: 'line', d: 'M164 420 V510', color: 'red', ends: [[164, 420], [164, 510]] },
  { type: 'dots', at: [20, 38, 56, 74].map((x) => [x, 493] as const), color: 'blue' },
  { type: 'dot', at: [100, 517], color: 'blue' },
]

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.9, delay: i * 0.05, ease: 'easeInOut' },
      opacity: { duration: 0.01, delay: i * 0.05 },
    },
  }),
}

const pop: Variants = {
  hidden: { scale: 0 },
  visible: (i: number) => ({
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 20, delay: 0.35 + i * 0.05 },
  }),
}

const popStyle = { transformBox: 'fill-box', transformOrigin: 'center' } as const

function Tile({ animate }: { animate: boolean }) {
  const lineVariants = animate ? draw : undefined
  const dotVariants = animate ? pop : undefined

  return (
    <motion.svg
      width={TILE_W}
      height={TILE_H}
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      fill="none"
      className="block shrink-0 overflow-visible"
      initial={animate ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {TILE.map((s, i) => {
        const color = GOOGLE_HEX[s.color]
        switch (s.type) {
          case 'line':
            return (
              <g key={i}>
                <motion.path
                  d={s.d}
                  stroke={color}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  custom={i}
                  variants={lineVariants}
                />
                {s.ends?.map(([x, y]) => (
                  <motion.circle
                    key={`${x}-${y}`}
                    cx={x}
                    cy={y}
                    r={7}
                    fill={color}
                    custom={i}
                    variants={dotVariants}
                    style={popStyle}
                  />
                ))}
              </g>
            )
          case 'dot':
            return (
              <motion.circle
                key={i}
                cx={s.at[0]}
                cy={s.at[1]}
                r={8}
                fill={color}
                custom={i}
                variants={dotVariants}
                style={popStyle}
              />
            )
          case 'square':
            return (
              <motion.rect
                key={i}
                x={s.at[0] - 7}
                y={s.at[1] - 7}
                width={14}
                height={14}
                rx={2}
                fill={color}
                custom={i}
                variants={dotVariants}
                style={popStyle}
              />
            )
          case 'dots':
            return (
              <g key={i}>
                {s.at.map(([x, y], j) => (
                  <motion.circle
                    key={j}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={color}
                    custom={i + j * 0.5}
                    variants={dotVariants}
                    style={popStyle}
                  />
                ))}
              </g>
            )
        }
      })}
    </motion.svg>
  )
}

/**
 * Decorative line-and-dot rails down both page edges (xl screens and up).
 * Place inside a `relative` container; tiles repeat to fill its height and draw in as they scroll into view.
 */
export default function CircuitRails({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(6)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setCount(Math.max(1, Math.ceil((entry.contentRect.height + RIGHT_OFFSET) / TILE_H)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const tiles = Array.from({ length: count }, (_, i) => <Tile key={i} animate={!reduce} />)
  // Slide the rails partly off-screen when there isn't room beside the 64rem content column.
  const edge = 'clamp(-70px, calc((100vw - 64rem) / 2 - 230px), 0px)'

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 hidden overflow-hidden xl:block', className)}
    >
      <div className="absolute top-0 flex flex-col" style={{ left: edge }}>
        {tiles}
      </div>
      <div className="absolute flex flex-col" style={{ right: edge, top: -RIGHT_OFFSET, transform: 'scaleX(-1)' }}>
        {tiles}
      </div>
    </div>
  )
}
