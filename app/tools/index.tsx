import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/tools/')({
  component: ToolsPage,
})

const TOOLS = [
  {
    href: '/qr',
    icon: '⬛',
    name: 'QR Generator',
    desc: 'Generate a QR code from any URL or text, with optional center logo.',
  },
  {
    href: '/urldecoder',
    icon: '🔗',
    name: 'URL Decoder',
    desc: 'Decode or encode URL-encoded strings instantly.',
  },
  {
    href: '/mc',
    icon: '⛏️',
    name: 'MC Server Ping',
    desc: 'Check if a Minecraft Java Edition server is online and see its status.',
  },
  {
    href: '/color',
    icon: '🎨',
    name: 'Color Picker',
    desc: 'Pick a color and copy as HEX, RGB, HSL, or OKLCH.',
  },
  {
    href: '/forms/taro-focus-point',
    icon: '🧪',
    name: 'TARO Focus Form',
    desc: 'Evaluate Focus Point selection quality for TARO research cases.',
  },
]

function ToolsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
          <p className="text-muted-foreground text-sm">A collection of small utilities</p>
        </div>

        <div className="space-y-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:bg-accent transition-colors group"
            >
              <span className="text-2xl select-none w-8 text-center shrink-0">{tool.icon}</span>
              <div className="min-w-0">
                <p className="font-medium text-sm group-hover:text-foreground transition-colors">{tool.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5 truncate">{tool.desc}</p>
              </div>
              <span className="ml-auto text-muted-foreground text-sm shrink-0">→</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
