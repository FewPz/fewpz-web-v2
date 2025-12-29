'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NowPlaying {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

const ScrollingText = ({ children, className }: { children: string; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;
    
    const updateWidths = () => {
        if (!containerRef.current || !textRef.current) return;
        setWidth(textRef.current.scrollWidth);
        setContainerWidth(containerRef.current.offsetWidth);
    };

    updateWidths();
    
    const observer = new ResizeObserver(updateWidths);
    observer.observe(containerRef.current);
    observer.observe(textRef.current);
    
    return () => observer.disconnect();
  }, [children]);

  const shouldScroll = width > containerWidth;

  return (
    <div ref={containerRef} className={cn("overflow-hidden w-full", className)}
         style={{ maskImage: shouldScroll ? 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none' }}>
      <motion.div
        className={cn("flex gap-8 w-fit", shouldScroll ? "" : "truncate")}
        animate={shouldScroll ? { x: [0, -width - 32] } : { x: 0 }}
        transition={shouldScroll ? {
            duration: width * 0.05, // Speed factor
            ease: "linear",
            repeat: Infinity,
            delay: 2,
        } : {}}
      >
        <div ref={textRef} className="whitespace-nowrap">{children}</div>
        {shouldScroll && <div className="whitespace-nowrap" aria-hidden="true">{children}</div>}
      </motion.div>
    </div>
  );
};

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<NowPlaying | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        const nowPlaying = await response.json();
        
        if (nowPlaying.isPlaying) {
          setData(nowPlaying);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        console.error('Error fetching now playing:', error);
        setIsVisible(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!data || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            layout
            className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg"
            style={{ minWidth: isExpanded ? '320px' : '64px' }}
          >
            {/* Compact Mode - Just Icon */}
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-16 h-16 flex items-center justify-center hover:bg-muted/50 transition-colors group"
              >
                <Music className="w-6 h-6 text-green-500 animate-pulse" />
              </button>
            )}

            {/* Expanded Mode - Full Player */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Album Art */}
                  <a
                    href={data.songUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative shrink-0 group/img"
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
                  </a>

                  {/* Song Info */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
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
                    
                    <a
                      href={data.songUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:underline"
                    >
                      <ScrollingText className="text-sm font-medium text-foreground">
                        {data.title}
                      </ScrollingText>
                      <ScrollingText className="text-xs text-muted-foreground">
                        {data.artist}
                      </ScrollingText>
                    </a>
                  </div>
                </div>

                {/* Spotify Logo */}
                <div className="mt-3 pt-3 border-t border-border">
                  <a
                    href="https://open.spotify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-green-500 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
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
  );
}
