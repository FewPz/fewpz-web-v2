import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import QRCode from 'qrcode'

export const Route = createFileRoute('/qr/')({
  component: QRPage,
})

const PREVIEW_SIZE = 400
const LOGO_RATIO = 0.75
const SIZE_OPTIONS = [512, 1024, 2048] as const
type SizeOption = (typeof SIZE_OPTIONS)[number]

function QRPage() {
  const [text, setText] = useState(() => localStorage.getItem('qr:text') ?? '')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [logoSrc, setLogoSrc] = useState<string | null>(() => localStorage.getItem('qr:logo'))
  const [downloadSize, setDownloadSize] = useState<SizeOption>(1024)
  const [error, setError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compose = useCallback(async (value: string, logo: string | null, size = PREVIEW_SIZE) => {
    if (!value.trim()) {
      setQrDataUrl('')
      setError('')
      return null
    }
    try {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      await QRCode.toCanvas(canvas, value, {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H',
      })

      if (logo) {
        const ctx = canvas.getContext('2d')!
        const img = new Image()
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = reject
          img.src = logo
        })
        const logoSize = size * LOGO_RATIO
        const logoX = (size - logoSize) / 2
        const logoY = (size - logoSize) / 2
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
      }

      return canvas.toDataURL('image/png')
    } catch {
      setError('Failed to generate QR code')
      return null
    }
  }, [])

  const generatePreview = useCallback(async (value: string, logo: string | null) => {
    const url = await compose(value, logo, PREVIEW_SIZE)
    if (url !== null) {
      setQrDataUrl(url)
      setError('')
    }
  }, [compose])

  useEffect(() => {
    generatePreview(text, logoSrc)
  }, [])

  const handleChange = (value: string) => {
    setText(value)
    localStorage.setItem('qr:text', value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => generatePreview(value, logoSrc), 300)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      setLogoSrc(src)
      localStorage.setItem('qr:logo', src)
      generatePreview(text, src)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLogoSrc(null)
    localStorage.removeItem('qr:logo')
    if (fileInputRef.current) fileInputRef.current.value = ''
    generatePreview(text, null)
  }

  const handleDownload = async () => {
    if (!text.trim()) return
    const url = await compose(text, logoSrc, downloadSize)
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = `qrcode-${downloadSize}x${downloadSize}.png`
    link.click()
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">QR Generator</h1>
          <p className="text-muted-foreground text-sm">Generate a QR code from any URL or text</p>
        </div>

        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter URL or text..."
            rows={3}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>

        {/* Logo upload */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Center Logo (optional)</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 rounded-lg border border-dashed border-border bg-card py-2.5 text-sm hover:bg-accent transition-colors text-center"
            >
              {logoSrc ? 'Replace image' : 'Upload image'}
            </button>
            {logoSrc && (
              <>
                <img src={logoSrc} alt="Logo preview" className="w-10 h-10 rounded-md object-cover border border-border" />
                <button
                  onClick={handleRemoveLogo}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Remove
                </button>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          {qrDataUrl ? (
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-card w-72 h-72 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">QR code will appear here</span>
            </div>
          )}

          {/* Size selector + download */}
          <div className="flex gap-2 w-full">
            <div className="flex rounded-lg border border-border overflow-hidden text-sm">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => setDownloadSize(size)}
                  className={`px-3 py-2.5 font-medium transition-colors ${
                    downloadSize === size
                      ? 'bg-foreground text-background'
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className="flex-1 rounded-lg bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
