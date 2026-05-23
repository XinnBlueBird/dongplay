import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`https://donghuafast.site/donghua/${id}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    const html = await res.text();

    const detail = parseDetailPage(html, id);

    // For the first episode, fetch its page to get the video worker URL
    if (detail.episodes.length > 0) {
      const firstEp = detail.episodes[0];
      try {
        const epRes = await fetch(
          `https://donghuafast.site/donghua/${id}/${firstEp.episodeUuid}`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          }
        );
        const epHtml = await epRes.text();
        const workerMatch = epHtml.match(
          /get\.timorles23\.workers\.dev\/v\/([a-zA-Z0-9]+)/
        );
        if (workerMatch) {
          detail.videoWorkerUrl = `https://get.timorles23.workers.dev/v/${workerMatch[1]}`;
        }
      } catch {
        // ignore episode fetch failure
      }
    }

    return NextResponse.json(detail);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch detail";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function parseDetailPage(html: string, id: string) {
  // Title
  const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const title = titleMatch ? titleMatch[1].trim() : id;

  // Poster
  const imgMatch = html.match(/\/api\/img\/\?u=([^&"]+)/);
  const poster = imgMatch ? decodeURIComponent(imgMatch[1]) : "";

  // Rating
  const ratingMatch = html.match(/(\d+\.?\d*)\s*(?:SERIES|Rating)/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  // Views
  const viewsMatch = html.match(/(\d+)\s*VIEWS/i);
  const views = viewsMatch ? parseInt(viewsMatch[1]) : 0;

  // Status
  const statusMatch = html.match(/(ONGOING|COMPLETED)/i);
  const status = (statusMatch?.[1]?.toLowerCase() || "ongoing") as
    | "ongoing"
    | "completed"
    | "upcoming";

  // Year
  const yearMatch = html.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1]) : 2025;

  // Synopsis — try to find a description/paragraph near the detail section
  let synopsis = "";
  const synopsisMatch = html.match(
    /(?:synopsis|description|story)[^>]*>([^<]{20,})</i
  );
  if (synopsisMatch) {
    synopsis = synopsisMatch[1].trim();
  }
  // Fallback: look for longer text content in p tags
  if (!synopsis) {
    const pMatches = html.match(/<p[^>]*>([^<]{40,})<\/p>/g);
    if (pMatches && pMatches.length > 0) {
      const longest = pMatches
        .map((m) => m.replace(/<\/?p[^>]*>/g, "").trim())
        .sort((a, b) => b.length - a.length)[0];
      synopsis = longest;
    }
  }

  // Episodes — look for links like /donghua/{id}/{episodeUuid}
  const episodes: { number: number; episodeUuid: string }[] = [];
  const epUuidSet = new Set<string>();
  const epRegex = new RegExp(
    `href="\\/donghua\\/${id}\\/([a-f0-9-]{36})"[^>]*>`,
    "g"
  );
  let match;
  let epNum = 1;
  while ((match = epRegex.exec(html)) !== null) {
    const epUuid = match[1];
    if (!epUuidSet.has(epUuid)) {
      epUuidSet.add(epUuid);
      // Try to extract episode number from nearby text
      const ctx = html.substring(match.index, match.index + 200);
      const numMatch = ctx.match(/(?:EP|Episode)\s*(\d+)/i);
      const number = numMatch ? parseInt(numMatch[1]) : epNum;
      episodes.push({ number, episodeUuid: epUuid });
      epNum++;
    }
  }

  // Sort episodes by number
  episodes.sort((a, b) => a.number - b.number);

  return {
    id,
    title,
    poster,
    rating,
    views,
    status,
    year,
    synopsis,
    episodes,
    videoWorkerUrl: null as string | null,
  };
}
