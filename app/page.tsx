"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, Star, Eye, ChevronRight } from "lucide-react";
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

const statusFilters = ["All", "Ongoing", "Completed"] as const;

export default function HomePage() {
  const [data, setData] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/donghua")
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setData(json.data);
        } else if (json.error) {
          setError(json.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "All"
      ? data
      : data.filter(
          (d) => d.status.toLowerCase() === activeFilter.toLowerCase()
        );

  const featured = data.slice(0, 3);
  const topPopular = [...data]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Loading skeleton */}
      {loading && (
        <>
          {/* Hero skeleton */}
          <div className="h-64 sm:h-80 rounded-xl bg-[#12121a] border border-[#1e1e2e] mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="min-w-0">
                <div className="aspect-[2/3] rounded-lg bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
                <div className="mt-2 h-4 bg-[#12121a] rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-[#94a3b8] mb-4">Failed to load content</p>
          <p className="text-sm text-[#64748b]">{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data.length > 0 && (
        <>
          {/* Hero section */}
          {featured.length > 0 && (
            <section className="relative mb-10 rounded-xl overflow-hidden border border-[#1e1e2e] bg-[#12121a]">
              {/* Blurred background */}
              {featured[0].poster && (
                <div
                  className="absolute inset-0 opacity-20 blur-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${featured[0].poster})` }}
                />
              )}
              <div className="relative z-10 p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Featured poster */}
                  <div className="w-32 sm:w-44 shrink-0">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#0a0a0f] border border-[#1e1e2e]">
                      {featured[0].poster ? (
                        <img
                          src={featured[0].poster}
                          alt={featured[0].title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#64748b]">
                          {featured[0].title}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#6366f1] font-medium uppercase tracking-wider mb-2">
                      Featured
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#e2e8f0] mb-3">
                      {featured[0].title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      {featured[0].rating != null && (
                        <span className="flex items-center gap-1 text-sm text-[#fbbf24]">
                          <Star className="w-4 h-4 fill-[#fbbf24]" />
                          {featured[0].rating}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-sm text-[#94a3b8]">
                        <Eye className="w-4 h-4" />
                        {featured[0].views.toLocaleString()} views
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          featured[0].status === "completed"
                            ? "bg-[#6366f1]/20 text-[#6366f1]"
                            : "bg-[#22c55e]/20 text-[#22c55e]"
                        }`}
                      >
                        {featured[0].status}
                      </span>
                    </div>
                    <Link
                      href={`/watch/${featured[0].id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Watch Now
                    </Link>
                  </div>
                </div>

                {/* Other featured */}
                {featured.length > 1 && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {featured.slice(1).map((item) => (
                      <Link
                        key={item.id}
                        href={`/watch/${item.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg bg-[#0a0a0f]/50 border border-[#1e1e2e] hover:border-[#6366f1]/30 transition-colors min-w-0"
                      >
                        <div className="w-10 h-14 rounded overflow-hidden bg-[#1e1e2e] shrink-0">
                          {item.poster ? (
                            <img
                              src={item.poster}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-[#e2e8f0] truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-[#64748b]">
                            EP {item.latestEpisode}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Filter pills + Grid layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {/* Filter pills */}
              <div className="flex items-center gap-2 mb-6">
                {statusFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                      activeFilter === filter
                        ? "bg-[#6366f1] border-[#6366f1] text-white"
                        : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-[#e2e8f0]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#e2e8f0]">
                  Latest Updates
                </h2>
                <Link
                  href="/browse"
                  className="flex items-center gap-1 text-sm text-[#6366f1] hover:text-[#818cf8]"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filtered.map((item) => (
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

              {filtered.length === 0 && (
                <p className="text-[#64748b] text-center py-12">
                  No donghua found for this filter.
                </p>
              )}
            </div>

            {/* Top Popular sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
              <h3 className="text-lg font-semibold text-[#e2e8f0] mb-4">
                Top Popular
              </h3>
              <div className="space-y-3">
                {topPopular.map((item, idx) => (
                  <Link
                    key={item.id}
                    href={`/watch/${item.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#12121a] border border-[#1e1e2e] hover:border-[#6366f1]/30 transition-colors min-w-0"
                  >
                    <span
                      className={`text-lg font-bold w-8 text-center shrink-0 ${
                        idx === 0
                          ? "text-[#fbbf24]"
                          : idx === 1
                          ? "text-[#94a3b8]"
                          : idx === 2
                          ? "text-[#a16207]"
                          : "text-[#64748b]"
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div className="w-8 h-12 rounded overflow-hidden bg-[#1e1e2e] shrink-0">
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e2e8f0] truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#64748b] flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.views.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
