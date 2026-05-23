"use client";

import { useEffect, useState } from "react";
import { BookmarkX } from "lucide-react";
import PosterCard from "@/components/PosterCard";

interface DonghuaItem {
  id: string;
  title: string;
  poster: string;
  latestEpisode: number;
  rating: number | null;
  status: string;
  views: number;
  year: number;
}

export default function BookmarksPage() {
  const [data, setData] = useState<DonghuaItem[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("dongplay_bookmarks") || "[]"
      ) as string[];
      setBookmarkIds(saved);

      if (saved.length === 0) {
        setLoading(false);
        return;
      }

      fetch("/api/donghua")
        .then((r) => r.json())
        .then((json) => {
          if (json.data) {
            const filtered = json.data.filter((d: DonghuaItem) =>
              saved.includes(d.id)
            );
            setData(filtered);
          } else if (json.error) {
            setError(json.error);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#e2e8f0] mb-6">Bookmarks</h1>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="min-w-0">
              <div className="aspect-[2/3] rounded-lg bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
              <div className="mt-2 h-4 bg-[#12121a] rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-[#94a3b8]">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bookmarkIds.length === 0 && (
        <div className="text-center py-20">
          <BookmarkX className="w-16 h-16 text-[#1e1e2e] mx-auto mb-4" />
          <p className="text-[#94a3b8] mb-2">No bookmarks yet</p>
          <p className="text-sm text-[#64748b]">
            Browse donghua and click the bookmark button to save your favorites.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && bookmarkIds.length > 0 && (
        <>
          <p className="text-sm text-[#64748b] mb-4">
            {data.length} bookmarked title{data.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.map((item) => (
              <PosterCard
                key={item.id}
                id={item.id}
                title={item.title}
                poster={item.poster}
                latestEpisode={item.latestEpisode}
                rating={item.rating}
                status={item.status}
              />
            ))}
          </div>
          {data.length === 0 && (
            <p className="text-[#64748b] text-center py-16">
              Bookmarked titles could not be loaded. They may have been removed.
            </p>
          )}
        </>
      )}
    </div>
  );
}
