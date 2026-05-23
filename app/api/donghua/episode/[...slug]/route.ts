import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const episodeSlug = slug.join("/");
    const url = `https://mydonghua.com/${episodeSlug}/`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const html = await res.text();

    // Title from <h1> or <title>
    const h1M = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const titleTagM = html.match(/<title>([^<]+)<\/title>/i);
    let title = h1M ? h1M[1].trim() : (titleTagM ? titleTagM[1].replace(/\s*[|\-–].*$/, "").trim() : "");

    // Extract video iframe URLs - Dailymotion and Okru
    const videoUrls: { url: string; source: string }[] = [];

    // Match all iframes
    const iframeRe = /<iframe[^>]*src="([^"]+)"[^>]*>/gi;
    let iframeM;
    while ((iframeM = iframeRe.exec(html)) !== null) {
      const src = iframeM[1];
      if (src.includes("dailymotion.com/embed")) {
        videoUrls.push({ url: src, source: "Dailymotion" });
      } else if (src.includes("ok.ru/videoembed")) {
        videoUrls.push({ url: src, source: "Okru" });
      } else if (src.includes("youtube.com/embed")) {
        videoUrls.push({ url: src, source: "YouTube" });
      }
    }

    // Also check for srcset or data-src patterns
    const dataSrcRe = /data-src="([^"]*(?:dailymotion|ok\.ru)[^"]*)"/gi;
    while ((iframeM = dataSrcRe.exec(html)) !== null) {
      const src = iframeM[1];
      if (src.includes("dailymotion.com/embed") && !videoUrls.find((v) => v.url === src)) {
        videoUrls.push({ url: src, source: "Dailymotion" });
      } else if (src.includes("ok.ru/videoembed") && !videoUrls.find((v) => v.url === src)) {
        videoUrls.push({ url: src, source: "Okru" });
      }
    }

    // Also check for raw embed URLs in the page
    const embedRe = /(https?:\/\/(?:www\.)?dailymotion\.com\/embed\/video\/[a-zA-Z0-9]+)/g;
    while ((iframeM = embedRe.exec(html)) !== null) {
      if (!videoUrls.find((v) => v.url === iframeM![1])) {
        videoUrls.push({ url: iframeM[1], source: "Dailymotion" });
      }
    }

    const okruRe = /(https?:\/\/ok\.ru\/videoembed\/\d+)/g;
    while ((iframeM = okruRe.exec(html)) !== null) {
      if (!videoUrls.find((v) => v.url === iframeM![1])) {
        videoUrls.push({ url: iframeM[1], source: "Okru" });
      }
    }

    const videoUrl = videoUrls.length > 0 ? videoUrls[0].url : "";

    // Extract poster image
    const ogImageM = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
    const poster = ogImageM ? ogImageM[1] : "";

    // Extract episode number from title
    const epNumM = title.match(/Episode\s+(\d+)/i) || title.match(/EP\s*(\d+)/i);
    const episodeNumber = epNumM ? parseInt(epNumM[1]) : 0;

    // Extract all episode links from the page
    const episodes: { number: number; slug: string }[] = [];
    const epLinkRe = /href="\/([\w-]+-episode-(\d+)[^"]*?)\/?"/gi;
    let epM;
    const seenEps = new Set<string>();
    while ((epM = epLinkRe.exec(html)) !== null) {
      const epSlug = epM[1].replace(/\/$/, "");
      const epNum = parseInt(epM[2]);
      if (seenEps.has(epSlug)) continue;
      seenEps.add(epSlug);
      episodes.push({ number: epNum, slug: epSlug });
    }
    episodes.sort((a, b) => a.number - b.number);

    // Extract synopsis
    const synopsisRe = /<(?:div|p|span)[^>]*class="[^"]*(?:synopsis|description|entry-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p|span)>/gi;
    let synopsis = "";
    let synM;
    while ((synM = synopsisRe.exec(html)) !== null) {
      const text = synM[1].replace(/<[^>]*>/g, "").trim();
      if (text.length > synopsis.length && text.length > 20) synopsis = text;
    }

    // Fallback: longest paragraph
    if (!synopsis) {
      const pRe = /<p[^>]*>([\s\S]*?)<\/p>/g;
      let pM;
      while ((pM = pRe.exec(html)) !== null) {
        const text = pM[1].replace(/<[^>]*>/g, "").trim();
        if (text.length > synopsis.length && text.length > 30 && !text.includes("{") && !text.includes("function")) {
          synopsis = text;
        }
      }
    }

    // Extract genres
    const genres: string[] = [];
    const genreRe = /genre[s]?[^<]*<[^>]*>([^<]+)</gi;
    let gM;
    while ((gM = genreRe.exec(html)) !== null) {
      const genre = gM[1].trim();
      if (genre && genre.length < 30 && !genre.includes("Genre")) {
        genres.push(genre);
      }
    }
    // Also check for tag/category links
    const tagRe = /href="[^"]*genre[^"]*"[^>]*>([^<]+)</gi;
    while ((gM = tagRe.exec(html)) !== null) {
      const genre = gM[1].trim();
      if (genre && genre.length < 30 && !genres.includes(genre)) {
        genres.push(genre);
      }
    }

    // Status
    const statusM = html.match(/(Ongoing|Completed|Upcoming)/i);
    const status = statusM ? statusM[1].toLowerCase() : "ongoing";

    // Series slug from breadcrumb or episode pattern
    let seriesSlug = "";
    const breadcrumbM = html.match(/href="\/([\w-]+-episode-\d+[^"]*?)"/i);
    if (breadcrumbM) {
      seriesSlug = breadcrumbM[1].replace(/episode-\d+.*/, "").replace(/-$/, "");
    }
    // Better: derive from current slug
    if (!seriesSlug && episodeSlug) {
      seriesSlug = episodeSlug.replace(/-episode-\d+.*/, "");
    }

    return NextResponse.json({
      title,
      videoUrl,
      videoUrls,
      poster,
      episodeNumber,
      episodes,
      synopsis,
      genres,
      status,
      seriesSlug,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
