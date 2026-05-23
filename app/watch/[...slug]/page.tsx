"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Home, Star, ArrowUpDown } from "lucide-react";

interface Episode {
  number: number;
  slug: string;
}

interface VideoSource {
  url: string;
  source: string;
}

interface EpisodeDetail {
  title: string;
  videoUrl: string;
  videoUrls: VideoSource[];
  poster: string;
  episodeNumber: number;
  episodes: Episode[];
  synopsis: string;
  genres: string[];
  status: string;
  seriesSlug: string;
}

export default function WatchPage() {
  const params = useParams();
  const slugParts = params.slug as string[];
  const slug = slugParts.join("/");
  const [detail, setDetail] = useState<EpisodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEp, setCurrentEp] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [activeSource, setActiveSource] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [sortOld, setSortOld] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/donghua/episode/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
          return;
        }
        setDetail(d);
        setVideoUrl(d.videoUrl);
        setActiveSource(0);
        setCurrentEp(d.episodeNumber || 0);

        // Save to history
        try {
          const history = JSON.parse(localStorage.getItem("dongplay-history") || "[]");
          const filtered = history.filter((h: { slug: string }) => h.slug !== slug);
          filtered.unshift({
            slug,
            title: d.title,
            poster: d.poster,
            episode: d.episodeNumber || 0,
            timestamp: Date.now(),
          });
          localStorage.setItem("dongplay-history", JSON.stringify(filtered.slice(0, 50)));
        } catch {}
      })
      .catch(() => setError("Failed to load episode"))
      .finally(() => setLoading(false));

    // Check bookmark
    try {
      const bm = JSON.parse(localStorage.getItem("dongplay-bookmarks") || "[]");
      setBookmarked(bm.some((b: string) => slug.startsWith(b) || b.startsWith(slug.split("-episode-")[0])));
    } catch {}
  }, [slug]);

  const switchSource = (idx: number) => {
    if (detail?.videoUrls?.[idx]) {
      setVideoUrl(detail.videoUrls[idx].url);
      setActiveSource(idx);
    }
  };

  const toggleBookmark = () => {
    const seriesSlug = detail?.seriesSlug || slug.split("-episode-")[0];
    const bm = JSON.parse(localStorage.getItem("dongplay-bookmarks") || "[]");
    if (bm.includes(seriesSlug)) {
      setBookmarked(false);
      localStorage.setItem("dongplay-bookmarks", JSON.stringify(bm.filter((b: string) => b !== seriesSlug)));
    } else {
      bm.push(seriesSlug);
      setBookmarked(true);
      localStorage.setItem("dongplay-bookmarks", JSON.stringify(bm));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="aspect-video rounded-xl bg-[#12121a] border border-[#1e1e2e] animate-pulse mb-6" />
        <div className="h-8 w-64 bg-[#12121a] rounded animate-pulse mb-4" />
        <div className="h-4 w-96 bg-[#12121a] rounded animate-pulse" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-white mb-2">Not Found</h1>
        <p className="text-[#94a3b8] mb-4">{error || "This episode could not be found."}</p>
        <Link href="/" className="text-[#6366f1] hover:underline text-sm">Back to Home</Link>
      </div>
    );
  }

  const eps = sortOld ? [...detail.episodes].sort((a, b) => a.number - b.number) : [...detail.episodes].sort((a, b) => b.number - a.number);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#64748b] mb-4">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><Home className="w-3 h-3" /> Home</Link>
        <span>/</span>
        <span className="text-[#94a3b8] truncate max-w-[300px]">{detail.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#1e1e2e] mb-4">
            {videoUrl ? (
              <iframe
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${detail.title} EP ${currentEp}`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#64748b]">Video not available</div>
            )}
          </div>

          {/* Server selector */}
          {detail.videoUrls && detail.videoUrls.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-[#64748b] font-bold uppercase">Server:</span>
              {detail.videoUrls.map((v, i) => (
                <button
                  key={i}
                  onClick={() => switchSource(i)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${activeSource === i ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50"}`}
                >
                  {v.source}
                </button>
              ))}
            </div>
          )}

          {/* Episode Nav */}
          {detail.episodes.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  const idx = detail.episodes.findIndex((e) => e.number === currentEp);
                  if (idx > 0) {
                    window.location.href = `/watch/${detail.episodes[idx - 1].slug}`;
                  }
                }}
                disabled={currentEp <= detail.episodes[0]?.number}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-sm text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-sm text-[#94a3b8] font-medium">Episode {currentEp}</span>
              <button
                onClick={() => {
                  const idx = detail.episodes.findIndex((e) => e.number === currentEp);
                  if (idx < detail.episodes.length - 1) {
                    window.location.href = `/watch/${detail.episodes[idx + 1].slug}`;
                  }
                }}
                disabled={currentEp >= detail.episodes[detail.episodes.length - 1]?.number}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-sm text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title & Info */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase italic">{detail.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#94a3b8]">
                <span className={`px-2 py-0.5 text-xs rounded font-bold uppercase ${detail.status === "completed" ? "bg-[#6366f1]/20 text-[#818cf8]" : "bg-[#22c55e]/20 text-[#22c55e]"}`}>
                  {detail.status}
                </span>
                {detail.genres.map((g) => (
                  <span key={g} className="px-2 py-0.5 text-xs bg-[#12121a] border border-[#1e1e2e] rounded text-[#94a3b8]">{g}</span>
                ))}
              </div>
            </div>
            <button onClick={toggleBookmark} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all shrink-0 ${bookmarked ? "bg-[#6366f1]/20 border-[#6366f1] text-[#818cf8]" : "bg-[#12121a] border-[#1e1e2e] text-[#94a3b8] hover:text-white hover:border-[#6366f1]"}`}>
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span className="text-xs font-bold hidden sm:inline">{bookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          </div>

          {/* Synopsis */}
          {detail.synopsis && (
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white uppercase italic mb-2">Synopsis</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{detail.synopsis}</p>
            </div>
          )}
        </div>

        {/* Episode List Sidebar */}
        {detail.episodes.length > 0 && (
          <aside className="lg:w-72 shrink-0">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white uppercase italic">Episodes ({detail.episodes.length})</h3>
                <button onClick={() => setSortOld(!sortOld)} className="p-1 text-[#64748b] hover:text-white transition-colors">
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1">
                {eps.map((ep) => (
                  <Link
                    key={ep.slug}
                    href={`/watch/${ep.slug}`}
                    className={`aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center ${currentEp === ep.number ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30" : "bg-[#0a0a0f] border border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white"}`}
                  >
                    {ep.number}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
