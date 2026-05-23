import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await fetch("https://donghuafast.site/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html",
      },
    });
    const html = await res.text();
    const items = parseList(html);
    return NextResponse.json({ data: items });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function parseList(html: string) {
  const items: Record<string, unknown>[] = [];
  const seen = new Set<string>();

  // Each donghua card block
  const cardRe = /href="\/donghua\/([a-f0-9-]{36})"\s+class="group relative">([\s\S]*?)<\/a>/g;
  let m;
  while ((m = cardRe.exec(html)) !== null) {
    const id = m[1];
    if (seen.has(id)) continue;
    seen.add(id);
    const block = m[2];

    const altM = block.match(/alt="([^"]+)"/);
    const title = altM ? altM[1].trim() : "";
    if (!title) continue;

    const srcM = block.match(/src="([^"]+)"/);
    const poster = srcM ? srcM[1] : "";

    const epM = block.match(/EP\s+(\d+)/i);
    const latestEpisode = epM ? parseInt(epM[1]) : 0;

    const statusM = block.match(/(Ongoing|Completed|Upcoming)/i);
    const status = (statusM?.[1]?.toLowerCase() || "ongoing");

    // Rating: look for number before </div> near star icon
    const ratingM = block.match(/(\d+\.?\d*)\s*<\/div>\s*<\/div>\s*<\/div>/);
    const rating = ratingM ? parseFloat(ratingM[1]) : null;

    items.push({ id, title, poster, latestEpisode, status, rating });
  }

  return items;
}
