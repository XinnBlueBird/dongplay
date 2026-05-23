"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Bookmark, Clock, LogOut, Edit2 } from "lucide-react";

interface UserData {
  username: string;
  email: string;
  avatar: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("dongplay-user");
    if (!stored) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    setNewUsername(u.username);
    setNewEmail(u.email || "");

    const bm = JSON.parse(localStorage.getItem("dongplay-bookmarks") || "[]");
    setBookmarkCount(bm.length);
    const hist = JSON.parse(localStorage.getItem("dongplay-history") || "[]");
    setHistoryCount(hist.length);
  }, [router]);

  const handleSave = () => {
    if (!newUsername.trim()) return;
    const updated = { ...user, username: newUsername, email: newEmail, avatar: newUsername.charAt(0).toUpperCase() };
    localStorage.setItem("dongplay-user", JSON.stringify(updated));
    setUser(updated as UserData);
    setEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("dongplay-user");
    router.push("/");
    router.refresh();
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#6366f1] flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl font-black text-white">{user.avatar}</span>
        </div>

        {editing ? (
          <div className="space-y-3 max-w-xs mx-auto">
            <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Username" className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#6366f1]" />
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Email" className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#6366f1]" />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 bg-[#6366f1] text-white py-2 rounded-lg text-sm font-bold">Save</button>
              <button onClick={() => setEditing(false)} className="flex-1 bg-[#0a0a0f] border border-[#1e1e2e] text-[#94a3b8] py-2 rounded-lg text-sm font-bold">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-black text-white uppercase italic">{user.username}</h1>
            {user.email && <p className="text-sm text-[#94a3b8] mt-1">{user.email}</p>}
          </>
        )}

        <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-[#1e1e2e]">
          <div className="text-center">
            <div className="flex items-center gap-1 text-[#6366f1] mb-1"><Bookmark className="w-4 h-4" /><span className="text-lg font-black">{bookmarkCount}</span></div>
            <p className="text-xs text-[#64748b]">Bookmarks</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-[#22d3ee] mb-1"><Clock className="w-4 h-4" /><span className="text-lg font-black">{historyCount}</span></div>
            <p className="text-xs text-[#64748b]">Watched</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center justify-center gap-2 w-full bg-[#0a0a0f] border border-[#1e1e2e] text-[#94a3b8] hover:text-white hover:border-[#6366f1] py-2.5 rounded-lg text-sm font-bold transition-colors">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/20 py-2.5 rounded-lg text-sm font-bold transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
