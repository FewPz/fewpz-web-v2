import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef } from 'react'

export const Route = createFileRoute('/mc/')({
  component: McPage,
})

const MC_COLORS: Record<string, string> = {
  black: '#000000', dark_blue: '#0000AA', dark_green: '#00AA00', dark_aqua: '#00AAAA',
  dark_red: '#AA0000', dark_purple: '#AA00AA', gold: '#FFAA00', gray: '#AAAAAA',
  dark_gray: '#555555', blue: '#5555FF', green: '#55FF55', aqua: '#55FFFF',
  red: '#FF5555', light_purple: '#FF55FF', yellow: '#FFFF55', white: '#FFFFFF',
}
const LEGACY_COLORS: Record<string, string> = {
  '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
  '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
  '8': '#555555', '9': '#5555FF', a: '#55FF55', b: '#55FFFF',
  c: '#FF5555', d: '#FF55FF', e: '#FFFF55', f: '#FFFFFF',
}

type Seg = { text: string; color?: string; bold?: boolean; italic?: boolean }
type TextComp = { text?: string; extra?: TextComp[]; color?: string; bold?: boolean; italic?: boolean; translate?: string }

function parseLegacy(raw: string): Seg[] {
  const segments: Seg[] = []
  const parts = raw.split('§')
  let color: string | undefined
  let bold = false
  let italic = false
  for (let i = 0; i < parts.length; i++) {
    if (i === 0) { if (parts[i]) segments.push({ text: parts[i] }); continue }
    const code = parts[i][0]?.toLowerCase()
    const text = parts[i].slice(1)
    if (code in LEGACY_COLORS) { color = LEGACY_COLORS[code]; bold = false; italic = false }
    else if (code === 'l') bold = true
    else if (code === 'o') italic = true
    else if (code === 'r') { color = undefined; bold = false; italic = false }
    if (text) segments.push({ text, color, bold, italic })
  }
  return segments
}

function parseComponent(c: TextComp): Seg[] {
  const segs: Seg[] = []
  const color = c.color ? MC_COLORS[c.color] ?? c.color : undefined
  if (c.text) segs.push(...parseLegacy(c.text).map(s => ({ ...s, color: s.color ?? color, bold: s.bold ?? c.bold, italic: s.italic ?? c.italic })))
  if (c.extra) for (const child of c.extra) segs.push(...parseComponent({ color, bold: c.bold, italic: c.italic, ...child }))
  return segs
}

function parseMotd(desc: unknown): Seg[] {
  if (typeof desc === 'string') return parseLegacy(desc)
  if (typeof desc === 'object' && desc !== null) return parseComponent(desc as TextComp)
  return []
}

function Motd({ desc }: { desc: unknown }) {
  const segs = parseMotd(desc)
  if (!segs.length) return <span className="text-muted-foreground italic">No description</span>
  return (
    <>
      {segs.map((s, i) => (
        <span key={i} style={{ color: s.color, fontWeight: s.bold ? 700 : undefined, fontStyle: s.italic ? 'italic' : undefined }}>
          {s.text}
        </span>
      ))}
    </>
  )
}

function latencyColor(ms: number) {
  if (ms < 80) return 'text-green-400'
  if (ms < 180) return 'text-yellow-400'
  if (ms < 400) return 'text-orange-400'
  return 'text-red-400'
}

type McResult = {
  version?: { name: string; protocol: number }
  players?: { online: number; max: number; sample?: Array<{ name: string; id: string }> }
  description?: unknown
  favicon?: string
  latency: number
  error?: string
}

function McPage() {
  const [host, setHost] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<McResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handlePing = async () => {
    const rawHost = host.trim()
    if (!rawHost) return

    let resolvedHost = rawHost
    let resolvedPort = '25565'

    if (rawHost.includes(':')) {
      const idx = rawHost.lastIndexOf(':')
      resolvedHost = rawHost.slice(0, idx)
      resolvedPort = rawHost.slice(idx + 1) || '25565'
    }

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`/api/mc-ping?host=${encodeURIComponent(resolvedHost)}&port=${encodeURIComponent(resolvedPort)}`)
      const data: McResult = await res.json()
      setResult(data)
    } catch {
      setResult({ error: 'Network error', latency: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePing()
  }

  const online = result && !result.error
  const playerPct = result?.players ? Math.min(100, (result.players.online / result.players.max) * 100) : 0

  return (
    <main className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <Link to="/tools" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Tools
      </Link>
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">MC Server Ping</h1>
          <p className="text-muted-foreground text-sm">Check Java Edition server status</p>
        </div>

        {/* Input row */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={host}
            onChange={(e) => setHost(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="play.example.com or host:port"
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          <button
            onClick={handlePing}
            disabled={loading || !host.trim()}
            className="rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? 'Pinging…' : 'Ping'}
          </button>
        </div>

        {/* Error */}
        {result?.error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {result.error}
          </div>
        )}

        {/* Result card */}
        {online && result && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Header: icon + motd */}
            <div className="flex items-start gap-4 p-4 border-b border-border">
              {result.favicon ? (
                <img src={result.favicon} alt="Server icon" className="w-16 h-16 rounded-md shrink-0 image-rendering-pixelated" style={{ imageRendering: 'pixelated' }} />
              ) : (
                <div className="w-16 h-16 rounded-md shrink-0 bg-muted flex items-center justify-center text-2xl select-none">
                  ⛏️
                </div>
              )}
              <div className="min-w-0 space-y-0.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">MOTD</p>
                <p className="font-mono text-sm leading-snug break-all">
                  <Motd desc={result.description} />
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-3 space-y-0.5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Version</p>
                <p className="text-sm font-medium truncate" title={result.version?.name}>{result.version?.name ?? '—'}</p>
              </div>
              <div className="p-3 space-y-0.5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Players</p>
                <p className="text-sm font-medium">
                  {result.players?.online.toLocaleString()} <span className="text-muted-foreground font-normal">/ {result.players?.max.toLocaleString()}</span>
                </p>
              </div>
              <div className="p-3 space-y-0.5 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Latency</p>
                <p className={`text-sm font-medium ${latencyColor(result.latency)}`}>{result.latency} ms</p>
              </div>
            </div>

            {/* Player bar */}
            {result.players && result.players.max > 0 && (
              <div className="px-4 pb-3">
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-foreground/60 rounded-full transition-all"
                    style={{ width: `${playerPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
