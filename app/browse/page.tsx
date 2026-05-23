"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
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
const sortOptions = ["Latest", "A-Z"] as const;

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowseLoading />}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#e2e8f0] mb-6">Browse</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="min-w-0">
            <div className="aspect-[2/3] rounded-lg bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
            <div className="mt-2 h-4 bg-[#12121a] rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [data, setData] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(initialQ);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sort, setSort] = useState<string>("Latest");

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

  const filtered = useMemo(() => {
    let result = [...data];

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter(
        (d) => d.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((d) => d.title.toLowerCase().includes(q));
    }

    // Sort
    if (sort === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => b.year - a.year || b.views - a.views);
    }

    return result;
  }, [data, statusFilter, search, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#e2e8f0] mb-6">Browse</h1>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#12121a] border border-[#1e1e2e] rounded-lg text-[#e2e8f0] placeholder-[#64748b] outline-none focus:border-[#6366f1]"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#64748b] shrink-0" />
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                statusFilter === f
                  ? "bg-[#6366f1] border-[#6366f1] text-white"
                  : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 text-sm bg-[#12121a] border border-[#1e1e2e] rounded-lg text-[#e2e8f0] outline-none focus:border-[#6366f1] cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
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

      {/* Grid */}
      {!loading && !error && (
        <>
          <p className="text-sm text-[#64748b] mb-4">
            {filtered.length} title{filtered.length !== 1 ? "s" : ""} found
          </p>
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
            <p className="text-[#64748b] text-center py-16">
              No results found. Try adjusting your search or filters.
            </p>
          )}
        </>
      )}
    </div>
  );
}
