"use client";
interface Props { videoId: string; title: string; }

export default function YouTubePlayer({ videoId, title }: Props) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0a0a0f] border border-[#1e1e2e]">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=1`}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
