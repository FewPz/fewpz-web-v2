import { createAPIFileRoute } from '@tanstack/react-start/api'
import { getLyricsAtCurrentTimestamp } from '@/lib/lyrics'

export const APIRoute = createAPIFileRoute('/api/spotify/lyrics')({
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const trackId = url.searchParams.get('trackId')
    const trackName = url.searchParams.get('trackName')
    const artistName = url.searchParams.get('artistName')
    const albumName = url.searchParams.get('albumName')
    const duration = url.searchParams.get('duration')
    const progressMs = Number(url.searchParams.get('progressMs') ?? '0')

    if (!trackId || !trackName || !artistName || !albumName || !duration) {
      return new Response(JSON.stringify({ error: 'Missing required params' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    try {
      const result = await getLyricsAtCurrentTimestamp({
        trackId,
        trackName,
        artists: [artistName],
        albumName,
        durationMs: Number(duration),
        progressMs,
      })

      if (!result) {
        return new Response(
          JSON.stringify({ lines: [], synced: false, plainLyrics: null }),
          { headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          lines: result.lines,
          synced: result.synced,
          plainLyrics: result.plainLyrics,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    } catch (e) {
      console.error('Lyrics route error:', e)
      return new Response(
        JSON.stringify({ lines: [], synced: false, plainLyrics: null }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    }
  },
})
