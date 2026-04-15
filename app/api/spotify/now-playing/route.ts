import { getNowPlaying } from '@/lib/spotify';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const response = await getNowPlaying();

  if (response.status === 204 || response.status > 400) {
    return NextResponse.json({ isPlaying: false });
  }

  const song = await response.json();

  if (song.item === null) {
    return NextResponse.json({ isPlaying: false });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const artists: string[] = song.item.artists.map((_artist: { name: string }) => _artist.name);
  const artist = artists.join(', ');
  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;
  const trackId: string = song.item.id;
  const progressMs: number = song.progress_ms ?? 0;
  const durationMs: number = song.item.duration_ms ?? 0;

  return NextResponse.json({
    album,
    albumImageUrl,
    artist,
    artists,
    isPlaying,
    songUrl,
    title,
    trackId,
    progressMs,
    durationMs,
  });
}
