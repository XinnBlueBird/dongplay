import Link from "next/link";
import { Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#6366f1] flex items-center justify-center">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-sm font-bold text-white">DongPlay</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#64748b]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/series" className="hover:text-white transition-colors">Series</Link>
          </div>
          <p className="text-xs text-[#475569] text-center md:text-right">
            DongPlay 2026 — Tidak berafiliasi dengan donghuafast.site. Semua konten dari sumber publik.
          </p>
        </div>
      </div>
    </footer>
  );
}
