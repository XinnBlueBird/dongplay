import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  try {
    const { id, episodeId } = await params;
    const res = await fetch(
      `https://donghuafast.site/donghua/${id}/${episodeId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );
    const html = await res.text();

    const workerMatch = html.match(
      /get\.timorles23\.workers\.dev\/v\/([a-zA-Z0-9]+)/
    );

    if (workerMatch) {
      return NextResponse.json({
        videoUrl: `https://get.timorles23.workers.dev/v/${workerMatch[1]}`,
      });
    }

    return NextResponse.json(
      { error: "Video URL not found" },
      { status: 404 }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to fetch episode";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
