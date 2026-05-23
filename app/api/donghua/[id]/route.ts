import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`https://donghuafast.site/donghua/${id}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const html = await res.text();

    // Title from <h1>
    const titleM = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const title = titleM ? titleM[1].trim() : "";

    // Poster: first img with alt matching title or nearby
    const imgRe = /<img[^>]*alt="([^"]*)"[^>]*src="([^"]+)"/g;
    let poster = "";
    let imgM;
    while ((imgM = imgRe.exec(html)) !== null) {
      if (imgM[1] && imgM[2] && !imgM[2].includes("logo")) {
        poster = imgM[2];
        break;
      }
    }

    // Rating
    const ratingM = html.match(/(\d+\.?\d*)\s*<\/div>[\s\S]{0,100}star/i);
    const rating = ratingM ? parseFloat(ratingM[1]) : null;

    // Views
    const viewsM = html.match(/(\d[\d,]*)\s*VIEWS/i);
    const views = viewsM ? viewsM[1].replace(/,/g, "") : "0";

    // Status
    const statusM = html.match(/(ONGOING|COMPLETED|UPCOMING)/i);
    const status = (statusM?.[1]?.toLowerCase() || "ongoing");

    // Year
    const yearM = html.match(/\b(20\d{2})\b/);
    const year = yearM ? parseInt(yearM[1]) : 2025;

    // Synopsis: longest <p> text
    const pRe = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let synopsis = "";
    let pM;
    while ((pM = pRe.exec(html)) !== null) {
      const text = pM[1].replace(/<[^>]*>/g, "").trim();
      if (text.length > synopsis.length) synopsis = text;
    }

    // Episodes: links matching /donghua/{id}/{ep_uuid}
    const epRe = new RegExp(`href="/donghua/${id}/([a-f0-9-]{36})"[^>]*>\\s*(\\d+)`, "g");
    const episodes: { number: number; episodeUuid: string }[] = [];
    let epM;
    while ((epM = epRe.exec(html)) !== null) {
      episodes.push({ episodeUuid: epM[1], number: parseInt(epM[2]) });
    }
    // Sort by episode number
    episodes.sort((a, b) => a.number - b.number);

    // Get video URL for first episode
    let videoUrl = "";
    if (episodes.length > 0) {
      try {
        const vRes = await fetch(
          `https://donghuafast.site/donghua/${id}/${episodes[0].episodeUuid}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Accept: "text/html",
            },
          }
        );
        const vHtml = await vRes.text();
        const vM = vHtml.match(/get\.timorles23\.workers\.dev\/v\/([a-zA-Z0-9]+)/);
        if (vM) videoUrl = `https://get.timorles23.workers.dev/v/${vM[1]}`;
      } catch {
        // ignore
      }
    }

    return NextResponse.json({
      id,
      title,
      poster,
      synopsis,
      rating,
      views,
      status,
      year,
      episodes,
      videoUrl,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
