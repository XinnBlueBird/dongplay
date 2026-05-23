"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Play, Bookmark } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse" },
    { href: "/bookmarks", label: "Bookmarks" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#1e1e2e]">
      <div className="max-w-[1440px] mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-white">Dong<span className="text-[#6366f1]">Play</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={clsx("text-sm font-medium transition-colors", pathname === l.href ? "text-[#6366f1]" : "text-[#94a3b8] hover:text-white")}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="flex items-center bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-[#94a3b8]" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search donghua..." className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none ml-2 w-40 md:w-60" autoFocus />
              <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="ml-1"><X className="w-4 h-4 text-[#94a3b8]" /></button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-[#94a3b8] hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
          )}
          <Link href="/bookmarks" className="hidden md:flex p-2 text-[#94a3b8] hover:text-white transition-colors"><Bookmark className="w-5 h-5" /></Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#94a3b8] hover:text-white"><Menu className="w-5 h-5" /></button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e2e] bg-[#0a0a0f] px-4 py-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className={clsx("block py-2 text-sm font-medium", pathname === l.href ? "text-[#6366f1]" : "text-[#94a3b8]")}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
