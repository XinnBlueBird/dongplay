"use client";
import Link from "next/link";
import { Star } from "lucide-react";

interface Props {
  id: string;
  title: string;
  poster: string;
  rating: number;
  latestEpisode: number;
  status: string;
}

export default function PosterCard({ id, title, poster, rating, latestEpisode, status }: Props) {
  const statusColor = status === "ongoing" ? "bg-[#22c55e]" : status === "completed" ? "bg-[#6366f1]" : "bg-[#ef4444]";
  return (
    <Link href={`/watch/${id}`} className="group block min-w-0">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#12121a] border border-[#1e1e2e] transition-all duration-300 group-hover:border-[#6366f1]/50 group-hover:shadow-lg group-hover:shadow-[#6366f1]/10 group-hover:scale-[1.02]">
        <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="text-xs font-bold bg-[#0a0a0f]/80 text-white px-2 py-0.5 rounded">EP {latestEpisode}</span>
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#0a0a0f]/80 px-1.5 py-0.5 rounded">
          <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
          <span className="text-xs font-bold text-white">{rating}</span>
        </div>
      </div>
      <h3 className="mt-2 text-sm font-medium text-[#e2e8f0] truncate group-hover:text-[#6366f1] transition-colors">{title}</h3>
    </Link>
  );
}
