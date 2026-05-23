"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, User, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    if (mode === "register") {
      if (!email.trim()) {
        setError("Email is required.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      localStorage.setItem("dongplay-user", JSON.stringify({ username, email, avatar: username.charAt(0).toUpperCase() }));
    } else {
      const existing = localStorage.getItem("dongplay-user");
      if (existing) {
        const user = JSON.parse(existing);
        if (user.username !== username) {
          setError("Username not found.");
          return;
        }
      } else {
        localStorage.setItem("dongplay-user", JSON.stringify({ username, email: "", avatar: username.charAt(0).toUpperCase() }));
      }
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#6366f1] flex items-center justify-center mx-auto mb-4">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase italic">DongPlay</h1>
          <p className="text-sm text-[#94a3b8] mt-1">{mode === "login" ? "Sign in to your account" : "Create a new account"}</p>
        </div>

        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <div className="flex gap-2 mb-6">
            <button onClick={() => { setMode("login"); setError(""); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "login" ? "bg-[#6366f1] text-white" : "bg-[#0a0a0f] text-[#94a3b8] hover:text-white"}`}>
              Login
            </button>
            <button onClick={() => { setMode("register"); setError(""); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "register" ? "bg-[#6366f1] text-white" : "bg-[#0a0a0f] text-[#94a3b8] hover:text-white"}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#94a3b8] uppercase mb-1.5"><User className="w-3 h-3" /> Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#6366f1] transition-colors" />
            </div>
            {mode === "register" && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#94a3b8] uppercase mb-1.5"><Mail className="w-3 h-3" /> Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#6366f1] transition-colors" />
              </div>
            )}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-[#94a3b8] uppercase mb-1.5"><Lock className="w-3 h-3" /> Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#6366f1] transition-colors" />
            </div>
            {mode === "register" && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#94a3b8] uppercase mb-1.5"><Lock className="w-3 h-3" /> Confirm Password</label>
                <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Repeat password" className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#475569] outline-none focus:border-[#6366f1] transition-colors" />
              </div>
            )}
            {error && <p className="text-xs text-[#ef4444]">{error}</p>}
            <button type="submit" className="w-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold py-2.5 rounded-lg transition-colors uppercase text-sm">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
