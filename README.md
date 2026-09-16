# Assassin's Creed — Saga

A cinematic fan tribute website dedicated to the Assassin's Creed franchise. Features a fully interactive saga browser with timeline, lore section, and store — all wrapped in an Animus-themed immersive UI.

> Fan tribute. Not affiliated with Ubisoft Entertainment.

## Tech Stack

- **Build:** Vite
- **Styling:** Tailwind CSS v4 (custom `@theme` design system)
- **3D Background:** Three.js (WebGL particle field + digital grid)
- **Animations:** GSAP + ScrollTrigger, Anime.js
- **Fonts:** Playfair Display, Cinzel, Hanken Grotesk, Geist

## Features

- Animus intro loading overlay with stroke-drawn crest
- Horizontal scroll carousel for featured games
- Era-based filtering (Ancient / Renaissance / Colonial / Revolution)
- Interactive timeline of historical events
- Lore section (Assassins vs Templars, Isu, Pieces of Eden, Animus)
- Ubisoft Store mockup (games, merch, collectibles)
- Search overlay with keyboard navigation (arrows + enter)
- Eagle Vision toggle (desktop, key: V)
- Custom gold cursor with hover expansion (desktop)
- Desync flicker effect on fast scroll
- Glitch text effect on hero title
- Hidden Blade reveal animation on scroll
- Decode text materialization for chapter labels
- Ken Burns slow zoom on hero image
- Responsive design with mobile menu drawer
- `prefers-reduced-motion` support throughout

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Project Structure

```
src/
  main.js           — entry point, renders games/timeline/store
  style.css          — Tailwind theme + all custom AC animations
  three-bg.js        — Three.js particle background
  ui-animations.js   — Animus intro, Eagle Vision, cursor, decode, desync
  ui-modals.js       — search, mobile menu, game detail modal
  games.js           — all game data, eras, timeline, store items
  legal.js           — shared CSS for legal pages
public/
  images/            — game cover images
  assets/            — logos, hero image, game icons
  icons.svg          — SVG sprite
images/              — high-res source images (not served by Vite)
```

## Images

All Assassin's Creed images are official promotional key art sourced from Steam Store CDN. Copyright belongs to Ubisoft Entertainment.
