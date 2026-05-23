"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import PosterCard from "@/components/PosterCard";

interface DonghuaItem {
  slug: string;
  title: string;
  poster: string;
  episode: number;
  status: string;
  episodeSlug: string;
}

const FILTERS = ["All", "Ongoing", "Completed"] as const;

export default function HomePage() {
  const [data, setData] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [heroIdx, setHeroIdx] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/donghua")
      .then((r) => r.json())
      .then((j) => { if (j.data) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (data.length < 2) return;
    const t = setInterval(() => setHeroIdx((p) => (p + 1) % Math.min(5, data.length)), 6000);
    return () => clearInterval(t);
  }, [data.length]);

  const filtered = filter === "All" ? data : data.filter((d) => d.status === filter.toLowerCase());
  const perPage = 18;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const featured = data.slice(0, 5);
  const hero = featured[heroIdx];
  const topPopular = [...data].sort((a, b) => b.episode - a.episode).slice(0, 5);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="h-64 sm:h-80 rounded-xl bg-[#12121a] border border-[#1e1e2e] mb-8 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="min-w-0">
              <div className="aspect-[3/4.2] rounded-lg bg-[#12121a] border border-[#1e1e2e] animate-pulse" />
              <div className="mt-2 h-3 bg-[#12121a] rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Hero Carousel */}
      {hero && (
        <section className="relative mb-8 rounded-xl overflow-hidden border border-[#1e1e2e] h-64 sm:h-80">
          {hero.poster && (
            <div className="absolute inset-0 opacity-20 blur-xl bg-cover bg-center scale-110" style={{ backgroundImage: `url(${hero.poster})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/60 to-transparent" />
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 max-w-2xl">
            <p className="text-xs font-bold text-[#6366f1] uppercase tracking-wider italic mb-2">Latest Release</p>
            <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 uppercase italic leading-tight">{hero.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {hero.episode > 0 && <span className="text-xs px-2 py-0.5 bg-[#6366f1]/20 text-[#818cf8] rounded font-bold">EP {hero.episode}</span>}
              <span className="text-xs px-2 py-0.5 bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] rounded capitalize">{hero.status}</span>
            </div>
            <Link href={`/watch/${hero.episodeSlug}`} className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors w-fit uppercase italic">
              <Play className="w-4 h-4 fill-white" /> Watch Now
            </Link>
          </div>
          {/* Carousel controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
            <button onClick={() => setHeroIdx((p) => (p - 1 + featured.length) % featured.length)} className="w-8 h-8 rounded-full bg-[#12121a]/80 border border-[#1e1e2e] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {featured.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? "bg-[#6366f1] w-4" : "bg-[#64748b]"}`} />
            ))}
            <button onClick={() => setHeroIdx((p) => (p + 1) % featured.length)} className="w-8 h-8 rounded-full bg-[#12121a]/80 border border-[#1e1e2e] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white uppercase italic">Latest Release</h2>
            <Link href="/series" className="text-sm text-[#6366f1] hover:text-[#818cf8] font-medium">View All</Link>
          </div>
          <div className="flex items-center gap-2 mb-6">
            {FILTERS.map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all uppercase ${filter === f ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white"}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginated.map((item) => (
              <PosterCard key={item.episodeSlug} slug={item.slug} episodeSlug={item.episodeSlug} title={item.title} poster={item.poster} episode={item.episode} status={item.status} />
            ))}
          </div>

          {filtered.length === 0 && <p className="text-center text-[#64748b] py-12">No donghua found.</p>}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="w-8 h-8 rounded bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] flex items-center justify-center disabled:opacity-30 hover:border-[#6366f1] transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-xs font-bold transition-all ${page === n ? "bg-[#6366f1] text-white" : "bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-8 h-8 rounded bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] flex items-center justify-center disabled:opacity-30 hover:border-[#6366f1] transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
            <h3 className="text-sm font-bold text-white uppercase italic mb-4">Top Popular</h3>
            <div className="space-y-3">
              {topPopular.map((item, idx) => (
                <Link key={item.episodeSlug} href={`/watch/${item.episodeSlug}`} className="flex items-center gap-3 group min-w-0">
                  <span className={`text-lg font-black w-6 text-center shrink-0 ${idx === 0 ? "text-[#fbbf24]" : idx === 1 ? "text-[#c0c0c0]" : idx === 2 ? "text-[#cd7f32]" : "text-[#64748b]"}`}>
                    {idx + 1}
                  </span>
                  <div className="w-8 h-11 rounded overflow-hidden bg-[#1e1e2e] shrink-0">
                    {item.poster ? <img src={item.poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#e2e8f0] truncate group-hover:text-[#6366f1] transition-colors uppercase italic">{item.title}</p>
                    {item.episode > 0 && <span className="text-[10px] text-[#64748b]">EP {item.episode}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
