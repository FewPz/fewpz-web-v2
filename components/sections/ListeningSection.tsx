import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import GoogleCard from '@/components/google/GoogleCard';
import GoogleDots from '@/components/google/GoogleDots';
import SectionHeading from '@/components/google/SectionHeading';
import { colorAt } from '@/lib/google-colors';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Music, Play, SkipBack, SkipForward } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { SiSpotify } from 'react-icons/si';

interface Track {
  trackId: string;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | null;
  songUrl: string;
  durationMs: number;
  quote: string[] | null;
  /** Plays in the past 7 days; null for tracks filled in from the 4-week top list */
  playCount?: number | null;
}

interface NowPlaying extends Track {
  progressMs: number;
}

interface Artist {
  artistId: string;
  name: string;
  genres: string[];
  imageUrl: string | null;
  url: string;
}

interface ListeningData {
  nowPlaying: NowPlaying | null;
  fetchedAt: number;
  tracks: Track[];
  tracksRange: 'week' | 'recent' | 'month';
  artists: Artist[];
}

async function fetchListening(): Promise<ListeningData> {
  const response = await fetch('/api/spotify/listening');
  if (!response.ok) {
    throw new Error('Failed to fetch listening data');
  }
  return response.json();
}

// Full class strings so Tailwind can detect them at build time.
const artistRingHover = [
  'group-hover/artist:border-g-blue',
  'group-hover/artist:border-g-red',
  'group-hover/artist:border-g-yellow',
  'group-hover/artist:border-g-green',
];

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  } as const;
}

function formatTime(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function Cover({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={cn('object-cover', className)} />
  ) : (
    <div className={cn('flex items-center justify-center bg-muted', className)}>
      <Music className="size-1/3 text-muted-foreground" />
    </div>
  );
}

/** Small uppercase card label with a brand-color dot, plus optional right-hand meta. */
function CardLabel({ dot, children, meta }: { dot: string; children: ReactNode; meta?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <span className={cn('size-2 rounded-full', dot)} />
        {children}
      </h3>
      {meta}
    </div>
  );
}

// Per-bar height keyframes (fraction of full height), offset so the bars don't move in lockstep.
const EQ_BARS = [
  [0.45, 0.9, 0.35, 0.75, 0.45],
  [0.9, 0.4, 1, 0.55, 0.9],
  [0.6, 1, 0.5, 0.85, 0.6],
  [0.8, 0.45, 0.7, 1, 0.8],
  [0.4, 0.7, 0.95, 0.5, 0.4],
];

/** Five bars in the brand colors, always bouncing; livelier while a song is playing. */
function Equalizer({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="flex h-4 items-end gap-[3px]">
      {EQ_BARS.map((frames, i) => (
        <motion.span
          key={i}
          className={cn('h-full w-[3px] origin-bottom rounded-full', colorAt(i).bg)}
          initial={{ scaleY: frames[0] }}
          animate={reduce ? { scaleY: frames[0] } : { scaleY: playing ? frames : frames.map((f) => 0.35 + f * 0.4) }}
          transition={
            reduce
              ? undefined
              : { duration: (playing ? 0.9 : 1.8) + i * 0.08, ease: 'easeInOut', repeat: Infinity, delay: i * 0.1 }
          }
        />
      ))}
    </div>
  );
}

/**
 * Album sleeve with a vinyl record peeking out (further on hover).
 * Grooves look the same at every angle, so the disc itself stays still and
 * only the center label turns; rotating the fine groove pattern shimmers.
 */
function RecordSleeve({ track, live }: { track: Track; live: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-[72%] max-w-64">
      <div className="absolute inset-[4%] translate-x-[18%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[36%]">
        <div className="relative size-full rounded-full bg-[#1c1d20] shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
          {/* Grooves, with a couple of brighter bands between "tracks" */}
          <span
            aria-hidden
            className="absolute inset-[3%] rounded-full [background:repeating-radial-gradient(circle,rgba(255,255,255,0.05)_0_1px,transparent_1px_3px)]"
          />
          <span aria-hidden className="absolute inset-[6%] rounded-full ring-1 ring-white/10" />
          <span aria-hidden className="absolute inset-[11%] rounded-full ring-1 ring-white/10" />
          {/* Light sheen */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-full [background:conic-gradient(from_210deg,transparent_0deg,rgba(255,255,255,0.16)_35deg,transparent_75deg,transparent_180deg,rgba(255,255,255,0.1)_215deg,transparent_255deg)]"
          />
          {/* Label: ~33 rpm while playing, a slow idle turn otherwise */}
          <motion.div
            className="absolute inset-[15%] overflow-hidden rounded-full ring-1 ring-black/40 will-change-transform"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: live ? 1.8 : 6, ease: 'linear', repeat: Infinity }}
          >
            <Cover src={track.albumImageUrl} alt="" className="size-full" />
          </motion.div>
          <span aria-hidden className="absolute inset-[47.5%] rounded-full bg-card ring-1 ring-black/30" />
        </div>
      </div>
      <Cover
        src={track.albumImageUrl}
        alt={track.album}
        className="relative aspect-square w-full rounded-lg shadow-[0_1px_3px_rgba(60,64,67,0.2),0_6px_16px_rgba(60,64,67,0.12)]"
      />
    </div>
  );
}

