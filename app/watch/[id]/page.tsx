"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";

interface Episode {
  number: number;
  episodeUuid: string;
}

interface DetailData {
  id: string;
  title: string;
  poster: string;
  rating: number | null;
  views: number;
  status: string;
  year: number;
  synopsis: string;
  episodes: Episode[];
  videoWorkerUrl: string | null;
}

export default function WatchPage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentEp, setCurrentEp] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dongplay_bookmarks") || "[]") as string[];
      setBookmarked(saved.includes(id));
    } catch {
      setBookmarked(false);
    }
  }, [id]);

  const toggleBookmark = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dongplay_bookmarks") || "[]") as string[];
      let updated: string[];
      if (saved.includes(id)) {
        updated = saved.filter((s: string) => s !== id);
        setBookmarked(false);
      } else {
        updated = [...saved, id];
        setBookmarked(true);
      }
      localStorage.setItem("dongplay_bookmarks", JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [id]);

  // Fetch detail
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/donghua/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
          if (json.videoWorkerUrl) {
            setVideoUrl(json.videoWorkerUrl);
          } else if (json.episodes?.length > 0) {
            loadEpisodeVideo(id, json.episodes[0].episodeUuid);
          }
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function loadEpisodeVideo(donghuaId: string, episodeId: string) {
    setVideoLoading(true);
    fetch(`/api/donghua/${donghuaId}/${episodeId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.videoUrl) {
          setVideoUrl(json.videoUrl);
        }
      })
      .catch(() => {})
      .finally(() => setVideoLoading(false));
  }

  function selectEpisode(index: number) {
    if (!data || index < 0 || index >= data.episodes.length) return;
    setCurrentEp(index);
    setVideoUrl(null);
    loadEpisodeVideo(id, data.episodes[index].episodeUuid);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="aspect-video rounded-xl bg-[#12121a] border border-[#1e1e2e] animate-pulse mb-6" />
        <div className="h-6 bg-[#12121a] rounded w-1/3 animate-pulse mb-4" />
        <div className="h-4 bg-[#12121a] rounded w-2/3 animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-[#94a3b8] mb-4">Failed to load donghua</p>
        <p className="text-sm text-[#64748b]">{error}</p>
        <Link
          href="/"
          className="inline-block mt-6 px-4 py-2 text-sm bg-[#6366f1] text-white rounded-lg"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Video player */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#1e1e2e] mb-4">
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
              </div>
            )}
            {videoUrl ? (
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : !videoLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#64748b]">Select an episode to start watching</p>
              </div>
            ) : null}
          </div>

          {/* Prev / Next buttons */}
          {data.episodes.length > 1 && (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => selectEpisode(currentEp - 1)}
                disabled={currentEp <= 0}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-[#12121a] border border-[#1e1e2e] rounded-lg text-[#94a3b8] hover:text-[#e2e8f0] hover:border-[#6366f1]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <span className="text-sm text-[#94a3b8]">
                Episode {data.episodes[currentEp]?.number} of{" "}
                {data.episodes.length}
              </span>
              <button
                onClick={() => selectEpisode(currentEp + 1)}
                disabled={currentEp >= data.episodes.length - 1}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-[#12121a] border border-[#1e1e2e] rounded-lg text-[#94a3b8] hover:text-[#e2e8f0] hover:border-[#6366f1]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title + meta */}
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#e2e8f0] mb-2">
              {data.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {data.rating != null && (
                <span className="flex items-center gap-1 text-sm text-[#fbbf24]">
                  <Star className="w-4 h-4 fill-[#fbbf24]" />
                  {data.rating}
                </span>
              )}
              <span className="flex items-center gap-1 text-sm text-[#94a3b8]">
                <Eye className="w-4 h-4" />
                {data.views.toLocaleString()} views
              </span>
              <span
                className={`px-2 py-0.5 text-xs rounded ${
                  data.status === "completed"
                    ? "bg-[#6366f1]/20 text-[#6366f1]"
                    : "bg-[#22c55e]/20 text-[#22c55e]"
                }`}
              >
                {data.status}
              </span>
              <span className="text-xs text-[#64748b]">{data.year}</span>
            </div>
          </div>

          {/* Bookmark button */}
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors mb-6 ${
              bookmarked
                ? "bg-[#6366f1]/10 border-[#6366f1]/30 text-[#6366f1]"
                : "bg-[#12121a] border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/30"
            }`}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </button>

          {/* Synopsis */}
          {data.synopsis && (
            <div className="p-4 rounded-lg bg-[#12121a] border border-[#1e1e2e]">
              <h2 className="text-sm font-semibold text-[#94a3b8] mb-2 uppercase tracking-wider">
                Synopsis
              </h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                {data.synopsis}
              </p>
            </div>
          )}
        </div>

        {/* Episode list sidebar */}
        {data.episodes.length > 0 && (
          <aside className="w-full lg:w-64 shrink-0">
            <h2 className="text-sm font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">
              Episodes ({data.episodes.length})
            </h2>
            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {data.episodes.map((ep, idx) => (
                <button
                  key={ep.episodeUuid}
                  onClick={() => selectEpisode(idx)}
                  className={`px-2 py-2 text-sm rounded-lg border transition-colors ${
                    idx === currentEp
                      ? "bg-[#6366f1] border-[#6366f1] text-white"
                      : "bg-[#12121a] border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/30 hover:text-[#e2e8f0]"
                  }`}
                >
                  {ep.number}
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
