export const GOOGLE_COLORS = ['blue', 'red', 'yellow', 'green'] as const

export type GoogleColor = (typeof GOOGLE_COLORS)[number]

export const GOOGLE_HEX: Record<GoogleColor, string> = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
}

// Full class strings so Tailwind can detect them at build time.
const CLASSES: Record<
  GoogleColor,
  { bg: string; text: string; ink: string; border: string; soft: string; hoverInk: string }
> = {
  blue: {
    bg: 'bg-g-blue',
    text: 'text-g-blue',
    ink: 'text-g-blue-ink',
    border: 'border-g-blue',
    soft: 'bg-g-blue-soft',
    hoverInk: 'hover:text-g-blue-ink',
  },
  red: {
    bg: 'bg-g-red',
    text: 'text-g-red',
    ink: 'text-g-red-ink',
    border: 'border-g-red',
    soft: 'bg-g-red-soft',
    hoverInk: 'hover:text-g-red-ink',
  },
  yellow: {
    bg: 'bg-g-yellow',
    text: 'text-g-yellow',
    ink: 'text-g-yellow-ink',
    border: 'border-g-yellow',
    soft: 'bg-g-yellow-soft',
    hoverInk: 'hover:text-g-yellow-ink',
  },
  green: {
    bg: 'bg-g-green',
    text: 'text-g-green',
    ink: 'text-g-green-ink',
    border: 'border-g-green',
    soft: 'bg-g-green-soft',
    hoverInk: 'hover:text-g-green-ink',
  },
}

export function colorName(i: number): GoogleColor {
  return GOOGLE_COLORS[((i % 4) + 4) % 4]
}

export function colorAt(i: number) {
  const name = colorName(i)
  return { name, hex: GOOGLE_HEX[name], ...CLASSES[name] }
}

export function colorClasses(name: GoogleColor) {
  return { name, hex: GOOGLE_HEX[name], ...CLASSES[name] }
}

/** Hex color to an rgba() string, e.g. rgba('#4285F4', 0.2) */
export function rgba(hex: string, alpha: number): `rgba(${number}, ${number}, ${number}, ${number})` {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}
