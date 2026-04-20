import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'

export const Route = createFileRoute('/urldecoder/')({
  component: UrlDecoderPage,
})

type Mode = 'decode' | 'encode'

function UrlDecoderPage() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('decode')
  const [copied, setCopied] = useState(false)

  const { result, error } = useMemo(() => {
    if (!input.trim()) return { result: '', error: '' }
    try {
      const result = mode === 'decode' ? decodeURIComponent(input) : encodeURIComponent(input)
      return { result, error: '' }
    } catch {
      return { result: '', error: mode === 'decode' ? 'Invalid encoded string' : 'Failed to encode' }
    }
  }, [input, mode])

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSwap = () => {
    if (result) setInput(result)
    setMode((m) => (m === 'decode' ? 'encode' : 'decode'))
  }

  return (
    <main className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <Link to="/tools" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Tools
      </Link>
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">URL Decoder</h1>
          <p className="text-muted-foreground text-sm">
            Decode or encode URL-encoded strings instantly
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden text-sm">
          {(['decode', 'encode'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 font-medium capitalize transition-colors ${
                mode === m ? 'bg-foreground text-background' : 'bg-card hover:bg-accent'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {mode === 'decode' ? 'Encoded Input' : 'Plain Input'}
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'decode'
                ? 'Paste encoded URL here…'
                : 'Paste plain URL or text here…'
            }
            rows={10}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all font-mono"
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            disabled={!result}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="text-base">⇅</span>
            Swap &amp; flip mode
          </button>
        </div>

        {/* Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {mode === 'decode' ? 'Decoded Output' : 'Encoded Output'}
            </p>
            <button
              onClick={handleCopy}
              disabled={!result}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            className={`w-full min-h-[7rem] rounded-lg border bg-card px-4 py-3 text-sm font-mono break-all whitespace-pre-wrap select-all ${
              result ? 'border-border text-foreground' : 'border-dashed border-border text-muted-foreground'
            }`}
          >
            {result || (input.trim() ? '' : 'Output will appear here…')}
          </div>
        </div>

        {/* Clear */}
        {input && (
          <div className="flex justify-end">
            <button
              onClick={() => setInput('')}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
