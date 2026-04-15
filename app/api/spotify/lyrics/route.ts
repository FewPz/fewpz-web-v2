import { getLyricsAtCurrentTimestamp } from '@/lib/lyrics';
import { NextRequest, NextResponse } from 'next/server';

// Node.js runtime required — the in-memory lyric cache (Map) won't persist in edge
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const trackId = searchParams.get('trackId');
  const trackName = searchParams.get('trackName');
  const artistName = searchParams.get('artistName');
  const albumName = searchParams.get('albumName');
  const duration = searchParams.get('duration');
  const progressMs = Number(searchParams.get('progressMs') ?? '0');

  if (!trackId || !trackName || !artistName || !albumName || !duration) {
    return NextResponse.json({ error: 'Missing required params' }, { status: 400 });
  }

  try {
    const result = await getLyricsAtCurrentTimestamp({
      trackId,
      trackName,
      artists: [artistName],
      albumName,
      durationMs: Number(duration),
      progressMs,
    });

    if (!result) {
      return NextResponse.json({ lines: [], synced: false, plainLyrics: null });
    }

    return NextResponse.json({
      lines: result.lines,
      synced: result.synced,
      plainLyrics: result.plainLyrics,
    });
  } catch (e) {
    console.error('Lyrics route error:', e);
    return NextResponse.json({ lines: [], synced: false, plainLyrics: null });
  }
}
