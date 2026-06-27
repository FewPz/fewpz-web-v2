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
    <main className="min-h-screen bg-background flex flex-col items-center px-4 py-24">
      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tools</h1>
          <p className="text-muted-foreground text-base">A collection of small utilities</p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="group relative flex flex-col rounded-xl pt-3"
            >
              {/* folder tab */}
              <span className="ml-4 h-3 w-14 rounded-t-lg border border-b-0 border-border bg-card transition-colors group-hover:bg-accent" />
              {/* folder body */}
              <div className="flex min-h-[150px] flex-col gap-2 rounded-xl rounded-tl-none border border-border bg-card p-5 transition-colors group-hover:bg-accent">
                <span className="text-4xl select-none">{tool.icon}</span>
                <p className="mt-auto font-semibold text-base group-hover:text-foreground">{tool.name}</p>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
