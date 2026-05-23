"use client";

import { useEffect, useState } from "react";
import PosterCard from "@/components/PosterCard";
import { BookmarkX } from "lucide-react";

interface DonghuaItem {
  id: string;
  title: string;
  poster: string;
  latestEpisode: number;
  rating: number | null;
  status: string;
}

export default function BookmarksPage() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [data, setData] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bm: string[] = JSON.parse(localStorage.getItem("dongplay-bookmarks") || "[]");
    setBookmarkIds(bm);

    if (bm.length > 0) {
      fetch("/api/donghua")
        .then((r) => r.json())
        .then((j) => {
          if (j.data) {
            setData(j.data.filter((d: DonghuaItem) => bm.includes(d.id)));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-white uppercase italic mb-1">Bookmark</h1>
      <p className="text-sm text-[#94a3b8] mb-6">{bookmarkIds.length} tersimpan</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4.2] rounded-lg bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookmarkX className="w-16 h-16 text-[#1e1e2e] mb-4" />
          <h3 className="text-lg font-bold text-[#94a3b8] mb-2">Belum ada bookmark</h3>
          <p className="text-sm text-[#64748b]">Mulai browse dan bookmark donghua favoritmu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {data.map((d) => (
            <PosterCard key={d.id} id={d.id} title={d.title} poster={d.poster} latestEpisode={d.latestEpisode} rating={d.rating} status={d.status} />
          ))}
        </div>
      )}
    </div>
  );
}
