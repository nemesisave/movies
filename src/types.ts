export type Language = 'es' | 'en';

export interface QualityStream {
  label: '1080p' | '720p' | '480p' | 'Auto';
  url: string;
}

export interface VideoSubtitles {
  lang: Language;
  label: string;
  srclang: string;
  vttBlobUrl?: string; // For custom local files
  vttContent?: string; // Inline VTT string
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title_es: string;
  title_en: string;
  duration: string;
  release_date: string;
  poster_url: string;
  video_url: string;
}

export interface Video {
  id: string;
  title_es: string;
  title_en: string;
  description_es: string;
  description_en: string;
  category: 'movies' | 'series' | 'novelas' | 'sports' | 'kids';
  genre_es: string;
  genre_en: string;
  duration: string; // e.g. "1h 45m" or "45m"
  poster_url: string;
  backdrop_url?: string; // High-quality wide banner for cinematic screen
  streams: QualityStream[];
  rating: string; // e.g. "PG-13", "TV-14"
  year: string;
  isCustom?: boolean;
  cast: string[];
  subtitles?: VideoSubtitles[];
  episodes?: Episode[]; // Dynamic episode selection for series/novelas
  status?: 'published' | 'draft'; // CMS Publish Status
  isFeatured?: boolean; // Force Featured Hero Item
  isTrending?: boolean; // Label as Trending
  isPopular?: boolean; // Label as Popular
  director?: string;
  country?: string;
}

export interface UserReview {
  id: string;
  video_id: string;
  user_email: string;
  rating: number;
  comment: string;
  date: string;
}
