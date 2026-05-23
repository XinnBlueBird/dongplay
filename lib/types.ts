export interface DonghuaEpisode {
  number: number;
  episodeUuid: string;
  title?: string;
}

export interface DonghuaSummary {
  id: string; // UUID from donghuafast.site
  title: string;
  poster: string; // 8upload URL
  rating: number | null;
  latestEpisode: number;
  status: "ongoing" | "completed" | "upcoming";
  genre: string[];
  views: string;
  year: number;
  synopsis: string;
  episodes: DonghuaEpisode[];
}
