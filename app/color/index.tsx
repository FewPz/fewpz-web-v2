import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/color/')({
  component: ColorPage,
})

// ── Conversions ──────────────────────────────────────────────────────────────

function parseHex(hex: string): [number, number, number] | null {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  if (h.length !== 6) return null
  const n = parseInt(h, 16)
  if (isNaN(n)) return null
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function toLinear(c: number) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const bv = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  const C = Math.sqrt(a * a + bv * bv)
  let H = Math.atan2(bv, a) * (180 / Math.PI)
  if (H < 0) H += 360
  return [L, C, H]
}

function computeFormats(hex: string) {
  const rgb = parseHex(hex)
  if (!rgb) return null
  const [r, g, b] = rgb
  const [h, s, l] = rgbToHsl(r, g, b)
  const [L, C, H] = rgbToOklch(r, g, b)
  const norm = `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`
  return {
    hex: norm.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    oklch: `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`,
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const FORMATS = ['hex', 'rgb', 'hsl', 'oklch'] as const

function ColorPage() {
  const [hex, setHex] = useState(() => localStorage.getItem('color:hex') ?? '#3b82f6')
  const [inputText, setInputText] = useState(() => (localStorage.getItem('color:hex') ?? '#3b82f6').toUpperCase())
  const [copied, setCopied] = useState<string | null>(null)

  const formats = useMemo(() => computeFormats(hex), [hex])

  const applyHex = (norm: string) => {
    setHex(norm)
    setInputText(norm.toUpperCase())
    localStorage.setItem('color:hex', norm)
  }

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyHex(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputText(val)
    const rgb = parseHex(val)
    if (rgb) {
      const norm = `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`
      applyHex(norm)
    }
  }

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <main className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <Link to="/tools" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Tools
      </Link>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Color Picker</h1>
          <p className="text-muted-foreground text-sm">Pick a color and copy in any format</p>
        </div>

        {/* Swatch */}
        <div
          className="w-full h-32 rounded-xl border border-border shadow-sm transition-colors duration-100"
          style={{ backgroundColor: hex }}
        />

        {/* Picker + hex input */}
        <div className="flex gap-2 items-center">
          <label className="relative shrink-0 cursor-pointer">
            <div
              className="w-10 h-10 rounded-lg border border-border shadow-sm transition-colors duration-100"
              style={{ backgroundColor: hex }}
            />
            <input
              type="color"
              value={hex}
              onChange={handlePickerChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </label>
          <input
            value={inputText}
            onChange={handleTextChange}
            placeholder="#000000"
            spellCheck={false}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-all uppercase"
          />
        </div>

        {/* Format cards */}
        {formats && (
          <div className="space-y-2">
            {FORMATS.map((key) => {
              const value = formats[key]
              const isCopied = copied === key
              return (
                <button
                  key={key}
                  onClick={() => copy(value, key)}
                  className="w-full flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors group"
                >
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-14 text-left shrink-0">
                    {key}
                  </span>
                  <span className="font-mono text-foreground truncate text-left flex-1 px-2">
                    {value}
                  </span>
                  <span className={`text-xs shrink-0 transition-colors ${isCopied ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {isCopied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
