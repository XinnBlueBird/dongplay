"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Trash2, Play } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  poster: string;
  episode: number;
  timestamp: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("dongplay-history") || "[]");
    setHistory(h);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("dongplay-history");
    setHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic">History</h1>
          <p className="text-sm text-[#94a3b8]">{history.length} ditonton</p>
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-xs font-bold hover:bg-[#ef4444]/20 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="w-16 h-16 text-[#1e1e2e] mb-4" />
          <h3 className="text-lg font-bold text-[#94a3b8] mb-2">Belum ada history</h3>
          <p className="text-sm text-[#64748b]">Mulai nonton donghua dan history akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Link key={item.id + item.episode + item.timestamp} href={`/watch/${item.id}`} className="flex items-center gap-4 p-3 rounded-xl bg-[#12121a] border border-[#1e1e2e] hover:border-[#6366f1]/30 transition-colors group">
              <div className="w-12 h-16 rounded overflow-hidden bg-[#1e1e2e] shrink-0">
                {item.poster ? <img src={item.poster} alt={item.title} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#e2e8f0] truncate group-hover:text-[#6366f1] transition-colors uppercase italic">{item.title}</p>
                <p className="text-xs text-[#64748b]">Episode {item.episode}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366f1]/10 text-[#818cf8] text-xs font-bold shrink-0">
                <Play className="w-3 h-3 fill-current" /> Lanjut
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
