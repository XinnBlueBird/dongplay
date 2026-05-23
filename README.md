# DongPlay

Watch donghua (Chinese anime) for free. No ads, no popups, no subscriptions. Just press play.

## Why DongPlay Exists

Donghua fans face a fragmented experience: official platforms are bloated with ads, geo-restrictions, and paywalls. DongPlay strips all of that away. It embeds episodes directly from official YouTube channels (Made By Bilibili, Tencent Video Animation, Yuewen Animation, iQIYI Animation, YOUKU Animation) — all content is legally streamed from verified sources with zero ads on our end.

## Features

### Browse & Discover
- 30+ popular donghua titles with poster cards, ratings, and episode counts
- Genre filters: Action, Cultivation, Fantasy, Supernatural, Sci-Fi, Comedy, Romance, Drama
- Sort by Latest, Most Popular, Highest Rated, A-Z
- Full-text search by English or Chinese title
- Top Popular ranked list with view counts

### Watch Anywhere
- Embedded YouTube player from official channels (no ads, no popups)
- Episode selector grid for quick navigation
- Previous/Next episode buttons
- Responsive 16:9 player on all devices
- YouTube embed parameters: modestbranding, no related videos, no annotations

### Bookmark System
- Save favorites with one click (localStorage)
- Dedicated bookmarks page
- Persistent across sessions

### Hero Carousel
- 5 featured titles with auto-rotation
- Blurred poster background effect
- Genre pills, ratings, episode counts
- Direct "Watch Now" links

## How It Works

DongPlay embeds YouTube videos from official, verified channels. This means:

- All content is legally hosted on YouTube
- No piracy, no stolen content
- YouTube ads may appear in the embed (we don't control YouTube's ad layer)
- The DongPlay interface itself has zero ads — no banners, no popups, no tracking pixels

We act as a curated directory and clean player, not a content host.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel
- **Data Source**: Official YouTube channels (Made By Bilibili, Tencent Video Animation, Yuewen Animation, iQIYI Animation, YOUKU Animation)

## Getting Started

```bash
git clone https://github.com/XinnBlueBird/dongplay.git
cd dongplay
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
dongplay/
├── app/
│   ├── layout.tsx              # Root layout (dark theme, Navbar)
│   ├── globals.css             # Tailwind v4 + custom dark theme
│   ├── page.tsx                # Homepage (hero carousel, grid, sidebar)
│   ├── browse/page.tsx         # Browse all with filters & search
│   ├── bookmarks/page.tsx      # Saved donghua (localStorage)
│   └── watch/
│       └── [id]/page.tsx       # Player page (YouTube embed + episodes)
├── components/
│   ├── Navbar.tsx              # Navigation with search & mobile drawer
│   ├── PosterCard.tsx          # Donghua poster card with badges
│   ├── HeroCarousel.tsx        # Featured titles auto-rotating carousel
│   ├── EpisodeGrid.tsx         # Numbered episode selector
│   ├── YouTubePlayer.tsx       # Responsive YouTube iframe wrapper
│   └── GenreFilter.tsx         # Genre filter pill buttons
├── lib/
│   └── data.ts                 # Donghua database (30+ titles, YouTube IDs)
├── .env.example
├── README.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Featured Donghua

| Title | Episodes | Rating | Status | Channel |
|---|---|---|---|---|
| Battle Through the Heavens | 226 | 8.5 | Ongoing | Yuewen Animation |
| Soul Land | 264 | 8.8 | Ongoing | Tencent Video Animation |
| Fog Hill of Five Elements | 10 | 9.0 | Ongoing | Made By Bilibili |
| Link Click | 23 | 9.1 | Completed | Made By Bilibili |
| Scissor Seven | 40 | 8.7 | Ongoing | Made By Bilibili |
| Heaven Official's Blessing | 23 | 8.9 | Completed | Made By Bilibili |
| Way of Choices | 19 | 9.0 | Ongoing | Tencent Video Animation |
| The Demon Hunter S3 | 78 | 9.0 | Ongoing | Made By Bilibili |

...and 20+ more titles.

## License

MIT