/** Live position of the currently playing song, ticking forward from the API snapshot. */
function useLiveProgress(nowPlaying: NowPlaying | null, fetchedAt: number, active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  if (!nowPlaying) return 0;
  return Math.min(nowPlaying.durationMs, nowPlaying.progressMs + Math.max(0, now - fetchedAt));
}

function PlayerButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
    >
      {children}
    </button>
  );
}

function PlayerCard({
  queue,
  index,
  onSelect,
  onEnded,
  nowPlaying,
  fetchedAt,
  rankOf,
}: {
  queue: Track[];
  index: number;
  onSelect: (trackId: string) => void;
  /** The live song reached its end; time to ask Spotify what's next. */
  onEnded: () => void;
  nowPlaying: NowPlaying | null;
  fetchedAt: number;
  rankOf: (trackId: string) => number;
}) {
  const { t } = useI18n();
  const track = queue[index];
  const live = !!nowPlaying && track.trackId === nowPlaying.trackId;
  const progressMs = useLiveProgress(nowPlaying, fetchedAt, live);
  const position = live ? progressMs : 0;
  const percent = track.durationMs ? (position / track.durationMs) * 100 : 0;
  const rank = rankOf(track.trackId);
  const ended = live && position >= track.durationMs;

  useEffect(() => {
    if (ended) onEnded();
  }, [ended, onEnded]);

  const step = (delta: number) => onSelect(queue[(index + delta + queue.length) % queue.length].trackId);

  return (
    <GoogleCard strip="static" className="flex h-full flex-col p-6 md:col-span-2 md:row-span-2" {...fadeUp(0)}>
      <CardLabel dot={live ? 'bg-g-green animate-pulse' : 'bg-g-blue'} meta={<Equalizer playing={live} />}>
        {live
          ? t({ en: 'Now playing', th: 'กำลังฟังอยู่' })
          : rank === 1
            ? t({ en: 'On repeat', th: 'วนฟังช่วงนี้' })
            : t({ en: `Top #${rank}`, th: `อันดับ ${rank}` })}
      </CardLabel>

      {/* Remount per track so each change slides in */}
      <motion.div
        key={track.trackId}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <RecordSleeve track={track} live={live} />

        <div className="mt-6 min-w-0">
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xl font-bold text-g-navy hover:underline"
            title={track.title}
          >
            {track.title}
          </a>
          <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
        </div>
      </motion.div>

      {/* Player */}
      <div className="mt-5">
        <div
          role="progressbar"
          aria-label={t({ en: 'Song progress', th: 'ความคืบหน้าของเพลง' })}
          aria-valuemin={0}
          aria-valuemax={Math.round(track.durationMs / 1000)}
          aria-valuenow={Math.round(position / 1000)}
          className="relative h-1 rounded-full bg-muted"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-g-blue transition-[width] duration-1000 ease-linear"
            style={{ width: `${percent}%` }}
          />
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-g-blue shadow-sm transition-[left] duration-1000 ease-linear"
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-muted-foreground">
          <span>{formatTime(position)}</span>
          <span>{formatTime(track.durationMs)}</span>
        </div>

        <div className="mt-2 flex items-center justify-center gap-3">
          <PlayerButton label={t({ en: 'Previous', th: 'ก่อนหน้า' })} onClick={() => step(-1)}>
            <SkipBack className="size-4 fill-current" />
          </PlayerButton>
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t({ en: 'Play on Spotify', th: 'เล่นบน Spotify' })}
            title={t({ en: 'Play on Spotify', th: 'เล่นบน Spotify' })}
            className="inline-flex size-12 items-center justify-center rounded-full bg-g-blue text-white shadow-[0_1px_3px_rgba(60,64,67,0.25)] transition-[scale,background-color] hover:scale-105 hover:bg-g-blue-ink active:scale-95"
          >
            <Play className="ml-0.5 size-5 fill-current" />
          </a>
          <PlayerButton label={t({ en: 'Next', th: 'ถัดไป' })} onClick={() => step(1)}>
            <SkipForward className="size-4 fill-current" />
          </PlayerButton>
        </div>
      </div>

      {track.quote && (
        <div className="mt-auto pt-5">
          <blockquote
            key={track.trackId}
            className="border-l-[3px] pl-4 text-sm italic leading-relaxed text-muted-foreground [border-image:linear-gradient(to_bottom,var(--g-blue),var(--g-red),var(--g-yellow),var(--g-green))_1]"
          >
            {track.quote.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </blockquote>
        </div>
      )}
    </GoogleCard>
  );
}

