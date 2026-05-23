"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import YouTubePlayer from "@/components/YouTubePlayer";
import EpisodeGrid from "@/components/EpisodeGrid";
import { allDonghua } from "@/lib/data";
import { Star, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Calendar, Film, Building2, Tag } from "lucide-react";

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;
  const donghua = allDonghua.find((d) => d.id === id);
  const [currentEp, setCurrentEp] = useState(1);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dongplay-bookmarks") || "[]";
    const bookmarks = JSON.parse(saved) as string[];
    setBookmarked(bookmarks.includes(id));
  }, [id]);

  const toggleBookmark = () => {
    const saved = localStorage.getItem("dongplay-bookmarks") || "[]";
    let bookmarks = JSON.parse(saved) as string[];
    if (bookmarks.includes(id)) {
      bookmarks = bookmarks.filter((b) => b !== id);
      setBookmarked(false);
    } else {
      bookmarks.push(id);
      setBookmarked(true);
    }
    localStorage.setItem("dongplay-bookmarks", JSON.stringify(bookmarks));
  };

  if (!donghua) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Not Found</h1>
          <p className="text-[#94a3b8]">This donghua could not be found.</p>
        </div>
      </div>
    );
  }

  const currentEpisode = donghua.episodesList.find((ep) => ep.number === currentEp);
  const videoId = currentEpisode?.youtubeVideoId || donghua.episodesList[0]?.youtubeVideoId || "";

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Player Area */}
          <div className="flex-1 min-w-0">
            {/* YouTube Player */}
            <YouTubePlayer videoId={videoId} title={`${donghua.title} - Episode ${currentEp}`} />

            {/* Episode Nav Buttons */}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setCurrentEp((p) => Math.max(1, p - 1))}
                disabled={currentEp <= 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-[#94a3b8]">
                Episode {currentEp} of {donghua.episodesList.length}
              </span>
              <button
                onClick={() => setCurrentEp((p) => Math.min(donghua.episodesList.length, p + 1))}
                disabled={currentEp >= donghua.episodesList.length}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Info */}
            <div className="mt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">{donghua.title}</h1>
                  {donghua.titleCN && <p className="text-sm text-[#64748b] mt-1">{donghua.titleCN}</p>}
                </div>
                <button
                  onClick={toggleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all shrink-0 ${bookmarked ? "bg-[#6366f1]/20 border-[#6366f1] text-[#818cf8]" : "bg-[#12121a] border-[#1e1e2e] text-[#94a3b8] hover:text-white hover:border-[#6366f1]"}`}
                >
                  {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-2 mt-3">
                {donghua.genre.map((g) => (
                  <span key={g} className="text-xs px-2.5 py-1 rounded-full border border-[#1e1e2e] text-[#94a3b8] bg-[#12121a]">{g}</span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#94a3b8]">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />{donghua.rating}</span>
                <span className="flex items-center gap-1"><Film className="w-4 h-4" />{donghua.episodes} Episodes</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{donghua.year}</span>
                <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{donghua.studio}</span>
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${donghua.status === "ongoing" ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-[#6366f1]/20 text-[#818cf8]"}`}>
                  <Tag className="w-3 h-3" />{donghua.status}
                </span>
              </div>

              {/* Synopsis */}
              <div className="mt-6 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-2">Synopsis</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{donghua.synopsis}</p>
              </div>

              {/* Source */}
              <div className="mt-4 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-2">Source</h3>
                <p className="text-sm text-[#94a3b8]">
                  Streamed from <span className="text-[#22d3ee] font-medium">{donghua.youtubeChannel}</span> official YouTube channel.
                  All content is embedded legally from verified sources.
                </p>
              </div>
            </div>
          </div>

          {/* Episode List Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 lg:sticky lg:top-20">
              <h3 className="text-sm font-bold text-white mb-3">Episodes</h3>
              <EpisodeGrid total={donghua.episodesList.length} current={currentEp} onSelect={setCurrentEp} />
              {donghua.episodesList.length < donghua.latestEpisode && (
                <p className="text-xs text-[#64748b] mt-3 text-center">
                  Showing {donghua.episodesList.length} of {donghua.latestEpisode} available episodes
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
