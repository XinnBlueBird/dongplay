"use client";
interface Props { total: number; current: number; onSelect: (n: number) => void; }

export default function EpisodeGrid({ total, current, onSelect }: Props) {
  const episodes = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[320px] overflow-y-auto pr-1">
      {episodes.map((n) => (
        <button key={n} onClick={() => onSelect(n)} className={`aspect-square rounded-lg text-sm font-bold transition-all ${n === current ? "bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/30" : "bg-[#12121a] border border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white"}`}>
          {n}
        </button>
      ))}
    </div>
  );
}
