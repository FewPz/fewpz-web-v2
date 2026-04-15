'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Music, X, Mic2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NowPlaying {
  album: string;
  albumImageUrl: string;
  artist: string;
  artists: string[];
  isPlaying: boolean;
  songUrl: string;
  title: string;
  trackId: string;
  progressMs: number;
  durationMs: number;
}

type LyricLine = { timeMs: number; text: string };

interface LyricsData {
  lines: LyricLine[];
  synced: boolean;
}

const SCROLL_GAP = 40; // px gap between the two copies

const ScrollingText = ({ children, className }: { children: string; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !textRef.current) return;
      setTextWidth(textRef.current.scrollWidth);
      setContainerWidth(containerRef.current.offsetWidth);
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [children]);

  const shouldScroll = textWidth > 0 && containerWidth > 0 && textWidth > containerWidth;
  // speed: ~60px/s, min 8s, max 20s
  const duration = Math.min(20, Math.max(8, textWidth / 60));

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden w-full', className)}
      style={{
        maskImage: shouldScroll
          ? 'linear-gradient(to right, transparent 0%, black 8%, black 88%, transparent 100%)'
          : 'none',
        WebkitMaskImage: shouldScroll
          ? 'linear-gradient(to right, transparent 0%, black 8%, black 88%, transparent 100%)'
          : 'none',
      }}
    >
      {shouldScroll ? (
        <motion.div
          key={children}
          className="flex w-fit"
          style={{ gap: SCROLL_GAP }}
          animate={{ x: [0, -(textWidth + SCROLL_GAP)] }}
          transition={{ duration, ease: 'linear', repeat: Infinity, repeatDelay: 0, delay: 1.5 }}
        >
          <span ref={textRef} className="whitespace-nowrap">{children}</span>
          <span className="whitespace-nowrap" aria-hidden="true">{children}</span>
        </motion.div>
      ) : (
        <span ref={textRef} className="block truncate whitespace-nowrap">{children}</span>
      )}
    </div>
  );
};

