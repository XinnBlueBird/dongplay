"use client";

import { useEffect, useState, useMemo } from "react";
import PosterCard from "@/components/PosterCard";
import { Search, SlidersHorizontal } from "lucide-react";

interface DonghuaItem {
  id: string;
  title: string;
  poster: string;
  latestEpisode: number;
  rating: number | null;
  status: string;
}

const FILTERS = ["All", "Ongoing", "Completed"];
const SORTS = ["Latest", "A-Z", "Most Episodes"];

export default function SeriesPage() {
  const [data, setData] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Latest");

  useEffect(() => {
    // Read ?q= from URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setQuery(q);

    fetch("/api/donghua")
      .then((r) => r.json())
      .then((j) => { if (j.data) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let results = [...data];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter((d) => d.title.toLowerCase().includes(q));
    }
    if (filter !== "All") {
      results = results.filter((d) => d.status === filter.toLowerCase());
    }
    switch (sort) {
      case "A-Z":
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "Most Episodes":
        results.sort((a, b) => b.latestEpisode - a.latestEpisode);
        break;
      default:
        break;
    }
    return results;
  }, [data, query, filter, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-white uppercase italic mb-1">Semua Series</h1>
      <p className="text-sm text-[#94a3b8] mb-6">{data.length} donghua tersedia</p>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex-1 flex items-center bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#64748b]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul donghua..." className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none ml-2 w-full" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${filter === f ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50"}`}>
              {f}
            </button>
          ))}
          {SORTS.map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${sort === s ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-[#64748b] mb-4">{filtered.length} hasil</p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4.2] rounded-lg bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#94a3b8]">Tidak ada donghua ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((d) => (
            <PosterCard key={d.id} id={d.id} title={d.title} poster={d.poster} latestEpisode={d.latestEpisode} rating={d.rating} status={d.status} />
          ))}
        </div>
      )}
    </div>
  );
}
