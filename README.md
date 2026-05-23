# DongPlay — Donghua Streaming App

A modern, ad-free donghua streaming platform built with Next.js 16. DongPlay scrapes content from public sources and provides a clean interface for watching donghua with Dailymotion and Okru video embeds.

## Features

- **Latest Release** — Browse the newest donghua episodes updated in real-time
- **All Series** — Full searchable catalog with filters (ongoing/completed) and sorting
- **Video Player** — Embedded Dailymotion/Okru players with server switching
- **Bookmarks** — Save your favorite series locally
- **Watch History** — Track what you've watched with continue-watching support
- **User Profiles** — Local login/register with profile management
- **Mobile Responsive** — Works perfectly on phones, tablets, and desktop
- **Dark Theme** — Easy on the eyes with a sleek dark UI
- **No Ads** — Clean, distraction-free viewing experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Utilities**: clsx
- **Video**: Dailymotion & Okru iframe embeds

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
dongplay/
├── app/
│   ├── api/donghua/
│   │   ├── route.ts              # Homepage scraper
│   │   ├── series/route.ts       # All series scraper
│   │   └── episode/[...slug]/    # Episode detail scraper
│   ├── bookmarks/page.tsx        # Bookmarked series
│   ├── history/page.tsx          # Watch history
│   ├── login/page.tsx            # Login/register
│   ├── profile/page.tsx          # User profile
│   ├── series/page.tsx           # All series listing
│   ├── watch/[...slug]/page.tsx  # Video player
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── page.tsx                  # Homepage
├── components/
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Footer
│   └── PosterCard.tsx            # Donghua card component
└── README.md
```

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/donghua` | Scrapes homepage for latest releases |
| `GET /api/donghua/series` | Scrapes multiple pages for full series list |
| `GET /api/donghua/episode/[...slug]` | Scrapes episode page for video URL, episodes, metadata |

## Data Sources

Content is scraped from mydonghua.com (WordPress). Video is hosted on:
- **Dailymotion** — `dailymotion.com/embed/video/{id}`
- **Okru** — `ok.ru/videoembed/{id}`

Both services provide standard iframe embeds that work on all devices.

## License

MIT
