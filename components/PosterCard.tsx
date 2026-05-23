"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface PosterCardProps {
  slug: string;
  episodeSlug?: string;
  title: string;
  poster: string;
  episode?: number;
  rating?: number | null;
  status?: string;
}

export default function PosterCard({ slug, episodeSlug, title, poster, episode, rating, status }: PosterCardProps) {
  const [imgError, setImgError] = useState(false);
  const href = episodeSlug ? `/watch/${episodeSlug}` : `/watch/${slug}`;

  return (
    <Link href={href} className="group block min-w-0">
      <div className="relative aspect-[3/4.2] rounded-lg overflow-hidden bg-[#12121a] border border-[#1e1e2e] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-[#6366f1]/50 group-hover:shadow-lg group-hover:shadow-[#6366f1]/10">
        {!imgError && poster ? (
          <img src={poster} alt={title} onError={() => setImgError(true)} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1e1e2e] to-[#12121a] flex items-center justify-center">
            <span className="text-[#64748b] text-xs text-center px-3 line-clamp-2 uppercase italic font-bold">{title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {episode != null && episode > 0 && (
          <div className="absolute top-2 right-2 bg-[#6366f1]/90 backdrop-blur text-white text-[10px] font-black px-2 py-0.5 rounded uppercase italic">
            EP {episode}
          </div>
        )}
        {rating != null && (
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-[#fbbf24] text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-[#fbbf24]/20">
            <Star className="w-2.5 h-2.5 fill-current" />
            {rating}
          </div>
        )}
        {status && (
          <div className="absolute bottom-2 left-2 right-2">
            <span className={`block text-center text-[9px] font-black py-1 rounded uppercase italic tracking-wider ${status === "completed" ? "bg-[#6366f1]/80 text-white" : "bg-[#22c55e]/80 text-white"}`}>
              {status === "completed" ? "Completed" : "Ongoing"}
            </span>
          </div>
        )}
      </div>
      <h3 className="mt-2 text-[11px] font-bold text-white truncate group-hover:text-[#6366f1] transition-colors uppercase italic tracking-tight px-0.5">
        {title}
      </h3>
    </Link>
  );
}
