"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface PosterCardProps {
  id: string;
  title: string;
  poster: string;
  latestEpisode?: number;
  rating?: number | null;
  status?: string;
}

export default function PosterCard({
  id,
  title,
  poster,
  latestEpisode,
  rating,
  status,
}: PosterCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/watch/${id}`}
      className="group block min-w-0"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#12121a] border border-[#1e1e2e] transition-all duration-200 group-hover:scale-[1.02] group-hover:border-[#6366f1]/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
        {/* Poster image or fallback */}
        {!imgError && poster ? (
          <img
            src={poster}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e1e2e] to-[#12121a] flex items-center justify-center">
            <span className="text-[#64748b] text-sm text-center px-4 line-clamp-2">
              {title}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* EP badge top-left */}
        {latestEpisode != null && latestEpisode > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#6366f1] text-white text-xs font-semibold rounded">
            EP {latestEpisode}
          </div>
        )}

        {/* Rating top-right */}
        {rating != null && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 rounded text-xs">
            <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
            <span className="text-[#fbbf24] font-medium">{rating}</span>
          </div>
        )}

        {/* Status dot */}
        {status && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 rounded text-xs">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === "completed" ? "bg-[#6366f1]" : "bg-[#22c55e]"
              }`}
            />
            <span className="text-[#94a3b8] capitalize">{status}</span>
          </div>
        )}
      </div>

      {/* Title below card */}
      <p className="mt-2 text-sm text-[#e2e8f0] truncate group-hover:text-[#6366f1] transition-colors">
        {title}
      </p>
    </Link>
  );
}
