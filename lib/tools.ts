export interface Tool {
  href: '/qr' | '/urldecoder' | '/mc' | '/color'
  icon: string
  name: string
  desc: string
}

export const TOOLS: Tool[] = [
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
]
