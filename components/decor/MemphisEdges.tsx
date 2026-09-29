import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { GOOGLE_HEX, type GoogleColor } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

const TILE_W = 170
const TILE_H = 620

type Pt = readonly [number, number]

type ShapeKind =
  | { type: 'circle'; r: number }
  | { type: 'ring'; r: number }
  | { type: 'triangle'; s: number; outline?: boolean }
  | { type: 'square'; s: number; outline?: boolean }
  | { type: 'wave' }
  | { type: 'zigzag' }
  | { type: 'plus'; s: number }
  | { type: 'dotGrid' }
  | { type: 'halfCircle'; r: number }

type Shape = ShapeKind & { at: Pt; rotate?: number; color: GoogleColor }

// Separate, unconnected Memphis shapes. The two sides use different tiles so they don't mirror.
const LEFT_TILE: Shape[] = [
  { type: 'wave', at: [70, 40], rotate: -12, color: 'blue' },
  { type: 'circle', r: 8, at: [138, 72], color: 'red' },
  { type: 'triangle', s: 13, outline: true, at: [40, 122], rotate: 15, color: 'yellow' },
  { type: 'dotGrid', at: [120, 152], color: 'green' },
  { type: 'square', s: 18, outline: true, at: [60, 207], rotate: 25, color: 'red' },
  { type: 'halfCircle', r: 13, at: [135, 252], rotate: -30, color: 'blue' },
  { type: 'plus', s: 8, at: [35, 292], color: 'green' },
  { type: 'zigzag', at: [100, 337], rotate: 20, color: 'yellow' },
  { type: 'ring', r: 10, at: [45, 397], color: 'blue' },
  { type: 'triangle', s: 11, at: [135, 422], rotate: -20, color: 'red' },
  { type: 'circle', r: 6, at: [80, 472], color: 'yellow' },
  { type: 'wave', at: [125, 532], rotate: 75, color: 'green' },
  { type: 'square', s: 12, at: [40, 577], rotate: 15, color: 'red' },
]

const RIGHT_TILE: Shape[] = [
  { type: 'ring', r: 9, at: [100, 32], color: 'green' },
  { type: 'zigzag', at: [55, 87], rotate: 10, color: 'red' },
  { type: 'square', s: 16, outline: true, at: [130, 132], rotate: -18, color: 'blue' },
  { type: 'circle', r: 7, at: [45, 177], color: 'yellow' },
  { type: 'triangle', s: 13, at: [110, 227], rotate: 30, color: 'green' },
  { type: 'plus', s: 8, at: [148, 287], color: 'red' },
  { type: 'wave', at: [60, 302], rotate: -70, color: 'blue' },
  { type: 'halfCircle', r: 12, at: [125, 362], rotate: 160, color: 'yellow' },
  { type: 'dotGrid', at: [50, 407], color: 'red' },
  { type: 'triangle', s: 12, outline: true, at: [125, 452], rotate: -10, color: 'blue' },
  { type: 'square', s: 13, at: [60, 497], rotate: 35, color: 'green' },
  { type: 'circle', r: 8, at: [130, 542], color: 'red' },
  { type: 'zigzag', at: [70, 592], rotate: -8, color: 'yellow' },
]

const STROKE = { strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const

/** Draws a shape centred on (0, 0). */
function ShapeBody({ shape, color }: { shape: ShapeKind; color: string }) {
  switch (shape.type) {
    case 'circle':
      return <circle r={shape.r} fill={color} />
    case 'ring':
      return <circle r={shape.r} stroke={color} {...STROKE} />
    case 'triangle': {
      const { s } = shape
      const points = `0,${-s} ${s * 0.866},${s / 2} ${-s * 0.866},${s / 2}`
      return shape.outline ? (
        <polygon points={points} stroke={color} {...STROKE} />
      ) : (
        <polygon points={points} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={2} />
      )
    }
    case 'square': {
      const h = shape.s / 2
      return shape.outline ? (
        <rect x={-h} y={-h} width={shape.s} height={shape.s} rx={2} stroke={color} {...STROKE} />
      ) : (
        <rect x={-h} y={-h} width={shape.s} height={shape.s} rx={2} fill={color} />
      )
    }
    case 'wave':
      return <path d="M-24 0 q6 -9 12 0 t12 0 t12 0 t12 0" stroke={color} {...STROKE} strokeWidth={4} />
    case 'zigzag':
      return <path d="M-20 3 l8 -7 l8 7 l8 -7 l8 7 l8 -7" stroke={color} {...STROKE} strokeWidth={4} />
    case 'plus':
      return <path d={`M${-shape.s} 0 H${shape.s} M0 ${-shape.s} V${shape.s}`} stroke={color} {...STROKE} />
    case 'dotGrid':
      return (
        <g fill={color}>
          {[-8, 0, 8].flatMap((y) => [-8, 0, 8].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r={2} />))}
        </g>
      )
    case 'halfCircle':
      return <path d={`M${-shape.r} 0 A${shape.r} ${shape.r} 0 0 1 ${shape.r} 0 Z`} fill={color} />
  }
}

const pop: Variants = {
  hidden: { scale: 0, rotate: -45 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 420, damping: 18, delay: 0.1 + i * 0.06 },
  }),
}

const centred = { transformBox: 'fill-box', transformOrigin: 'center' } as const

function Tile({ shapes, animate }: { shapes: Shape[]; animate: boolean }) {
  return (
    <motion.svg
      width={TILE_W}
      height={TILE_H}
      viewBox={`0 0 ${TILE_W} ${TILE_H}`}
      className="block shrink-0 overflow-visible"
      initial={animate ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {shapes.map((shape, i) => (
        // Outer <g>: CSS idle drift. Middle: entrance pop. Inner: fixed position + rotation.
        <g
          key={i}
          className={animate ? 'memphis-float' : undefined}
          style={{ animationDuration: `${5 + ((i * 7) % 5)}s`, animationDelay: `${-i * 0.9}s` }}
        >
          <motion.g custom={i} variants={animate ? pop : undefined} style={centred}>
            <g transform={`translate(${shape.at[0]} ${shape.at[1]}) rotate(${shape.rotate ?? 0})`}>
              <ShapeBody shape={shape} color={GOOGLE_HEX[shape.color]} />
            </g>
          </motion.g>
        </g>
      ))}
    </motion.svg>
  )
}

/**
 * Memphis-style floating shapes down both page edges (xl screens and up).
 * Place inside a `relative` container; tiles repeat to fill its height and pop in as they scroll into view.
 */
export default function MemphisEdges({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(6)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setCount(Math.max(1, Math.ceil(entry.contentRect.height / TILE_H)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const column = (shapes: Shape[]) =>
    Array.from({ length: count }, (_, i) => <Tile key={i} shapes={shapes} animate={!reduce} />)
  // Slide the columns partly off-screen when there isn't room beside the 64rem content column.
  const edge = 'clamp(-60px, calc((100vw - 64rem) / 2 - 210px), 0px)'

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 hidden overflow-hidden xl:block', className)}
    >
      <div className="absolute top-0 flex flex-col" style={{ left: edge }}>
        {column(LEFT_TILE)}
      </div>
      <div className="absolute top-0 flex flex-col" style={{ right: edge }}>
        {column(RIGHT_TILE)}
      </div>
    </div>
  )
}
