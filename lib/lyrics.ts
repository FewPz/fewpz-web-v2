import "server-only";

import type { CurrentPlayback } from "./spotify";

const LRCLIB_GET_ENDPOINT = "https://lrclib.net/api/get";

export type LyricLine = {
  timeMs: number;
  text: string;
};

export type LyricsAtTimestamp = {
  synced: boolean;
  currentLine: LyricLine | null;
  nextLine: LyricLine | null;
  lines: LyricLine[];
  plainLyrics: string | null;
  source: "lrclib";
};

type LrcLibGetResponse = {
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
};

function toMs(minutes: string, seconds: string, fraction = "0") {
  const mins = Number.parseInt(minutes, 10);
  const secs = Number.parseInt(seconds, 10);
  const paddedFraction = fraction.padEnd(3, "0").slice(0, 3);
  const millis = Number.parseInt(paddedFraction, 10);
  return mins * 60_000 + secs * 1_000 + millis;
}

export function parseSyncedLyrics(lrc: string): LyricLine[] {
  const lines = lrc.split(/\r?\n/);
  const parsed: LyricLine[] = [];

  for (const line of lines) {
    const timestamps = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g)];
    if (timestamps.length === 0) {
      continue;
    }

    const text = line.replace(/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g, "").trim();
    for (const match of timestamps) {
      parsed.push({
        timeMs: toMs(match[1], match[2], match[3]),
        text,
      });
    }
  }

  parsed.sort((a, b) => a.timeMs - b.timeMs);
  return parsed;
}

export function getLyricWindowAtTime(lines: LyricLine[], progressMs: number) {
  if (lines.length === 0) {
    return {
      currentLine: null,
      nextLine: null,
    };
  }

  let index = -1;
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].timeMs <= progressMs) {
      index = i;
    } else {
      break;
    }
  }

  if (index === -1) {
    return {
      currentLine: null,
      nextLine: lines[0],
    };
  }

  return {
    currentLine: lines[index],
    nextLine: lines[index + 1] ?? null,
  };
}

const lyricCache = new Map<string, { data: LyricsAtTimestamp | null; expiry: number }>();

export async function getLyricsAtCurrentTimestamp(
  playback: Pick<
    CurrentPlayback,
    "trackId" | "trackName" | "artists" | "albumName" | "durationMs" | "progressMs"
  >,
): Promise<LyricsAtTimestamp | null> {
  const cacheKey = playback.trackId;
  const now = Date.now();

  if (lyricCache.has(cacheKey)) {
    const cached = lyricCache.get(cacheKey)!;
    if (now < cached.expiry) {
      if (cached.data) {
        return {
          ...cached.data,
          currentLine: getLyricWindowAtTime(cached.data.lines, playback.progressMs).currentLine,
          nextLine: getLyricWindowAtTime(cached.data.lines, playback.progressMs).nextLine,
        };
      }
      return null;
    }
  }

  const primaryArtist = playback.artists[0] ?? playback.artists.join(", ");

  const params = new URLSearchParams({
    track_name: playback.trackName,
    artist_name: primaryArtist,
    album_name: playback.albumName,
    duration: String(Math.round(playback.durationMs / 1_000)),
  });

  const url = `${LRCLIB_GET_ENDPOINT}?${params.toString()}`;
  console.log("LRCLIB fetching:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Spotify-Stream/1.0 (https://github.com/harshitkumar9030/spotify-stream)",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });

    if (response.status === 404) {
      lyricCache.set(cacheKey, { data: null, expiry: now + 60 * 60 * 1000 });
      return null;
    }

    if (!response.ok) {
      const body = await response.text();
      console.error(`Lyrics request failed (${response.status}): ${body}`);
      lyricCache.set(cacheKey, { data: null, expiry: now + 30 * 1000 });
      return null;
    }

    const payload = (await response.json()) as LrcLibGetResponse;
    const syncedLyrics = payload.syncedLyrics?.trim() ?? "";
    const lines = syncedLyrics ? parseSyncedLyrics(syncedLyrics) : [];

    const result: LyricsAtTimestamp = {
      synced: lines.length > 0,
      currentLine: null,
      nextLine: null,
      lines,
      plainLyrics: payload.plainLyrics ?? null,
      source: "lrclib",
    };
    lyricCache.set(cacheKey, { data: result, expiry: now + 10 * 60 * 1000 });

    const lyricWindow = getLyricWindowAtTime(lines, playback.progressMs);
    return {
      ...result,
      currentLine: lyricWindow.currentLine,
      nextLine: lyricWindow.nextLine,
    };
  } catch (e) {
    console.error(`Error fetching lyrics for ${playback.trackName}:`, e);
    return null;
  }
}