/* ─── Lyrics Modal ─── */
function LyricsModal({
  data,
  lyrics,
  currentLyricIndex,
  localProgress,
  onClose,
}: {
  data: NowPlaying;
  lyrics: LyricsData | null;
  currentLyricIndex: number;
  localProgress: number;
  onClose: () => void;
}) {
  const currentLineRef = useRef<HTMLParagraphElement>(null);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Auto-scroll to current line
  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLyricIndex]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const progressPct = data.durationMs > 0 ? (localProgress / data.durationMs) * 100 : 0;

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-100 flex flex-col"
    >
      {/* Background: blurred album art + dark overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={data.albumImageUrl}
          alt=""
          fill
          className="object-cover scale-110 blur-[80px] brightness-[0.3] saturate-150"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Close button */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-green-400 font-medium uppercase tracking-widest">
            Live Lyrics
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Lyrics scroll area */}
      <div
        className="relative z-10 flex-1 overflow-y-auto scrollbar-hide px-6 sm:px-12 md:px-20"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 12%, black 85%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 12%, black 85%, transparent 100%)',
        }}
      >
        {/* Top spacer so first line can center */}
        {lyrics?.synced && lyrics.lines.length > 0 ? (
          <>
            <div className="h-[40vh]" />
            {lyrics.lines.map((line, i) => {
              const isCurrent = i === currentLyricIndex;
              const distance = currentLyricIndex >= 0 ? Math.abs(i - currentLyricIndex) : i;
              const isPast = currentLyricIndex >= 0 && i < currentLyricIndex;

              let opacityClass = 'opacity-[0.12]';
              if (isCurrent) opacityClass = 'opacity-100';
              else if (distance === 1) opacityClass = isPast ? 'opacity-[0.3]' : 'opacity-[0.45]';
              else if (distance === 2) opacityClass = isPast ? 'opacity-[0.15]' : 'opacity-[0.25]';
              else if (distance === 3) opacityClass = 'opacity-[0.15]';

              return (
                <p
                  ref={isCurrent ? currentLineRef : undefined}
                  key={`${line.timeMs}-${i}`}
                  className={cn(
                    'text-center px-2 py-2 transition-all duration-500 ease-out select-none',
                    isCurrent
                      ? 'text-xl sm:text-2xl md:text-3xl font-bold text-green-400 scale-100'
                      : distance <= 1
                        ? 'text-base sm:text-lg md:text-xl font-medium text-white'
                        : distance <= 3
                          ? 'text-sm sm:text-base md:text-lg font-normal text-white'
                          : 'text-sm sm:text-base font-normal text-white',
                    opacityClass
                  )}
                  style={{
                    lineHeight: isCurrent ? '2.25' : '2.05',
                    paddingTop: isCurrent ? '0.24em' : '0.2em',
                    paddingBottom: isCurrent ? '0.34em' : '0.26em',
                    ...(isCurrent
                      ? { textShadow: '0 0 30px rgba(74,222,128,0.5), 0 0 60px rgba(74,222,128,0.2)' }
                      : {}),
                  }}
                >
                  {line.text || '♪'}
                </p>
              );
            })}
            <div className="h-[40vh]" />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center opacity-40">
            <Music className="w-12 h-12 mb-4 text-white" />
            <p className="text-white text-sm font-medium tracking-wide uppercase">No live lyrics</p>
          </div>
        )}
      </div>

      {/* Bottom bar: song info + progress */}
      <div className="relative z-10 px-6 pb-6 pt-3">
        <div className="max-w-md mx-auto">
          {/* Song info row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-lg">
              <Image
                src={data.albumImageUrl}
                alt={data.album}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{data.title}</p>
              <p className="text-xs text-white/60 truncate">{data.artist}</p>
            </div>
            <a
              href={data.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <svg className="w-5 h-5 text-green-400 hover:text-green-300 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] text-white/40 tabular-nums w-8 text-right">
              {formatTime(localProgress)}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${Math.min(100, progressPct)}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </div>
            <span className="text-[10px] text-white/40 tabular-nums w-8">
              {formatTime(data.durationMs)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Widget ─── */
export default function SpotifyNowPlaying() {
  const [data, setData] = useState<NowPlaying | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lyrics, setLyrics] = useState<LyricsData | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1);
  const [localProgress, setLocalProgress] = useState(0);
  const [showLyricsModal, setShowLyricsModal] = useState(false);

  const pathname = usePathname();
  const lastTrackIdRef = useRef<string | null>(null);
  const progressAnchorRef = useRef<{ progressMs: number; wallTime: number } | null>(null);

  const closeLyricsModal = useCallback(() => setShowLyricsModal(false), []);

  // Hide on trade-gold page
  if (pathname === '/trade-gold') return null;

  // Poll now-playing every 10s
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        const nowPlaying = await response.json();

        if (nowPlaying.isPlaying) {
          setData(nowPlaying);
          setIsVisible(true);
          progressAnchorRef.current = {
            progressMs: nowPlaying.progressMs,
            wallTime: Date.now(),
          };
        } else {
          setIsVisible(false);
          setLyrics(null);
          setCurrentLyricIndex(-1);
          setShowLyricsModal(false);
          lastTrackIdRef.current = null;
        }
      } catch {
        setIsVisible(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Fetch lyrics when track changes
  useEffect(() => {
    if (!data || !data.isPlaying) return;
    if (data.trackId === lastTrackIdRef.current) return;

    lastTrackIdRef.current = data.trackId;
    setLyrics(null);
    setCurrentLyricIndex(-1);

    const params = new URLSearchParams({
      trackId: data.trackId,
      trackName: data.title,
      artistName: data.artists?.[0] ?? data.artist,
      albumName: data.album,
      duration: String(data.durationMs),
      progressMs: String(data.progressMs),
    });

    fetch(`/api/spotify/lyrics?${params.toString()}`)
      .then((r) => r.json())
      .then((result: LyricsData) => {
        if (result.synced && result.lines.length > 0) {
          setLyrics(result);
        }
      })
      .catch(() => {});
  }, [data?.trackId]);

  // Advance local progress every 500ms and update current lyric index
  useEffect(() => {
    const tick = () => {
      if (!progressAnchorRef.current) return;
      const progress =
        progressAnchorRef.current.progressMs + (Date.now() - progressAnchorRef.current.wallTime);
      setLocalProgress(progress);

      if (!lyrics?.synced) return;
      let index = -1;
      for (let i = 0; i < lyrics.lines.length; i++) {
        if (lyrics.lines[i].timeMs <= progress) index = i;
        else break;
      }
      setCurrentLyricIndex((prev) => (prev === index ? prev : index));
    };

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [lyrics]);

  if (!data || !isVisible) return null;

  const hasLyrics = lyrics?.synced && lyrics.lines.length > 0;

  return (
    <>
      {/* Lyrics Modal */}
      <AnimatePresence>
        {showLyricsModal && (
          <LyricsModal
            data={data}
            lyrics={lyrics}
            currentLyricIndex={currentLyricIndex}
            localProgress={localProgress}
            onClose={closeLyricsModal}
          />
        )}
      </AnimatePresence>

      {/* Widget */}
      <AnimatePresence>
        {isVisible && !showLyricsModal && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50"
          >
            <motion.div
              layout
              className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg"
              style={{ width: isExpanded ? '320px' : '64px' }}
            >
              {/* Compact Mode */}
              {!isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-16 h-16 flex items-center justify-center hover:bg-muted/50 transition-colors"
                >
                  <Music className="w-6 h-6 text-green-500 animate-pulse" />
                </button>
              )}

              {/* Expanded Mode */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    {/* Album Art */}
                    <button
                      onClick={() => setShowLyricsModal(true)}
                      className="relative shrink-0 group/img text-left"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={data.albumImageUrl}
                          alt={data.album}
                          fill
                          className="object-cover group-hover/img:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                      </div>
                    </button>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                          </span>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            FewPz is listening
                          </span>
                        </div>
                        <button
                          onClick={() => setIsExpanded(false)}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => setShowLyricsModal(true)}
                        className="block hover:underline text-left w-full text-foreground"
                      >
                        <ScrollingText className="text-sm font-medium">
                          {data.title}
                        </ScrollingText>
                        <ScrollingText className="text-xs text-muted-foreground">
                          {data.artist}
                        </ScrollingText>
                      </button>
                    </div>
                  </div>

                  {/* Lyrics mini-preview — click to open modal */}
                  {hasLyrics && (() => {
                    const idx = Math.max(0, currentLyricIndex);
                    const currLine = lyrics.lines[idx] ?? null;

                    return (
                      <button
                        onClick={() => setShowLyricsModal(true)}
                        className="mt-3 w-full rounded-xl overflow-hidden relative group/lyrics cursor-pointer text-left"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%)',
                          border: '1px solid rgba(34,197,94,0.12)',
                        }}
                      >
                        <div className="py-2.5 px-3 flex items-center gap-2">
                          <Mic2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                              key={currLine?.timeMs ?? 'empty'}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.22 }}
                              className="text-[11px] font-medium text-green-400 truncate flex-1 leading-normal py-0.5"
                            >
                              {currLine?.text || '♪'}
                            </motion.p>
                          </AnimatePresence>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider opacity-0 group-hover/lyrics:opacity-100 transition-opacity shrink-0">
                            Open
                          </span>
                        </div>
                      </button>
                    );
                  })()}

                  {/* Spotify Logo */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <a
                      href="https://open.spotify.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      <span>Playing on Spotify</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
