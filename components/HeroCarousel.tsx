"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { Donghua } from "@/lib/data";

export default function HeroCarousel({ items }: { items: Donghua[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[current];
  if (!item) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-xl overflow-hidden bg-[#12121a] border border-[#1e1e2e]">
      <div className="absolute inset-0">
        <img src={item.poster} alt="" className="w-full h-full object-cover opacity-20 blur-xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/95 via-[#0a0a0f]/70 to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-12 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#6366f1] uppercase tracking-wider">Featured</span>
          <span className="flex items-center gap-1 text-xs text-[#fbbf24]"><Star className="w-3 h-3 fill-[#fbbf24]" />{item.rating}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{item.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {item.genre.slice(0, 4).map((g) => (
            <span key={g} className="text-xs px-2.5 py-1 rounded-full border border-[#1e1e2e] text-[#94a3b8] bg-[#12121a]/50">{g}</span>
          ))}
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#6366f1]/20 text-[#818cf8]">{item.episodes} Episodes</span>
        </div>
        <p className="text-sm text-[#94a3b8] line-clamp-2 mb-6">{item.synopsis}</p>
        <Link href={`/watch/${item.id}`} className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold px-6 py-3 rounded-lg transition-colors w-fit">
          <Play className="w-5 h-5 fill-white" /> Watch Now
        </Link>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        <button onClick={() => setCurrent((p) => (p - 1 + items.length) % items.length)} className="w-8 h-8 rounded-full bg-[#12121a]/80 border border-[#1e1e2e] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[#6366f1] w-4" : "bg-[#64748b]"}`} />
        ))}
        <button onClick={() => setCurrent((p) => (p + 1) % items.length)} className="w-8 h-8 rounded-full bg-[#12121a]/80 border border-[#1e1e2e] flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
