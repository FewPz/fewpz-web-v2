# Handoff: GitHub + Spotify portfolio sections

**Goal**: Add a GitHub contribution graph under Education and a live Spotify "What I'm Listening To" section to the portfolio, then redeploy safely.

**Done**: GitHub Activity card (Kibo UI ContributionGraph + `/api/github-contributions` scraper, auto-sized blocks), ListeningSection (vinyl player with prev/next + live progress, top tracks from last 7 days/recent/4-week fallback, top artists, lyric quotes via `/api/spotify/listening` with 10s server cache), TanStack Query polling (15s playing / 60s idle), `scripts/spotify-auth.mjs` token helper (scopes incl. `user-top-read`, `user-read-recently-played`), upgraded `@tanstack/react-start` 1.168.58→1.168.61 and `@tanstack/react-router` →1.170.42 for CVE-2026-102989; typecheck + `pnpm build` pass

**Next**: Ask the user whether to commit everything together or the security upgrade (`package.json` + `pnpm-lock.yaml`) first, then commit and redeploy (nothing is committed or pushed yet)

**Watch out**: Production needs the new `SPOTIFY_REFRESH_TOKEN` (with `user-top-read` + `user-read-recently-played`) set on the host, or the listening section silently hides itself
