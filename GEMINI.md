# Project Context: fewpz-web-v2

## Overview
This is a **Next.js 16** web application built with **React 19** and **TypeScript**. It utilizes the App Router architecture and emphasizes modern UI/UX with animation and component libraries.

## Tech Stack & Dependencies
- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** 
  - Tailwind CSS v4
  - `tailwind-merge` & `clsx` for class management
  - `class-variance-authority` (CVA) for component variants
- **UI Components:** 
  - [shadcn/ui](https://ui.shadcn.com/) (configured in `components.json` with "new-york" style)
  - Radix UI primitives (`@radix-ui/*`)
  - Icons: `lucide-react`
- **Animation & Graphics:**
  - `motion` (modern animation library)
  - `ogl` (Minimal WebGL library)
  - `tw-animate-css`

## Project Structure
- **`app/`**: Contains the application routes, layouts, and pages (App Router).
  - `layout.tsx`: Root layout file.
  - `page.tsx`: Home page.
  - `globals.css`: Global styles (Tailwind directives).
- **`components/`**: Reusable React components.
  - **`ui/`**: shadcn/ui primitive components (e.g., `button.tsx`, `avatar.tsx`).
  - Project specific components (e.g., `Aurora.tsx`, `RotatingText.tsx`, `Navbar.tsx`).
- **`lib/`**: Utility functions.
  - `utils.ts`: Contains the standard `cn` helper for Tailwind class merging.
- **`public/`**: Static assets.

## Development Conventions
- **Package Manager:** NPM (inferred from `package-lock.json` presence, though `bun`, `yarn`, `pnpm` are listed in README).
- **Path Aliases:** Uses `@/*` mapped to the project root `./` (defined in `tsconfig.json`).
- **Component Imports:**
  - Components: `@/components`
  - UI Components: `@/components/ui`
  - Utils: `@/lib/utils` or `@/lib`
  - Hooks: `@/hooks` (configured in `components.json`)
- **Strictness:** TypeScript `strict` mode is enabled.

## Key Commands
- **Development Server:** `npm run dev`
- **Build:** `npm run build`
- **Start Production:** `npm run start`
- **Lint:** `npm run lint`

## Configuration Files
- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts` / `postcss.config.mjs`: Tailwind CSS configuration (using v4, config might be minimal or handled via CSS).
- `components.json`: Configuration for the shadcn/ui CLI.
- `tsconfig.json`: TypeScript compiler options.
