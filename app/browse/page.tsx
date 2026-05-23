"use client";
import { useState, useMemo } from "react";
import PosterCard from "@/components/PosterCard";
import { allDonghua } from "@/lib/data";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const allGenres = ["All", "Action", "Cultivation", "Fantasy", "Supernatural", "Sci-Fi", "Comedy", "Romance", "Drama", "Martial Arts", "Modern"];
const statuses = ["All", "Ongoing", "Completed"];
const sortOptions = ["Latest", "Most Popular", "Highest Rated", "A-Z"];

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Latest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = [...allDonghua];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter((d) => d.title.toLowerCase().includes(q) || (d.titleCN && d.titleCN.includes(q)));
    }
    if (genre !== "All") {
      results = results.filter((d) => d.genre.includes(genre));
    }
    if (status !== "All") {
      results = results.filter((d) => d.status === status.toLowerCase());
    }

    switch (sort) {
      case "Most Popular":
        results.sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
        break;
      case "Highest Rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "A-Z":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        results.sort((a, b) => b.year - a.year);
    }

    return results;
  }, [query, genre, status, sort]);

  return (
    <div className="pt-16">
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">Browse</h1>
        <p className="text-sm text-[#94a3b8] mb-6">{allDonghua.length} donghua titles available</p>

        {/* Search + Filter Toggle */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-[#64748b]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title..."
              className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none ml-2 w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${showFilters ? "bg-[#6366f1] border-[#6366f1] text-white" : "bg-[#12121a] border-[#1e1e2e] text-[#94a3b8] hover:text-white hover:border-[#6366f1]"}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 mb-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-2">
                {allGenres.map((g) => (
                  <button key={g} onClick={() => setGenre(g)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${genre === g ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white"}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Status</label>
                <div className="flex gap-2">
                  {statuses.map((s) => (
                    <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${status === s ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2 block">Sort By</label>
                <div className="flex gap-2">
                  {sortOptions.map((s) => (
                    <button key={s} onClick={() => setSort(s)} className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${sort === s ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50"}`}>
                      {s === "Latest" && <ArrowUpDown className="w-3 h-3" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <p className="text-xs text-[#64748b] mb-4">{filtered.length} results</p>
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#94a3b8]">No donghua found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((d) => (
              <PosterCard key={d.id} id={d.id} title={d.title} poster={d.poster} rating={d.rating} latestEpisode={d.latestEpisode} status={d.status} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
