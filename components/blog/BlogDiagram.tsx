import { useEffect, useId, useState } from 'react'
import ColorDashes from '@/components/google/ColorDashes'
import GoogleDots from '@/components/google/GoogleDots'
import { GOOGLE_HEX } from '@/lib/google-colors'
import { cn } from '@/lib/utils'

// Node styles a chart can use with `A:::blue`, `B:::red`, …
const CLASS_DEFS = `
classDef blue fill:#E8F0FE,stroke:${GOOGLE_HEX.blue},color:#0B2A8C,stroke-width:1.5px
classDef red fill:#FCE8E6,stroke:${GOOGLE_HEX.red},color:#A50E0E,stroke-width:1.5px
classDef yellow fill:#FEF7E0,stroke:${GOOGLE_HEX.yellow},color:#8A4B00,stroke-width:1.5px
classDef green fill:#E6F4EA,stroke:${GOOGLE_HEX.green},color:#0D652D,stroke-width:1.5px
classDef muted fill:#F8F9FA,stroke:#DADCE0,color:#3C4043,stroke-width:1.5px`

let mermaidReady: Promise<typeof import('mermaid').default> | null = null

/** Loads mermaid once, in the browser only, themed to match the site. */
function loadMermaid() {
  mermaidReady ??= import('mermaid').then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      fontFamily: "'Google Sans', 'Bai Jamjuree', sans-serif",
      themeVariables: {
        fontSize: '15px',
        primaryColor: '#E8F0FE',
        primaryBorderColor: GOOGLE_HEX.blue,
        primaryTextColor: '#0B2A8C',
        lineColor: '#9AA0A6',
        clusterBkg: '#FFFFFF',
        clusterBorder: '#DADCE0',
        edgeLabelBackground: '#FFFFFF',
      },
      flowchart: { curve: 'basis', padding: 16, nodeSpacing: 36, rankSpacing: 44 },
    })
    return mermaid
  })
  return mermaidReady
}

interface BlogDiagramProps {
  /** Mermaid source. Flowcharts can use the classes blue, red, yellow, green and muted. */
  chart: string
  caption?: string
  className?: string
}

/** Mermaid diagram in a framed card, rendered on the client. */
export default function BlogDiagram({ chart, caption, className }: BlogDiagramProps) {
  const id = 'mmd-' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const [svg, setSvg] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const source = /^\s*(flowchart|graph)\b/.test(chart) ? chart.trim() + '\n' + CLASS_DEFS : chart.trim()

    loadMermaid()
      .then((mermaid) => mermaid.render(id, source))
      .then(({ svg }) => !cancelled && setSvg(svg))
      .catch((err) => {
        console.error('[BlogDiagram]', err)
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [chart, id])

  return (
    <figure className={cn('overflow-hidden rounded-xl border border-border bg-card', className)}>
      <div className="flex min-h-40 items-center justify-center overflow-x-auto p-5 sm:p-8">
        {svg ? (
          <div
            role="img"
            aria-label={caption}
            className="w-full [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : failed ? (
          <pre className="w-full overflow-x-auto font-mono text-sm text-muted-foreground">{chart.trim()}</pre>
        ) : (
          <GoogleDots />
        )}
      </div>
      {caption && (
        <figcaption className="flex items-center justify-between gap-4 border-t border-border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
          <span>{caption}</span>
          <ColorDashes size="sm" className="shrink-0" />
        </figcaption>
      )}
    </figure>
  )
}
