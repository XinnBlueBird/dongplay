import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  try {
    const { id, episodeId } = await params;
    const res = await fetch(
      `https://donghuafast.site/donghua/${id}/${episodeId}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html",
        },
      }
    );
    const html = await res.text();

    // Extract video worker URL from iframe
    const vM = html.match(/get\.timorles23\.workers\.dev\/v\/([a-zA-Z0-9]+)/);
    if (vM) {
      return NextResponse.json({
        videoUrl: `https://get.timorles23.workers.dev/v/${vM[1]}`,
      });
    }

    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
