"use client";
interface Props { genres: string[]; active: string; onSelect: (g: string) => void; }

export default function GenreFilter({ genres, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((g) => (
        <button key={g} onClick={() => onSelect(g)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${active === g ? "bg-[#6366f1] border-[#6366f1] text-white" : "border-[#1e1e2e] text-[#94a3b8] hover:border-[#6366f1]/50 hover:text-white"}`}>
          {g}
        </button>
      ))}
    </div>
  );
}