function TopTracks({
  tracks,
  range,
  selectedId,
  onSelect,
}: {
  tracks: Track[];
  range: ListeningData['tracksRange'];
  selectedId: string;
  onSelect: (trackId: string) => void;
}) {
  const { t } = useI18n();
  return (
    <GoogleCard strip="none" className="p-6 md:col-span-3" {...fadeUp(0.1)}>
      <CardLabel
        dot="bg-g-red"
        meta={
          <span className="text-xs text-muted-foreground">
            {range === 'week'
              ? t({ en: 'Last 7 days', th: '7 วันล่าสุด' })
              : range === 'recent'
                ? t({ en: 'Recently played', th: 'เพิ่งฟัง' })
                : t({ en: 'Last 4 weeks', th: '4 สัปดาห์ล่าสุด' })}
          </span>
        }
      >
        {t({ en: 'Top tracks', th: 'เพลงที่ฟังบ่อย' })}
      </CardLabel>
      <ol className="-mx-2">
        {tracks.map((track, i) => {
          const selected = track.trackId === selectedId;
          return (
            <li key={track.trackId}>
              <button
                type="button"
                onClick={() => onSelect(track.trackId)}
                aria-pressed={selected}
                className={cn(
                  'group/row flex w-full items-center gap-4 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted',
                  selected && 'bg-muted',
                )}
              >
                <span className={cn('w-6 shrink-0 text-center text-lg font-bold tabular-nums', colorAt(i).ink)}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative size-11 shrink-0 overflow-hidden rounded-md">
                  <Cover src={track.albumImageUrl} alt={track.album} className="size-full" />
                  <span
                    className={cn(
                      'absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity',
                      selected ? 'opacity-100' : 'opacity-0 group-hover/row:opacity-100',
                    )}
                  >
                    <Play className="size-4 fill-white text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground" title={track.title}>
                    {track.title}
                  </p>
                  <p className="truncate text-sm text-muted-foreground" title={track.artist}>
                    {track.artist}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {range === 'week' && track.playCount
                    ? t({
                        en: `${track.playCount} play${track.playCount === 1 ? '' : 's'}`,
                        th: `${track.playCount} ครั้ง`,
                      })
                    : formatTime(track.durationMs)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </GoogleCard>
  );
}

function TopArtists({ artists }: { artists: Artist[] }) {
  const { t } = useI18n();
  return (
    <GoogleCard strip="none" className="p-6 md:col-span-3" {...fadeUp(0.2)}>
      <CardLabel dot="bg-g-yellow">{t({ en: 'Top artists', th: 'ศิลปินที่ฟังบ่อย' })}</CardLabel>
      <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-6">
        {artists.map((artist, i) => (
          <a
            key={artist.artistId}
            href={artist.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/artist block min-w-0 text-center"
          >
            <div
              className={cn(
                'mx-auto aspect-square w-full max-w-24 rounded-full border-2 border-transparent p-0.5 transition-colors',
                artistRingHover[i % artistRingHover.length],
              )}
            >
              <Cover
                src={artist.imageUrl}
                alt={artist.name}
                className="size-full rounded-full transition-transform duration-500 group-hover/artist:scale-[1.04]"
              />
            </div>
            <p className="mt-2 truncate text-sm font-semibold text-foreground" title={artist.name}>
              {artist.name}
            </p>
            {artist.genres.length > 0 && (
              <p className="truncate text-[11px] text-muted-foreground">{artist.genres.join(' / ')}</p>
            )}
          </a>
        ))}
      </div>
    </GoogleCard>
  );
}

/** What I'm listening to: a player over my top tracks (or what's playing now), plus top artists, from Spotify. */
export default function ListeningSection() {
  const { t } = useI18n();
  const { data, isError, refetch } = useQuery({
    queryKey: ['spotify', 'listening'],
    queryFn: fetchListening,
    staleTime: 10_000,
    // Poll faster while a song is playing; pauses automatically in background tabs.
    refetchInterval: (query) => (query.state.data?.nowPlaying ? 15_000 : 60_000),
    retry: 1,
  });
  // null = follow the first track in the queue (what's playing now, else the #1 track).
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleEnded = useCallback(() => void refetch(), [refetch]);

  // What's playing now goes first, then the top tracks.
  const queue = useMemo<Track[]>(() => {
    if (!data) return [];
    const { nowPlaying, tracks } = data;
    return nowPlaying ? [nowPlaying, ...tracks.filter((track) => track.trackId !== nowPlaying.trackId)] : tracks;
  }, [data]);

  // Nothing worth showing visitors if Spotify is unavailable. A failed refetch keeps the last good data.
  if ((!data && isError) || (data && queue.length === 0 && data.artists.length === 0)) return null;

  const rankOf = (trackId: string) => (data?.tracks.findIndex((track) => track.trackId === trackId) ?? -1) + 1;
  // Keep the visitor's pick across refetches; fall back if it dropped out of the queue.
  const current = queue.find((track) => track.trackId === selectedId) ?? queue[0];

  return (
    <section className="pb-24 sm:pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading title={t({ en: "What I'm Listening To", th: 'สิ่งที่ชอบฟังตอนนี้' })} />

        {!data ? (
          <div className="flex items-center justify-center py-12">
            <GoogleDots size={10} />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-5">
              {current && (
                <PlayerCard
                  queue={queue}
                  index={queue.indexOf(current)}
                  onSelect={setSelectedId}
                  onEnded={handleEnded}
                  nowPlaying={data.nowPlaying}
                  fetchedAt={data.fetchedAt}
                  rankOf={rankOf}
                />
              )}
              {data.tracks.length > 0 && (
                <TopTracks
                  tracks={data.tracks}
                  range={data.tracksRange}
                  selectedId={current?.trackId ?? ''}
                  onSelect={setSelectedId}
                />
              )}
              {data.artists.length > 0 && <TopArtists artists={data.artists} />}
            </div>
            <p className="mt-5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <SiSpotify className="size-3.5 text-[#1DB954]" />
              {t({ en: 'Live from Spotify', th: 'ข้อมูลสดจาก Spotify' })}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
