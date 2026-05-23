import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SeriesItem {
  slug: string;
  title: string;
  poster: string;
  episode: number;
  status: string;
}

export async function GET() {
  try {
    const items: SeriesItem[] = [];
    const seen = new Set<string>();

    // Fetch first few pages to get a decent list
    const pagesToFetch = [1, 2, 3];
    const fetches = pagesToFetch.map((p) =>
      fetch(p === 1 ? "https://mydonghua.com/" : `https://mydonghua.com/page/${p}/`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      }).then((r) => r.text()).catch(() => "")
    );

    const pages = await Promise.all(fetches);

    for (const html of pages) {
      if (!html) continue;

      // Parse article elements
      const articleRe = /<article[^>]*>([\s\S]*?)<\/article>/gi;
      let m;
      while ((m = articleRe.exec(html)) !== null) {
        const block = m[1];
        const hrefM = block.match(/href="\/([^"]+\/)"/);
        if (!hrefM) continue;
        const slug = hrefM[1].replace(/\/$/, "");
        if (seen.has(slug)) continue;
        seen.add(slug);

        const titleM = block.match(/title="([^"]+)"/) || block.match(/alt="([^"]+)"/) || block.match(/>([^<]+)</);
        let title = titleM ? titleM[1].trim() : "";
        if (!title) continue;
        title = title.replace(/English Subtitles?/i, "").trim();

        const imgM = block.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i) || block.match(/data-src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
        const poster = imgM ? imgM[1] : "";

        const epM = block.match(/Episode\s+(\d+)/i) || title.match(/Episode\s+(\d+)/i);
        const episode = epM ? parseInt(epM[1]) : 0;

        const statusM = block.match(/(ongoing|completed)/i);
        const status = statusM ? statusM[1].toLowerCase() : "ongoing";

        items.push({ slug, title, poster, episode, status });
      }

      // Also extract links directly
      if (items.length < 10) {
        const linkRe = /href="\/([\w-]+-episode-\d+[^"]*?)\/?"/gi;
        let lm;
        while ((lm = linkRe.exec(html)) !== null) {
          const slug = lm[1].replace(/\/$/, "");
          if (seen.has(slug)) continue;
          seen.add(slug);

          const contextStart = Math.max(0, lm.index - 300);
          const contextEnd = Math.min(html.length, lm.index + 300);
          const context = html.substring(contextStart, contextEnd);

          const titleM = context.match(/title="([^"]+)"/) || context.match(/alt="([^"]+)"/);
          let title = titleM ? titleM[1].trim() : slug.replace(/-/g, " ");
          title = title.replace(/English Subtitles?/i, "").trim();

          const imgM = context.match(/src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
          const poster = imgM ? imgM[1] : "";

          const epM = title.match(/Episode\s+(\d+)/i);
          const episode = epM ? parseInt(epM[1]) : 0;

          items.push({ slug, title, poster, episode, status: "ongoing" });
        }
      }
    }

    return NextResponse.json({ data: items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
