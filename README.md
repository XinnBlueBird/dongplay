# DongPlay

Watch donghua (Chinese anime) for free. No ads, no popups, no subscriptions. Just press play.

## Why DongPlay Exists

Donghua fans face a fragmented experience: official platforms are bloated with ads, geo-restrictions, and paywalls. DongPlay strips all of that away. It scrapes donghuafast.site for catalog data and embeds video from a clean worker endpoint (get.timorles23.workers.dev). The DongPlay interface itself has zero ads — no banners, no popups, no tracking pixels.

## How It Works

1. **Catalog**: DongPlay scrapes donghuafast.site for donghua listings, metadata, ratings, and episode data
2. **Video**: Episodes are embedded via iframe from `get.timorles23.workers.dev/v/{id}`
3. **Zero Ads**: Our interface is completely ad-free. We act as a curated directory and clean player.

## Features

### Browse & Discover
- Full catalog with poster cards, ratings, and episode counts
- Status filters: All, Ongoing, Completed
- Sort by Latest or A-Z
- Full-text search by title
- Top Popular ranked list with view counts

### Watch Anywhere
- Embedded video player from workers.dev (no ads, no popups)
- Episode selector grid for quick navigation
- Previous/Next episode buttons
- Responsive 16:9 player on all devices
- iframe with full PIP and fullscreen support

### Bookmark System
- Save favorites with one click (localStorage)
- Dedicated bookmarks page
- Persistent across sessions

### Homepage
- Featured hero section with blurred poster background
- Latest Updates grid (responsive: 2-6 columns)
- Genre/status filter pills
- Top Popular sidebar ranked #1-5

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **Fonts**: Inter (Google Fonts)
- **Data Source**: donghuafast.site (scraper)
- **Video Source**: get.timorles23.workers.dev

## Getting Started

```bash
git clone <repo-url>
cd dongplay
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
dongplay/
├── app/
│   ├── layout.tsx                      # Root layout (dark theme, Navbar)
│   ├── globals.css                     # Tailwind v4 + custom dark theme
│   ├── page.tsx                        # Homepage (hero, grid, sidebar)
│   ├── browse/page.tsx                 # Browse all with filters & search
│   ├── bookmarks/page.tsx              # Saved donghua (localStorage)
│   ├── watch/[id]/page.tsx             # Player page (iframe + episodes)
│   └── api/
│       └── donghua/
│           ├── route.ts                # Homepage scraper
│           ├── [id]/route.ts           # Detail page scraper
│           └── [id]/[episodeId]/route.ts  # Episode video URL scraper
├── components/
│   ├── Navbar.tsx                      # Navigation with search & mobile drawer
│   └── PosterCard.tsx                  # Donghua poster card with badges
├── lib/
│   └── types.ts                        # TypeScript interfaces
├── README.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

## License

MIT
