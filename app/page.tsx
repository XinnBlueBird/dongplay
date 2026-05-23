"use client";
import { useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import PosterCard from "@/components/PosterCard";
import GenreFilter from "@/components/GenreFilter";
import { allDonghua, featuredDonghua, topPopular } from "@/lib/data";
import { TrendingUp, Star, Flame, Clock } from "lucide-react";

const genres = ["All", "Action", "Cultivation", "Fantasy", "Supernatural", "Sci-Fi", "Comedy", "Romance", "Drama", "Martial Arts", "Modern"];

export default function Home() {
  const [activeGenre, setActiveGenre] = useState("All");

  const filtered = activeGenre === "All"
    ? allDonghua
    : allDonghua.filter((d) => d.genre.includes(activeGenre));

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        {/* Hero */}
        <HeroCarousel items={featuredDonghua} />

        <div className="flex gap-6 mt-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Genre Filter */}
            <div className="mb-6">
              <GenreFilter genres={genres} active={activeGenre} onSelect={setActiveGenre} />
            </div>

            {/* Latest Updates Header */}
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#22d3ee]" />
              <h2 className="text-lg font-bold text-white">Latest Updates</h2>
              <span className="text-xs text-[#64748b] bg-[#12121a] px-2 py-0.5 rounded border border-[#1e1e2e]">{filtered.length} titles</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((d) => (
                <PosterCard
                  key={d.id}
                  id={d.id}
                  title={d.title}
                  poster={d.poster}
                  rating={d.rating}
                  latestEpisode={d.latestEpisode}
                  status={d.status}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            {/* Top Popular */}
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-[#f59e0b]" />
                <h3 className="text-sm font-bold text-white">Top Popular</h3>
              </div>
              <div className="space-y-3">
                {topPopular.map((item) => (
                  <div key={item.rank} className="flex items-center gap-3">
                    <span className={`text-lg font-black w-6 text-center ${item.rank <= 3 ? "text-[#f59e0b]" : "text-[#64748b]"}`}>
                      {item.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e2e8f0] truncate">{item.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748b] flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />{item.views}
                        </span>
                        <span className="text-xs text-[#fbbf24] flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#fbbf24]" />{item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* You May Like */}
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <h3 className="text-sm font-bold text-white mb-4">You May Like</h3>
              <div className="space-y-3">
                {allDonghua.slice(20, 26).map((d) => (
                  <a key={d.id} href={`/watch/${d.id}`} className="flex items-center gap-3 group">
                    <div className="w-10 h-14 rounded overflow-hidden bg-[#1e1e2e] shrink-0">
                      <img src={d.poster} alt={d.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e2e8f0] truncate group-hover:text-[#6366f1] transition-colors">{d.title}</p>
                      <span className="text-xs text-[#64748b]">{d.genre.slice(0, 2).join(" / ")}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
