import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://mydonghua.com/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const html = await res.text();
    const items = parseHomepage(html);
    return NextResponse.json({ data: items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

interface DonghuaItem {
  slug: string;
  title: string;
  poster: string;
  episode: number;
  status: string;
  episodeSlug: string;
}

function parseHomepage(html: string): DonghuaItem[] {
  const items: DonghuaItem[] = [];
  const seen = new Set<string>();

  // Pattern: https://mydonghua.com/watch/{series-slug}.html/{episode_number}
  const linkRe = /href="(https:\/\/mydonghua\.com\/watch\/([^"]+?)(?:\.html)?(?:\/(\d+))?)"\s*(?:class="[^"]*")?\s*>([^<]*)</g;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    const fullUrl = m[1];
    const seriesSlug = m[2];
    const episodeNum = m[3];
    const linkText = m[4].trim();

    // Skip if no episode or already seen
    if (!episodeNum) continue;
    if (seen.has(seriesSlug + "/" + episodeNum)) continue;
    seen.add(seriesSlug + "/" + episodeNum);

    // Clean title from link text
    let title = linkText
      .replace(/English Subtitles?/i, "")
      .replace(/Sub (Esp|Indo|Thai)/i, "")
      .replace(/Episode\s+\d+/i, "")
      .trim();

    // If title is empty or too short, try getting from context
    if (title.length < 3) {
      const ctxStart = Math.max(0, m.index - 600);
      const ctxEnd = Math.min(html.length, m.index + 200);
      const ctx = html.substring(ctxStart, ctxEnd);

      const altM = ctx.match(/alt="([^"]+)"/);
      const h2M = ctx.match(/<h[12][^>]*>([^<]+)</);
      title = (altM?.[1] || h2M?.[1] || seriesSlug)
        .replace(/English Subtitles?/i, "")
        .replace(/Episode\s+\d+/i, "")
        .trim();
    }

    // Get poster from nearby img
    const ctxStart = Math.max(0, m.index - 800);
    const ctxEnd = Math.min(html.length, m.index + 100);
    const ctx = html.substring(ctxStart, ctxEnd);
    const imgM = ctx.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
    const poster = imgM ? imgM[1] : "";

    items.push({
      slug: seriesSlug,
      title,
      poster,
      episode: parseInt(episodeNum),
      status: "ongoing",
      episodeSlug: fullUrl.replace("https://mydonghua.com/", ""),
    });
  }

  return items;
}
