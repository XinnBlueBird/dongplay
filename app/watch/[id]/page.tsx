"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Home, Eye, Star, Calendar, ArrowUpDown } from "lucide-react";

interface Episode {
  number: number;
  episodeUuid: string;
}

interface DonghuaDetail {
  id: string;
  title: string;
  poster: string;
  synopsis: string;
  rating: number | null;
  views: string;
  status: string;
  year: number;
  episodes: Episode[];
  videoUrl: string;
}

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const [detail, setDetail] = useState<DonghuaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEp, setCurrentEp] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [sortOld, setSortOld] = useState(true);

  useEffect(() => {
    fetch(`/api/donghua/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return;
        setDetail(d);
        setVideoUrl(d.videoUrl);
        setCurrentEp(d.episodes?.[0]?.number || 1);
        // Save to history
        const history = JSON.parse(localStorage.getItem("dongplay-history") || "[]");
        const filtered = history.filter((h: {id: string}) => h.id !== id);
        filtered.unshift({ id, title: d.title, poster: d.poster, episode: d.episodes?.[0]?.number || 1, timestamp: Date.now() });
        localStorage.setItem("dongplay-history", JSON.stringify(filtered.slice(0, 50)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Check bookmark
    const bm = JSON.parse(localStorage.getItem("dongplay-bookmarks") || "[]");
    setBookmarked(bm.includes(id));
  }, [id]);

  const switchEp = async (epNum: number, epUuid: string) => {
    setCurrentEp(epNum);
    try {
      const res = await fetch(`/api/donghua/${id}/${epUuid}`);
      const data = await res.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        // Update history
        const history = JSON.parse(localStorage.getItem("dongplay-history") || "[]");
        const idx = history.findIndex((h: {id: string}) => h.id === id);
        if (idx >= 0) {
          history[idx].episode = epNum;
          history[idx].timestamp = Date.now();
        }
        localStorage.setItem("dongplay-history", JSON.stringify(history));
      }
    } catch {}
  };

  const toggleBookmark = () => {
    const bm = JSON.parse(localStorage.getItem("dongplay-bookmarks") || "[]");
    if (bm.includes(id)) {
      setBookmarked(false);
      localStorage.setItem("dongplay-bookmarks", JSON.stringify(bm.filter((b: string) => b !== id)));
    } else {
      bm.push(id);
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

  if (!detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-white mb-2">Tidak Ditemukan</h1>
        <p className="text-[#94a3b8]">Donghua ini tidak bisa ditemukan.</p>
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
        <span className="text-[#94a3b8] truncate max-w-[200px]">{detail.title}</span>
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
              <div className="absolute inset-0 flex items-center justify-center text-[#64748b]">Video tidak tersedia</div>
            )}
          </div>

          {/* Episode Nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                const idx = detail.episodes.findIndex((e) => e.number === currentEp);
                if (idx > 0) switchEp(detail.episodes[idx - 1].number, detail.episodes[idx - 1].episodeUuid);
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
                if (idx < detail.episodes.length - 1) switchEp(detail.episodes[idx + 1].number, detail.episodes[idx + 1].episodeUuid);
              }}
              disabled={currentEp >= detail.episodes[detail.episodes.length - 1]?.number}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-sm text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Info */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase italic">{detail.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#94a3b8]">
                {detail.views && <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {detail.views}</span>}
                {detail.rating && <span className="flex items-center gap-1 text-[#fbbf24]"><Star className="w-4 h-4 fill-[#fbbf24]" /> {detail.rating}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {detail.year}</span>
                <span className={`px-2 py-0.5 text-xs rounded font-bold uppercase ${detail.status === "completed" ? "bg-[#6366f1]/20 text-[#818cf8]" : "bg-[#22c55e]/20 text-[#22c55e]"}`}>
                  {detail.status}
                </span>
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
              <h3 className="text-sm font-bold text-white uppercase italic mb-2">Sinopsis</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{detail.synopsis}</p>
            </div>
          )}
        </div>

        {/* Episode List Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase italic">Daftar Episode ({detail.episodes.length})</h3>
              <button onClick={() => setSortOld(!sortOld)} className="p-1 text-[#64748b] hover:text-white transition-colors">
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1">
              {eps.map((ep) => (
                <button
                  key={ep.episodeUuid}
                  onClick={() => switchEp(ep.number, ep.episodeUuid)}
                  className={`aspect-square rounded-lg text-xs font-bold transition-all ${currentEp === ep.number ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30" : "bg-[#0a0a0f] border border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white"}`}
                >
                  {ep.number}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
