import { createFileRoute } from '@tanstack/react-router'

const GITHUB_USER = 'FewPz'

interface ContributionDay {
  date: string
  count: number
  level: number
}

/**
 * Parses GitHub's public contribution calendar fragment. No token needed;
 * this is the same HTML the profile page loads.
 */
function parseContributions(html: string) {
  // Tooltips carry the counts: "13 contributions on October 5th." / "No contributions on ..."
  const counts = new Map<string, number>()
  for (const match of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const count = match[2].match(/^([\d,]+) contribution/)
    counts.set(match[1], count ? Number(count[1].replace(/,/g, '')) : 0)
  }

  const days: ContributionDay[] = []
  for (const match of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
    const tag = match[0]
    const date = tag.match(/data-date="([^"]+)"/)?.[1]
    const id = tag.match(/\bid="([^"]+)"/)?.[1]
    const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0)
    if (date) days.push({ date, level, count: (id && counts.get(id)) || 0 })
  }
  days.sort((a, b) => a.date.localeCompare(b.date))

  const totalMatch = html.match(/([\d,]+)\s+contributions?\s+in the last year/)
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : days.reduce((sum, d) => sum + d.count, 0)

  return { total, days }
}

export const Route = createFileRoute('/api/github-contributions')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const response = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
            headers: { 'User-Agent': 'fewpz-web' },
          })

          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`)
          }

          const data = parseContributions(await response.text())
          if (data.days.length === 0) {
            throw new Error('No contribution days found in response')
          }

          return new Response(JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
          })
        } catch (error) {
          console.error('Error fetching GitHub contributions:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch GitHub contributions' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
