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
}

function parseHomepage(html: string): DonghuaItem[] {
  const items: DonghuaItem[] = [];
  const seen = new Set<string>();

  // Parse article elements with links - mydonghua.com pattern
  // Articles contain links like: <a href="/way-of-choices-episode-19-english-subtitles/">
  const articleRe = /<article[^>]*>([\s\S]*?)<\/article>/gi;
  let m;
  while ((m = articleRe.exec(html)) !== null) {
    const block = m[1];

    // Extract link
    const hrefM = block.match(/href="\/([^"]+\/)"/);
    if (!hrefM) continue;
    const slug = hrefM[1].replace(/\/$/, "");
    if (seen.has(slug)) continue;
    seen.add(slug);

    // Extract title
    const titleM = block.match(/title="([^"]+)"/) || block.match(/<[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)</i) || block.match(/alt="([^"]+)"/);
    let title = titleM ? titleM[1].trim() : "";
    if (!title) continue;

    // Clean up title
    title = title.replace(/English Subtitles?/i, "").replace(/Sub (Esp|Indo|Thai)/i, "").trim();

    // Extract poster image
    const imgM = block.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i) || block.match(/data-src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
    const poster = imgM ? imgM[1] : "";

    // Extract episode number
    const epM = block.match(/Episode\s+(\d+)/i) || block.match(/EP\s*(\d+)/i) || title.match(/Episode\s+(\d+)/i) || title.match(/EP\s*(\d+)/i);
    const episode = epM ? parseInt(epM[1]) : 0;

    // Status
    const statusM = block.match(/(ongoing|completed)/i);
    const status = statusM ? statusM[1].toLowerCase() : "ongoing";

    items.push({ slug, title, poster, episode, status });
  }

  // Fallback: parse links directly if no articles found
  if (items.length === 0) {
    const linkRe = /href="\/([\w-]+-episode-\d+[^"]*?)\/?"/gi;
    let lm;
    while ((lm = linkRe.exec(html)) !== null) {
      const slug = lm[1].replace(/\/$/, "");
      if (seen.has(slug)) continue;
      seen.add(slug);

      // Try to get nearby title
      const contextStart = Math.max(0, lm.index - 500);
      const contextEnd = Math.min(html.length, lm.index + 500);
      const context = html.substring(contextStart, contextEnd);

      const titleM = context.match(/title="([^"]+)"/) || context.match(/alt="([^"]+)"/) || context.match(/>([^<]*Episode[^<]*)</i);
      let title = titleM ? titleM[1].trim() : slug.replace(/-/g, " ");
      title = title.replace(/English Subtitles?/i, "").replace(/Sub (Esp|Indo|Thai)/i, "").trim();

      const imgM = context.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i) || context.match(/data-src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
      const poster = imgM ? imgM[1] : "";

      const epM = title.match(/Episode\s+(\d+)/i) || title.match(/EP\s*(\d+)/i);
      const episode = epM ? parseInt(epM[1]) : 0;

      items.push({ slug, title, poster, episode, status: "ongoing" });
    }
  }

  return items;
}
