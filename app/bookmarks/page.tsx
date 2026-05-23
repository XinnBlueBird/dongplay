"use client";
import { useState, useEffect } from "react";
import PosterCard from "@/components/PosterCard";
import { allDonghua } from "@/lib/data";
import { BookmarkX } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("dongplay-bookmarks") || "[]";
    setBookmarkIds(JSON.parse(saved));
  }, []);

  const bookmarked = allDonghua.filter((d) => bookmarkIds.includes(d.id));

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">Bookmarks</h1>
        <p className="text-sm text-[#94a3b8] mb-6">{bookmarked.length} saved titles</p>

        {bookmarked.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookmarkX className="w-16 h-16 text-[#1e1e2e] mb-4" />
            <h3 className="text-lg font-bold text-[#94a3b8] mb-2">No bookmarks yet</h3>
            <p className="text-sm text-[#64748b]">Start browsing and bookmark your favorite donghua to find them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {bookmarked.map((d) => (
              <PosterCard key={d.id} id={d.id} title={d.title} poster={d.poster} rating={d.rating} latestEpisode={d.latestEpisode} status={d.status} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
