# Handoff: Japanese font + lyric polish in "What I'm Listening To"

**Generated**: 2026-10-10 18:34
**Branch**: master (in sync with origin/master)
**Status**: Ready for Review. All work is committed and pushed in `ad103c1`.

## Goal

Polish the Spotify listening section: support Japanese glyphs, fix lyric text that showed up letter-spaced ("เ ร า ม ี"), and make the lyric block look like the other cards in the section.

## Completed

- [x] Added **Noto Sans JP** as the Japanese fallback: Google Fonts URL in `app/__root.tsx`, `--font-sans` and `--font-google-sans` in `app/globals.css`, and the inline stack in `components/blog/BlogDiagram.tsx`.
- [x] Root-caused the "spread out" Thai lyrics. The LRCLIB data itself contains spaces between Thai letters; the font is not the cause. Fixed with `collapseSpacedThai()` in `lib/lyrics.ts`, applied to synced lines and `plainLyrics`. This fixes both the section card and the floating widget.
- [x] Rewrote `LyricQuote` in `components/sections/ListeningSection.tsx` to match the card style: `border-t` divider, then `CardLabel` (yellow dot, "LYRICS", `Mic2` icon as meta), then plain non-italic lines that fade in one after another.
- [x] Verified on localhost:3000 in Chrome. `/api/spotify/listening` returns `["Celebration","เรามี good energy"]` and the section renders it correctly. `tsc --noEmit` reports no errors.

## Not Yet Done

- [ ] Nothing required. Optional: if the user asks, restyle the "Live Lyrics" full-screen modal in `components/SpotifyNowPlaying.tsx` (`LyricsModal`). It was never requested.
- [ ] Optional: confirm the production host has `SPOTIFY_REFRESH_TOKEN` with the `user-top-read` and `user-read-recently-played` scopes. Without it the listening section hides itself. This carries over from the previous handoff and is unverified.

## Failed Approaches (Don't Repeat These)

- **Treating the spread-out text as a font problem.** I compared Thai glyph advance widths with fontTools: Google Sans and Bai Jamjuree are almost the same (e.g. ร 0.46 vs 0.51 em). I also rendered both fonts in-page and saw no spacing. The real cause is the data (`"เ ร า ม ี good energy"` comes from LRCLIB). Forcing `font-family: 'Bai Jamjuree'` and `letterSpacing: 0` on the quote and widget did nothing useful, so it was reverted.
- **Colourful, decorative lyric box** (blue/red/yellow/green rail, tinted card, big serif quote mark, blue glow). The user said it looked odd ("มันแปลกๆ") and asked that it match the song cards. Keep it plain and consistent with `CardLabel` and `GoogleCard`.
- **Looking for a "Google Sans JP"**: it doesn't exist. `fonts.googleapis.com/css2?family=Google+Sans+JP` returns 400. Google Sans has no kana or kanji, and Google Sans Flex has neither Japanese nor Thai. Noto Sans JP is the right fallback.

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Noto Sans JP goes after Bai Jamjuree in the stack | Latin keeps Google Sans, Thai keeps Google Sans/Bai Jamjuree, and only CJK falls through to Noto. |
| Clean the lyric text on the server (`lib/lyrics.ts`), not with CSS | The spaces are real characters. Fixing them at parse time fixes every consumer (section quote, widget, modal). |
| Only collapse runs of **3+** single Thai characters | Normal Thai with a space between phrases ("ก็ เธอ ไง") stays untouched. |
| No `ja` locale added | Not requested. Locales are still `'en' \| 'th'` in `lib/i18n.tsx`. |

## Files to Know

| File | Why It Matters |
|------|----------------|
| `lib/lyrics.ts` | LRCLIB fetch, LRC parsing, `collapseSpacedThai`, in-memory cache (10 min hit / 1 h 404 / 30 s error) |
| `app/api/spotify/listening.ts` | Builds `nowPlaying` and `tracks[]`. `pickQuote()` chooses 2 lines (the most repeated line plus the one after it). |
| `components/sections/ListeningSection.tsx` | Section UI: `CardLabel`, the player card, `LyricQuote`, `TopTracks`, the artists card |
| `components/SpotifyNowPlaying.tsx` | Floating widget, mini lyric preview, and the `LyricsModal` full-screen live lyrics |
| `app/__root.tsx` / `app/globals.css` | Google Fonts link and font-stack tokens |

## Code Context

```ts
// lib/lyrics.ts
export function collapseSpacedThai(text: string): string {
  return text.replace(/(?<=^|\s)[฀-๿](?: [฀-๿](?=$|\s)){2,}/gm, (run) => run.replace(/ /g, ""));
}
// "เ ร า ม ี good energy" -> "เรามี good energy"
// "อยากจะไปกับเธอ ทุกที่"  -> unchanged
```

```tsx
// components/sections/ListeningSection.tsx
function LyricQuote({ lines }: { lines: string[] }) // rendered as <LyricQuote key={track.trackId} lines={track.quote} />
```

```jsonc
// GET /api/spotify/listening (10 s server cache)
{ "nowPlaying": { "title": "Celebration", "quote": ["Celebration", "เรามี good energy"], ... } | null,
  "tracks": [{ "trackId": "...", "title": "...", "quote": string[] | null, "playCount": 2 }],
  "tracksRange": "week" | "recent" | "month", "artists": [...], "fetchedAt": 0 }
```

## Resume Instructions

1. `pnpm dev`, then open http://localhost:3000 and scroll to "What I'm Listening To".
   - Expected: below the player controls there's a thin divider, then "● LYRICS", then 2 plain lines. Thai shows no letter gaps.
   - If there's no lyric block: that track has no LRCLIB lyrics (`quote: null`). This is normal.
2. Check the data directly: `curl -s localhost:3000/api/spotify/listening` and look for spaced Thai in `quote`.
   - If spaced Thai still appears: the dev server may be holding a stale `lyricCache`. Restart `pnpm dev`.
3. Run `npx tsc --noEmit`. Expected: no output.

## Warnings

- LRCLIB sometimes returns `503 ServerOverloaded`. `lib/lyrics.ts` caches that as null for 30 s, so lyrics can disappear for a short time. This is not a bug in the UI.
- The project is now **TanStack Start + Vite** (`app/__root.tsx`, `routeTree.gen.ts`, `vite dev`), not Next.js, even though `CLAUDE.md` still says Next.js App Router. Trust the code.
- The user writes in Thai and English mixed together. Reply in the same language they use.
