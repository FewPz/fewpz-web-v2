import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/gold-price')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const response = await fetch(
            'https://thaigold.info/RealTimeDataV2/GoldPriceToday.xml',
            {
              cache: 'no-store',
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              },
            },
          )

          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`)
          }

          const xmlText = await response.text()

          const extract = (tag: string) => {
            const match = xmlText.match(new RegExp(`<${tag}>(.*?)</${tag}>`))
            return match ? match[1] : null
          }

          const data = {
            buy: extract('buyprice'),
            buyChange: extract('buypricechg'),
            sell: extract('saleprice'),
            usd: extract('usdthb'),
            usdChange: extract('usdthbchg'),
            spotGold: extract('goldspot'),
            spotGoldChange: extract('goldspotchg'),
            marketStatus: extract('sms'),
            updateTime: extract('update'),
          }

          return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error fetching gold price:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch gold price' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})