import { createFileRoute } from '@tanstack/react-router'
import { getLyricsAtCurrentTimestamp } from '@/lib/lyrics'
import { getNowPlaying, getRecentlyPlayed, getTopItems } from '@/lib/spotify'

interface SpotifyImage {
  url: string
  width: number | null
}

interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  artists: { name: string }[]
  album: { name: string; images: SpotifyImage[] }
  external_urls: { spotify: string }
}

interface SpotifyArtist {
  id: string
  name: string
  genres?: string[]
  images: SpotifyImage[]
  external_urls: { spotify: string }
}

/** Spotify sorts images largest first; pick the smallest one that's still >= `min` px. */
function pickImage(images: SpotifyImage[], min: number) {
  const fitting = images.filter((image) => (image.width ?? 0) >= min)
  return (fitting.at(-1) ?? images[0])?.url ?? null
}

async function toTrack(track: SpotifyTrack) {
  return {
    trackId: track.id,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: track.album.name,
    // Big enough for the player's cover; the list reuses it at thumbnail size.
    albumImageUrl: pickImage(track.album.images, 300),
    songUrl: track.external_urls.spotify,
    durationMs: track.duration_ms,
    quote: await getQuote(track).catch(() => null),
  }
}

/** Two lines to quote: the most repeated line (likely the chorus) and the one after it. */
function pickQuote(lines: string[]) {
  const clean = lines.map((line) => line.trim()).filter((line) => line && !/^[([].*[)\]]$/.test(line))
  if (clean.length < 2) return null

  const counts = new Map<string, number>()
  for (const line of clean) counts.set(line, (counts.get(line) ?? 0) + 1)

  let start = Math.floor(clean.length / 3)
  let best = 1
  clean.forEach((line, i) => {
    const count = counts.get(line) ?? 0
    // First occurrence of the most repeated line, as long as a different line follows it.
    if (count > best && clean[i + 1] && clean[i + 1] !== line) {
      best = count
      start = i
    }
  })

  return clean.slice(start, start + 2)
}

async function getQuote(track: SpotifyTrack) {
  const lyrics = await getLyricsAtCurrentTimestamp({
    trackId: track.id,
    trackName: track.name,
    artists: track.artists.map((artist) => artist.name),
    albumName: track.album.name,
    durationMs: track.duration_ms,
    progressMs: 0,
  })
  if (!lyrics) return null
  const lines = lyrics.lines.length > 0 ? lyrics.lines.map((line) => line.text) : (lyrics.plainLyrics?.split(/\r?\n/) ?? [])
  return pickQuote(lines)
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Most-played tracks of the past 7 days, counted from the last 50 plays (all Spotify exposes).
 * Returns null when the token lacks the `user-read-recently-played` scope.
 */
async function getWeekTopTracks(limit: number) {
  const response = await getRecentlyPlayed(50)
  if (!response.ok) return null

  const { items }: { items: { track: SpotifyTrack; played_at: string }[] } = await response.json()
  const since = Date.now() - WEEK_MS
  const plays = new Map<string, { track: SpotifyTrack; count: number }>()
  // Items are newest first, so Map insertion order breaks ties by most recent play.
  for (const { track, played_at } of items) {
    if (new Date(played_at).getTime() < since) continue
    const entry = plays.get(track.id)
    if (entry) entry.count += 1
    else plays.set(track.id, { track, count: 1 })
  }

  return [...plays.values()].sort((a, b) => b.count - a.count).slice(0, limit)
}

/** Currently playing track with its progress, or null when nothing is playing (204) or it's not a song. */
async function getPlayingTrack(): Promise<{ track: SpotifyTrack; progressMs: number } | null> {
  const response = await getNowPlaying()
  if (response.status !== 200) return null
  const playback = await response.json()
  return playback.is_playing && playback.currently_playing_type === 'track'
    ? { track: playback.item, progressMs: playback.progress_ms ?? 0 }
    : null
}

async function buildListening() {
  const [tracksResponse, artistsResponse, playing, weekTop] = await Promise.all([
    getTopItems('tracks', 5),
    getTopItems('artists', 6),
    getPlayingTrack().catch(() => null),
    getWeekTopTracks(5).catch(() => null),
  ])

  if (!tracksResponse.ok || !artistsResponse.ok) {
    throw new Error(`Spotify responded ${tracksResponse.status} / ${artistsResponse.status}`)
  }

  const { items: topTracks }: { items: SpotifyTrack[] } = await tracksResponse.json()
  const { items: topArtists }: { items: SpotifyArtist[] } = await artistsResponse.json()

  // Past 7 days when available; top up a quiet week (or a token without
  // the recently-played scope) with the 4-week top tracks.
  const ranked: { track: SpotifyTrack; playCount: number | null }[] = (weekTop ?? []).map(({ track, count }) => ({
    track,
    playCount: count,
  }))
  for (const track of topTracks) {
    if (ranked.length >= 5) break
    if (!ranked.some((entry) => entry.track.id === track.id)) ranked.push({ track, playCount: null })
  }

  // Lyrics lookups run in parallel (and are cached in lib/lyrics).
  const [nowPlaying, tracks] = await Promise.all([
    playing ? toTrack(playing.track).then((track) => ({ ...track, progressMs: playing.progressMs })) : null,
    Promise.all(ranked.map(({ track, playCount }) => toTrack(track).then((t) => ({ ...t, playCount })))),
  ])

  return {
    nowPlaying,
    // Lets the client advance progressMs by however long the response sat in a cache.
    fetchedAt: Date.now(),
    tracks,
    // 'week'   = ranked by play count over the past 7 days
    // 'recent' = past-7-day plays exist but nothing repeats, so it's just the latest plays
    // 'month'  = Spotify's ~4-week top tracks (no recently-played data)
    tracksRange: !weekTop?.length ? 'month' : weekTop.some(({ count }) => count > 1) ? 'week' : 'recent',
    artists: topArtists.map((artist) => ({
      artistId: artist.id,
      name: artist.name,
      genres: (artist.genres ?? []).slice(0, 2),
      imageUrl: pickImage(artist.images, 300),
      url: artist.external_urls.spotify,
    })),
  }
}

// Every open tab polls this route; share one Spotify round-trip across them for a few seconds.
const CACHE_MS = 10_000
let cached: { at: number; promise: ReturnType<typeof buildListening> } | null = null

function getListening() {
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    const promise = buildListening()
    cached = { at: Date.now(), promise }
    promise.catch(() => {
      if (cached?.promise === promise) cached = null // don't keep serving a failure
    })
  }
  return cached.promise
}

export const Route = createFileRoute('/api/spotify/listening')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await getListening()
          return new Response(JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              // Browsers always revalidate (the client polls); a shared CDN may hold it
              // briefly to spare Spotify, shorter while a song is playing.
              'Cache-Control': data.nowPlaying
                ? 'public, max-age=0, s-maxage=10'
                : 'public, max-age=0, s-maxage=30, stale-while-revalidate=30',
            },
          })
        } catch (error) {
          console.error('Error fetching Spotify listening data:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch listening data' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
