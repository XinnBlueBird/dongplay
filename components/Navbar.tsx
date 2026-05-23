"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Search, Menu, X, User, Home, Film, Clock, Bookmark } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const u = localStorage.getItem("dongplay-user");
    setLoggedIn(!!u);
  }, []);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/series", label: "Series", icon: Film },
    { href: "/history", label: "History", icon: Clock },
    { href: "/bookmarks", label: "Bookmark", icon: Bookmark },
  ];

  const handleSearch = () => {
    if (query.trim()) {
      window.location.href = `/series?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Dong<span className="text-[#6366f1]">Play</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors",
                  active ? "text-[#818cf8] bg-[#6366f1]/10" : "text-[#94a3b8] hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center bg-[#12121a] border border-[#1e1e2e] rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-[#64748b]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Cari donghua..."
                className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none ml-2 w-36 md:w-52"
                autoFocus
              />
              <button onClick={() => { setSearchOpen(false); setQuery(""); }}>
                <X className="w-4 h-4 text-[#64748b]" />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="p-2 text-[#94a3b8] hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
          )}
          <Link
            href={loggedIn ? "/profile" : "/login"}
            className="hidden md:flex p-2 text-[#94a3b8] hover:text-white transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#94a3b8] hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e2e] bg-[#0a0a0f] px-4 py-3 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  active ? "text-[#818cf8] bg-[#6366f1]/10" : "text-[#94a3b8]"
                )}
              >
                <Icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
          <Link
            href={loggedIn ? "/profile" : "/login"}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#94a3b8]"
          >
            <User className="w-4 h-4" />
            {loggedIn ? "Profile" : "Login"}
          </Link>
        </div>
      )}
    </nav>
  );
}
