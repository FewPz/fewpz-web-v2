# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Peeranat Matsor (FewPz), a full-stack developer based in Bangkok, Thailand. Built with Next.js 16 (App Router), React 19, and TypeScript.

## Commands

- **Dev server:** `npm run dev` (runs on localhost:3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint with next/core-web-vitals and next/typescript configs)
- **Add shadcn component:** `npx shadcn@latest add <component>`

No test framework is configured.

## Architecture

### Routing (App Router)

- `app/page.tsx` — Home page (client component), composed of section components
- `app/blogs/` — Blog section with static post data defined inline in `page.tsx`
- `app/trade-gold/` — Full-screen gold price dashboard that auto-rotates between ThaiGoldWidget and TradingView chart

### API Routes

- `app/api/spotify/now-playing/` — Edge runtime. Uses Spotify OAuth refresh token flow (`lib/spotify.ts`) to fetch currently playing track. Requires `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` env vars.
- `app/api/gold-price/` — Proxies and parses XML from thaigold.info API into JSON.

### Components

- `components/sections/` — Page sections (Hero, About, Projects, Timeline, Research, Skills, Contact, Footer) composed into the home page
- `components/ui/` — shadcn/ui primitives (new-york style, neutral base color, CSS variables for theming)
- `components/` (root) — Animation/effect components (many sourced from ReactBits, Aceternity, Kibo UI registries) and feature components (Navbar, SpotifyNowPlaying, ThaiGoldWidget, TradingViewWidget)

### Layout

`app/layout.tsx` renders `<Navbar />` and `<SpotifyNowPlaying />` globally across all pages. Uses Bai Jamjuree (Thai+Latin) as the primary font and Inter as secondary.

### Styling

- Tailwind CSS v4 with CSS-first configuration in `app/globals.css`
- Dark theme defined via CSS custom properties (`:root` and `.dark` variant)
- Animation libraries: `motion` (Framer Motion successor), GSAP (`@gsap/react`), `tw-animate-css`
- WebGL effects via `ogl` and `@react-three/fiber` / `three`

### Path Aliases

`@/*` maps to project root (e.g., `@/components/ui/button`, `@/lib/utils`)

## Environment Variables

See `.env.example` — Spotify API credentials are required for the now-playing widget.

## Key Conventions

- Component registries configured in `components.json`: `@react-bits`, `@aceternity`, `@kibo-ui`
- `next/image` remote patterns allow `i.scdn.co` (Spotify album art)
- Package manager is npm (both `package-lock.json` and `pnpm-lock.yaml` exist, but npm is primary)
