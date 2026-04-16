import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import TradingViewWidget from '@/components/TradingViewWidget'
import ThaiGoldWidget from '@/components/ThaiGoldWidget'

export const Route = createFileRoute('/trade-gold/')({
  component: TradeGoldPage,
})

const ROTATION_INTERVAL = 10000 // 10 seconds

function TradeGoldPage() {
  const [activeView, setActiveView] = useState<'gold' | 'chart'>('gold')

  // Auto-rotate between views every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveView((current) => (current === 'gold' ? 'chart' : 'gold'))
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="h-screen w-full bg-background overflow-hidden relative">
      {/* Gold Price Widget - Fullscreen */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{
          opacity: activeView === 'gold' ? 1 : 0,
          pointerEvents: activeView === 'gold' ? 'auto' : 'none',
          zIndex: activeView === 'gold' ? 10 : 0,
        }}
      >
        <ThaiGoldWidget />
      </div>

      {/* TradingView Chart - Fullscreen */}
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{
          opacity: activeView === 'chart' ? 1 : 0,
          pointerEvents: activeView === 'chart' ? 'auto' : 'none',
          zIndex: activeView === 'chart' ? 10 : 0,
        }}
      >
        <TradingViewWidget />
      </div>
    </main>
  )
}
