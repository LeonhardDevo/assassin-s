# Assassin's Creed Saga — Image & Video Asset Manifest

## Image Inventory (28 images + 3 backgrounds)

Each game folder contains 2 images for video production.

| Game | Folder | Image 1 (Key Art) | Image 2 (Background) | Source | Resolution |
|------|--------|-------------------|----------------------|--------|------------|
| Odyssey | `odyssey/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| Origins | `origins/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x810 |
| Mirage | `mirage/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| Valhalla | `valhalla/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| AC1 | `ac1/` | 01-key-art.png | 02-background.png | Project asset | 1024x1024 (fallback) |
| AC2 | `ac2/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| Brotherhood | `brotherhood/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x786 |
| Revelations | `revelations/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 460x215 + 1438x810 |
| Shadows | `shadows/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| Black Flag | `blackflag/` | 01-key-art.png | 02-background.png | Project asset | 1024x1024 (fallback) |
| Rogue | `rogue/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| AC3 | `ac3/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 460x215 + 1438x810 |
| Unity | `unity/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |
| Syndicate | `syndicate/` | 01-key-art.jpg | 02-background.jpg | Steam CDN | 1920x620 + 1438x809 |

### Backgrounds (`backgrounds/`)
- `hero.png` — Main hero background (1024x1024)
- `origins-bg.png` — Egypt atmosphere
- `valhalla-bg.png` — Viking atmosphere

## Steam App IDs (for reference)
```
Odyssey:     812140
Origins:     582160
Mirage:      3035570
Valhalla:    2208920
AC2:         33230
Brotherhood: 48190
Revelations: 201870
Shadows:     3159330
Black Flag:  3751950 (Resynced, 2026)
Rogue:       311560
AC3:         911400 (Remastered)
Unity:       289650
Syndicate:   368500
```

## Games Needing Better Images
- **AC1** — delisted from Steam, using fallback 1024x1024. Find official press kit or UbiBlog images.
- **Black Flag** — Resynced version CDN images not yet cached. Re-try later or use original 1024x1024.
- **AC3 / Revelations** — key art is only 460x215 (header). Need higher-res from press kit.

## Video Production Notes
The `videos/` folder is prepared for your video projects. Suggested structure:
```
videos/
  saga-trailer/       — overall saga compilation
  per-game/           — one short clip per game (14 clips)
  backgrounds/        — loopable Animus background videos
```

### Recommended Video Specs
- Resolution: 1920x1080 or 3840x2160 (4K)
- Format: H.264 MP4 (web) or ProRes (editing)
- Duration: 3-5 seconds per game clip for card hovers
- Frame rate: 24fps (cinematic) or 60fps (smooth)

## Usage in Website
The website (`public/assets/`) still uses the original 1024x1024 images.
To upgrade the site to use these higher-res images, copy them to `public/images/` and update `src/games.js` image paths.

## Copyright Notice
All Assassin's Creed images are © Ubisoft Entertainment. This is a fan tribute site. Images are official promotional key art sourced from Steam Store CDN.
