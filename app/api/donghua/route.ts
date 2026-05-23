import { NextResponse } from "next/server";

// Scrape donghuafast.site homepage for donghua listings
export async function GET() {
  try {
    const res = await fetch("https://donghuafast.site/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    const html = await res.text();

    const donghuaList = parseHomepage(html);
    return NextResponse.json({ data: donghuaList });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function parseHomepage(html: string) {
  const items: Record<string, unknown>[] = [];

  // Extract donghua cards: title + uuid + poster + rating + episode info
  // Pattern: card links with /donghua/{uuid}
  const uuidSet = new Set<string>();

  // Find title blocks near donghua links
  const cardRegex = /href="\/donghua\/([a-f0-9-]{36})"[^>]*>[\s\S]*?<h[23][^>]*>([^<]+)<\/h[23]>/g;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const uuid = match[1];
    const title = match[2].trim();
    if (!uuidSet.has(uuid) && title && !["Rilis Terbaru", "Top Popular", "You May Like"].includes(title)) {
      uuidSet.add(uuid);

      // Extract nearby data
      const context = html.substring(Math.max(0, match.index - 500), match.index + match[0].length + 200);

      // EP number
      const epMatch = context.match(/EP (\d+)/);
      const latestEp = epMatch ? parseInt(epMatch[1]) : 0;

      // Rating
      const ratingMatch = context.match(/(\d+\.?\d*)\s*SERIES/);
      const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

      // Status
      const statusMatch = context.match(/(ONGOING|COMPLETED)/);
      const status = (statusMatch?.[1]?.toLowerCase() || "ongoing") as "ongoing" | "completed" | "upcoming";

      // Views
      const viewsMatch = context.match(/(\d+)\s*VIEWS/);
      const views = viewsMatch ? parseInt(viewsMatch[1]) : 0;

      // Poster image
      const imgMatch = context.match(/\/api\/img\/\?u=([^&"]+)/);
      const posterRaw = imgMatch ? decodeURIComponent(imgMatch[1]) : "";

      // Year
      const yearMatch = context.match(/\b(20\d{2})\b/);
      const year = yearMatch ? parseInt(yearMatch[1]) : 2025;

      items.push({
        id: uuid,
        title,
        poster: posterRaw,
        latestEpisode: latestEp,
        rating,
        status,
        views,
        year,
      });
    }
  }

  // Also extract from the hero carousel
  const heroRegex = /href="\/donghua\/([a-f0-9-]{36})"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)<\/h2>/g;
  while ((match = heroRegex.exec(html)) !== null) {
    const uuid = match[1];
    const title = match[2].trim();
    if (!uuidSet.has(uuid) && title && !["Rilis Terbaru", "Top Popular", "You May Like"].includes(title)) {
      uuidSet.add(uuid);
      const context = html.substring(Math.max(0, match.index - 800), match.index + match[0].length + 300);
      const epMatch = context.match(/EP (\d+)/);
      const ratingMatch = context.match(/(\d+\.?\d*)\s*(?:SERIES|VIEWS)/);
      const statusMatch = context.match(/(ONGOING|COMPLETED)/);
      const viewsMatch = context.match(/(\d+)\s*VIEWS/);
      const yearMatch = context.match(/\b(20\d{2})\b/);
      const imgMatch = context.match(/\/api\/img\/\?u=([^&"]+)/);

      items.push({
        id: uuid,
        title,
        poster: imgMatch ? decodeURIComponent(imgMatch[1]) : "",
        latestEpisode: epMatch ? parseInt(epMatch[1]) : 0,
        rating: ratingMatch ? parseFloat(ratingMatch[1]) : null,
        status: (statusMatch?.[1]?.toLowerCase() || "ongoing") as "ongoing" | "completed" | "upcoming",
        views: viewsMatch ? parseInt(viewsMatch[1]) : 0,
        year: yearMatch ? parseInt(yearMatch[1]) : 2025,
      });
    }
  }

  return items;
}
