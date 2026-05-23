import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    // slug is ["way-of-choices.html", "19"] → reconstruct URL
    const url = `https://mydonghua.com/watch/${slug.join("/")}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const html = await res.text();

    // Title from <h1>
    const h1M = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const titleTagM = html.match(/<title>([^<]+)<\/title>/i);
    const title = h1M
      ? h1M[1].trim()
      : titleTagM
        ? titleTagM[1].replace(/\s*[|\-–].*$/, "").trim()
        : "";

    // Extract video iframe URLs
    const videoUrls: { url: string; source: string }[] = [];

    // Match all iframes with src
    const iframeRe = /<iframe[^>]*src="([^"]+)"[^>]*>/gi;
    let iframeM;
    while ((iframeM = iframeRe.exec(html)) !== null) {
      const src = iframeM[1];
      if (
        src.includes("dailymotion.com") ||
        src.includes("ok.ru/videoembed") ||
        src.includes("youtube.com/embed")
      ) {
        const source = src.includes("dailymotion")
          ? "Dailymotion"
          : src.includes("ok.ru")
            ? "Okru"
            : "YouTube";
        if (!videoUrls.find((v) => v.url === src)) {
          videoUrls.push({ url: src, source });
        }
      }
    }

    const videoUrl = videoUrls.length > 0 ? videoUrls[0].url : "";

    // Poster from og:image
    const ogImageM = html.match(
      /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i
    );
    const poster = ogImageM ? ogImageM[1] : "";

    // Episode number from URL
    const epFromUrl = slug.length > 1 ? parseInt(slug[slug.length - 1]) : 0;
    const epFromTitle = title.match(/Episode\s+(\d+)/i);
    const episodeNumber = epFromUrl || (epFromTitle ? parseInt(epFromTitle[1]) : 0);

    // Episode links: href="https://mydonghua.com/watch/{series}.html/{number}"
    const episodes: { number: number; slug: string }[] = [];
    const epLinkRe = /href="https:\/\/mydonghua\.com\/watch\/([^"]+\.html)\/(\d+)(?:\/?(?:#|")|")/g;
    let epM;
    const seenEps = new Set<string>();
    while ((epM = epLinkRe.exec(html)) !== null) {
      const seriesPart = epM[1];
      const epNum = parseInt(epM[2]);
      const epSlug = `watch/${seriesPart}/${epNum}`;
      if (seenEps.has(epSlug)) continue;
      seenEps.add(epSlug);
      episodes.push({ number: epNum, slug: epSlug });
    }
    episodes.sort((a, b) => a.number - b.number);

    // Series slug from episode links
    let seriesSlug = "";
    if (slug.length >= 1) {
      // "way-of-choices.html" → "way-of-choices"
      seriesSlug = slug[0].replace(/\.html$/, "");
    }

    // Synopsis: longest paragraph
    let synopsis = "";
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let pM;
    while ((pM = pRe.exec(html)) !== null) {
      const text = pM[1].replace(/<[^>]*>/g, "").trim();
      if (
        text.length > synopsis.length &&
        text.length > 30 &&
        !text.includes("{") &&
        !text.includes("function") &&
        !text.includes("cookie")
      ) {
        synopsis = text;
      }
    }

    // Genres from links
    const genres: string[] = [];
    const tagRe = /href="[^"]*genre[^"]*"[^>]*>([^<]+)</gi;
    let gM;
    while ((gM = tagRe.exec(html)) !== null) {
      const genre = gM[1].trim();
      if (genre && genre.length < 30 && !genres.includes(genre)) {
        genres.push(genre);
      }
    }

    // Status
    const statusM = html.match(/(Ongoing|Completed|Upcoming)/i);
    const status = statusM ? statusM[1].toLowerCase() : "ongoing";

    return NextResponse.json({
      title,
      videoUrl,
      videoUrls,
      poster,
      episodeNumber,
      episodes,
      synopsis: synopsis.substring(0, 1000),
      genres,
      status,
      seriesSlug,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
