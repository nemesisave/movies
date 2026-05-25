import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Film, Trash2, Video as VideoIcon, Sparkles, Check, Info, 
  Edit3, Layers, PlusCircle, RefreshCw, Database, Star, TrendingUp, 
  Eye, EyeOff, Flame, Zap, Search, BookmarkCheck, ArrowUpRight,
  Tv, Heart, Trophy, Smile
} from 'lucide-react';
import { Video, Language, QualityStream, VideoSubtitles, Episode } from '../types';

interface UploadDashboardProps {
  language: Language;
  translations: any;
  onAddVideo: (vid: Video) => void;
  customVideos: Video[];
  onRemoveVideo: (id: string) => void;
  videos: Video[];
  onUpdateVideo: (vid: Video) => void;
}

export default function UploadDashboard({
  language,
  translations,
  onAddVideo,
  customVideos,
  onRemoveVideo,
  videos,
  onUpdateVideo
}: UploadDashboardProps) {
  // Navigation inside Dashboard (add, edit, episodes, catalog)
  const [activeTab, setActiveTab] = useState<'add' | 'edit' | 'episodes' | 'catalog'>('catalog'); // Starts on catalog list for instant control!

  // Form State for Adding / Editing Videos
  const [titleEs, setTitleEs] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descEs, setDescEs] = useState('');
  const [descEn, setDescEn] = useState('');
  const [category, setCategory] = useState<'movies' | 'series' | 'novelas' | 'sports' | 'kids'>('movies');
  const [genreEs, setGenreEs] = useState('');
  const [genreEn, setGenreEn] = useState('');
  const [year, setYear] = useState('2026');
  const [duration, setDuration] = useState('1h 30m');
  const [rating, setRating] = useState('PG-13');
  const [cast, setCast] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');

  // CMS Specific Options (Publish Status, Hero Featured, Badges)
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [isTrending, setIsTrending] = useState<boolean>(false);
  const [isPopular, setIsPopular] = useState<boolean>(false);

  // Catalog tab filters & search
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('all');
  const [catalogStatus, setCatalogStatus] = useState('all');

  // Source Type
  const [sourceType, setSourceType] = useState<'file' | 'url'>('url');

  // Video Streaming Source URLs (different bitrates)
  const [video1080, setVideo1080] = useState('');
  const [video720, setVideo720] = useState('');
  const [video480, setVideo480] = useState('');

  // Physical Video File Drop state
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subtitles input (VTT transcriptions)
  const [customVttEs, setCustomVttEs] = useState('');
  const [customVttEn, setCustomVttEn] = useState('');

  // Editing State
  const [editingVideoId, setEditingVideoId] = useState<string>('');

  // Episode state management (Adding or Editing)
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>('');
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(1);
  const [epNumber, setEpNumber] = useState<number>(1);
  const [epTitleEs, setEpTitleEs] = useState('');
  const [epTitleEn, setEpTitleEn] = useState('');
  const [epDuration, setEpDuration] = useState('45m');
  const [epReleaseDate, setEpReleaseDate] = useState('2026');
  const [epPosterUrl, setEpPosterUrl] = useState('');
  const [epVideoUrl, setEpVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  
  // Episode sub-editions state
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  // Search queries for admin console search bars
  const [editSearchQuery, setEditSearchQuery] = useState('');
  const [episodeSeriesSearchQuery, setEpisodeSeriesSearchQuery] = useState('');

  // Auto-initialize first editing option or series option
  useEffect(() => {
    if (videos.length > 0 && !editingVideoId) {
      setEditingVideoId(videos[0].id);
    }
    const seriesList = videos.filter(v => v.category === 'series' || v.category === 'novelas');
    if (seriesList.length > 0 && !selectedSeriesId) {
      setSelectedSeriesId(seriesList[0].id);
    }
  }, [videos]);

  // Load a video into edit form fields
  const handleLoadVideoForEditing = (id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video) return;

    setEditingVideoId(id);
    setTitleEs(video.title_es);
    setTitleEn(video.title_en);
    setDescEs(video.description_es);
    setDescEn(video.description_en);
    setCategory(video.category);
    setGenreEs(video.genre_es);
    setGenreEn(video.genre_en);
    setYear(video.year);
    setDuration(video.duration);
    setRating(video.rating);
    setCast(video.cast.join(', '));
    setPosterUrl(video.poster_url);
    setBackdropUrl(video.backdrop_url || '');
    setSourceType('url');
    
    // Loaded CMS flags
    setStatus(video.status || 'published');
    setIsFeatured(video.isFeatured || false);
    setIsTrending(video.isTrending || false);
    setIsPopular(video.isPopular || false);

    const stream1080 = video.streams?.find(s => s.label === '1080p')?.url || '';
    const stream720 = video.streams?.find(s => s.label === '720p')?.url || '';
    const stream480 = video.streams?.find(s => s.label === '480p')?.url || '';

    setVideo1080(stream1080 || video.streams?.[0]?.url || '');
    setVideo720(stream720 || video.streams?.[0]?.url || '');
    setVideo480(stream480 || video.streams?.[0]?.url || '');

    const subEs = video.subtitles?.find(s => s.lang === 'es')?.vttContent || '';
    const subEn = video.subtitles?.find(s => s.lang === 'en')?.vttContent || '';
    setCustomVttEs(subEs);
    setCustomVttEn(subEn);

    setNotification(language === 'es' ? '¡Campos cargados para edición!' : 'Fields loaded for editing!');
    setTimeout(() => setNotification(null), 2500);
  };

  // Reset helper
  const handleResetForm = () => {
    setTitleEs('');
    setTitleEn('');
    setDescEs('');
    setDescEn('');
    setGenreEs('');
    setGenreEn('');
    setCast('');
    setPosterUrl('');
    setBackdropUrl('');
    setVideo1080('');
    setVideo720('');
    setVideo480('');
    setLocalFile(null);
    setCustomVttEs('');
    setCustomVttEn('');
    
    // Reset CMS flags
    setStatus('published');
    setIsFeatured(false);
    setIsTrending(false);
    setIsPopular(false);
  };

  // Presets to populate fields quickly
  const loadPresetSample = (presetIndex: number) => {
    if (presetIndex === 1) {
      setTitleEs('Aventura Cosmos');
      setTitleEn('Cosmos Adventure');
      setDescEs('Una expedición fantástica fuera de la órbita de la Tierra en busca de planetas vivientes.');
      setDescEn('A fantastic expedition outside Earth\'s orbit in search of living planets.');
      setGenreEs('Ciencia Ficción, Suspenso');
      setGenreEn('Sci-Fi, Thriller');
      setCategory('movies');
      setYear('2025');
      setDuration('1h 42m');
      setRating('PG');
      setCast('Major Tom, Dr. Elena, Spark Robot');
      setPosterUrl('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600');
      setBackdropUrl('https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1600');
      setSourceType('url');
      setVideo1080('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      setVideo720('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
      setVideo480('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
    } else {
      setTitleEs('Fútbol de Campeones');
      setTitleEn('Soccer of Champions');
      setDescEs('El recopilatorio más emocionante de goles y jugadas maestros de la liga latinoamericana.');
      setDescEn('The most exciting compilation of goals and master plays of the Latin American league.');
      setGenreEs('Deportes, Acción');
      setGenreEn('Sports, Action');
      setCategory('sports');
      setYear('2026');
      setDuration('52m');
      setRating('G');
      setCast('Lionel, Memo, Cristiano, James');
      setPosterUrl('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600');
      setBackdropUrl('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600');
      setSourceType('url');
      setVideo1080('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      setVideo720('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      setVideo480('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }

    setNotification(language === 'es' ? '¡Campos cargados con presets de prueba!' : 'Fields loaded with test presets!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setLocalFile(file);
        setSourceType('file');
      } else {
        alert(language === 'es' ? 'Por favor introduce un archivo de video MP4.' : 'Please input a proper MP4 video file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLocalFile(file);
      setSourceType('file');
    }
  };

  // Publish or Edit Video Form submit
  const handlePublishOrEdit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleEs && !titleEn) {
      alert(language === 'es' ? 'Por favor ingresa un título para el video' : 'Please input a video title');
      return;
    }

    // Set fallback stream URL
    let finalStreams: QualityStream[] = [];
    if (sourceType === 'file' && localFile) {
      const blobUrl = URL.createObjectURL(localFile);
      finalStreams = [
        { label: '1080p', url: blobUrl },
        { label: '720p', url: blobUrl },
        { label: '480p', url: blobUrl }
      ];
    } else {
      const stream1080 = video1080 || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      const stream720 = video720 || stream1080;
      const stream480 = video480 || stream720;

      finalStreams = [
        { label: '1080p', url: stream1080 },
        { label: '720p', url: stream720 },
        { label: '480p', url: stream480 }
      ];
    }

    // Subtitles setup
    const subtitles: VideoSubtitles[] = [];
    if (customVttEs) {
      subtitles.push({
        lang: 'es',
        label: 'Español',
        srclang: 'es',
        vttContent: customVttEs
      });
    }
    if (customVttEn) {
      subtitles.push({
        lang: 'en',
        label: 'English',
        srclang: 'en',
        vttContent: customVttEn
      });
    }

    const poster = posterUrl.trim() || `https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600`;
    const backdrop = backdropUrl.trim() || poster;

    if (activeTab === 'edit' && editingVideoId) {
      // Get the existing video to retain its current episodes
      const existingVideo = videos.find(v => v.id === editingVideoId);
      const existingEpisodes = existingVideo ? existingVideo.episodes : undefined;

      // If making this featured, unset others
      if (isFeatured) {
        videos.forEach(v => {
          if (v.id !== editingVideoId && v.isFeatured) {
            onUpdateVideo({ ...v, isFeatured: false });
          }
        });
      }

      const updatedVideo: Video = {
        id: editingVideoId,
        title_es: titleEs || titleEn || "Vídeo Sin Título",
        title_en: titleEn || titleEs || "Untitled Video",
        description_es: descEs || descEn || "Sin descripción proporcionada.",
        description_en: descEn || descEs || "No description provided.",
        category,
        genre_es: genreEs || "Entretenimiento",
        genre_en: genreEn || "Entertainment",
        duration: duration || "1h 30m",
        poster_url: poster,
        backdrop_url: backdrop,
        streams: finalStreams,
        rating: rating || "G",
        year: year || "2026",
        isCustom: existingVideo ? existingVideo.isCustom : true,
        cast: cast ? cast.split(',').map(c => c.trim()) : ["Cast Member"],
        subtitles: subtitles.length > 0 ? subtitles : undefined,
        episodes: existingEpisodes,
        status: status,
        isFeatured: isFeatured,
        isTrending: isTrending,
        isPopular: isPopular
      };

      onUpdateVideo(updatedVideo);
      setNotification(language === 'es' ? '¡Cambios actualizados con éxito!' : 'Successfully updated changes!');
      setTimeout(() => setNotification(null), 3000);
    } else {
      // If making this featured, unset others
      if (isFeatured) {
        videos.forEach(v => {
          if (v.isFeatured) {
            onUpdateVideo({ ...v, isFeatured: false });
          }
        });
      }

      const newVideo: Video = {
        id: `custom-${Date.now()}`,
        title_es: titleEs || titleEn || "Vídeo Sin Título",
        title_en: titleEn || titleEs || "Untitled Video",
        description_es: descEs || descEn || "Sin descripción proporcionada.",
        description_en: descEn || descEs || "No description provided.",
        category,
        genre_es: genreEs || "Entretenimiento",
        genre_en: genreEn || "Entertainment",
        duration: duration || "1h 30m",
        poster_url: poster,
        backdrop_url: backdrop,
        streams: finalStreams,
        rating: rating || "G",
        year: year || "2026",
        isCustom: true,
        cast: cast ? cast.split(',').map(c => c.trim()) : ["Cast Member"],
        subtitles: subtitles.length > 0 ? subtitles : undefined,
        status: status,
        isFeatured: isFeatured,
        isTrending: isTrending,
        isPopular: isPopular
      };

      onAddVideo(newVideo);
      setNotification(translations.uploadSuccess);
      setTimeout(() => setNotification(null), 4000);
    }

    handleResetForm();
  };

  // Add or update custom Episode to selected Series / Novela
  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeriesId) return;

    const seriesVideo = videos.find(v => v.id === selectedSeriesId);
    if (!seriesVideo) {
      alert(language === 'es' ? 'No se encontró la serie seleccionada' : 'Selected series not found.');
      return;
    }

    if (!epTitleEs && !epTitleEn) {
      alert(language === 'es' ? 'Por favor introduce un título para el episodio' : 'Please provide a title for the episode');
      return;
    }

    const currentEpisodes = seriesVideo.episodes || [];
    let updatedEpisodes: Episode[] = [];

    if (editingEpisodeId) {
      // Editing Mode
      updatedEpisodes = currentEpisodes.map(ep => {
        if (ep.id === editingEpisodeId) {
          return {
            ...ep,
            episodeNumber: epNumber,
            seasonNumber: selectedSeasonNumber,
            title_es: epTitleEs || epTitleEn || `Episodio ${epNumber}`,
            title_en: epTitleEn || epTitleEs || `Episode ${epNumber}`,
            duration: epDuration || "45m",
            release_date: epReleaseDate || "2026",
            poster_url: epPosterUrl.trim() || seriesVideo.poster_url,
            video_url: epVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
          };
        }
        return ep;
      });
      setNotification(language === 'es' ? `¡Episodio S${selectedSeasonNumber}E${epNumber} actualizado exitosamente!` : `Episode updated successfully!`);
    } else {
      // Create/Add Mode
      const newEpisode: Episode = {
        id: `ep-${Date.now()}`,
        episodeNumber: epNumber || (currentEpisodes.length + 1),
        seasonNumber: selectedSeasonNumber,
        title_es: epTitleEs || epTitleEn || `Episodio ${epNumber}`,
        title_en: epTitleEn || epTitleEs || `Episode ${epNumber}`,
        duration: epDuration || "45m",
        release_date: epReleaseDate || "2026",
        poster_url: epPosterUrl.trim() || seriesVideo.poster_url,
        video_url: epVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      };
      updatedEpisodes = [...currentEpisodes, newEpisode];
      setNotification(language === 'es' ? `¡Episodio S${selectedSeasonNumber}E${epNumber} agregado exitosamente!` : `Episode S${selectedSeasonNumber}E${epNumber} added successfully!`);
    }

    // Sort programmatically on save
    const sortedEpisodes = updatedEpisodes.sort((a, b) => {
      if (a.seasonNumber !== b.seasonNumber) {
        return a.seasonNumber - b.seasonNumber;
      }
      return a.episodeNumber - b.episodeNumber;
    });

    const updatedVideo: Video = {
      ...seriesVideo,
      episodes: sortedEpisodes
    };

    onUpdateVideo(updatedVideo);
    setTimeout(() => setNotification(null), 3000);

    // Reset fields
    setEditingEpisodeId(null);
    setEpNumber(prev => editingEpisodeId ? prev : prev + 1);
    setEpTitleEs('');
    setEpTitleEn('');
    setEpPosterUrl('');
  };

  // Load episode info for editing
  const handleLoadEpisodeForEditing = (seriesId: string, ep: Episode) => {
    setSelectedSeriesId(seriesId);
    setEditingEpisodeId(ep.id);
    setSelectedSeasonNumber(ep.seasonNumber);
    setEpNumber(ep.episodeNumber);
    setEpTitleEs(ep.title_es);
    setEpTitleEn(ep.title_en);
    setEpDuration(ep.duration);
    setEpReleaseDate(ep.release_date);
    setEpPosterUrl(ep.poster_url === videos.find(v => v.id === seriesId)?.poster_url ? '' : ep.poster_url);
    setEpVideoUrl(ep.video_url);

    setNotification(language === 'es' ? '¡Campos cargados para edición de capítulo!' : 'Episode fields loaded for editing!');
    setTimeout(() => setNotification(null), 2500);
  };

  // Erase custom Episode from Series
  const handleRemoveEpisode = (seriesId: string, episodeId: string) => {
    const seriesVideo = videos.find(v => v.id === seriesId);
    if (!seriesVideo || !seriesVideo.episodes) return;

    if (confirm(language === 'es' ? '¿Quieres eliminar este episodio?' : 'Do you want to delete this episode?')) {
      const nextEpisodes = seriesVideo.episodes.filter(ep => ep.id !== episodeId);
      
      const updatedVideo: Video = {
        ...seriesVideo,
        episodes: nextEpisodes
      };

      onUpdateVideo(updatedVideo);
      setNotification(language === 'es' ? '¡Episodio eliminado!' : 'Episode deleted!');
      setTimeout(() => setNotification(null), 2500);
    }
  };

  // Filter series and novelas for managing episodes
  const seriesAndNovelas = videos.filter(v => v.category === 'series' || v.category === 'novelas');
  const activeSeriesForEpisodes = videos.find(v => v.id === selectedSeriesId);
  const currentEpisodesForActiveSeries = activeSeriesForEpisodes?.episodes || [];

  // Metrics for the statistics ribbon
  const countMovies = videos.filter(v => v.category === 'movies').length;
  const countSeriesAndNovelas = videos.filter(v => v.category === 'series' || v.category === 'novelas').length;
  const countCustomProps = videos.filter(v => v.isCustom).length;
  const countTotalEpisodes = videos.reduce((sum, v) => sum + (v.episodes ? v.episodes.length : 0), 0);

  return (
    <div id="cms-admin-console" className="bg-[#0f0f12] border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto my-6 shadow-2xl relative overflow-hidden text-white/95 font-sans">
      {/* Absolute brand highlight strip */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#E50914] via-red-500 to-yellow-500" />

      {/* Heading */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914]">
              <Film className="w-6 h-6" />
            </div>
            <div>
              <h2 id="dashboard-main-heading" className="text-xl md:text-2xl font-extrabold tracking-tight">
                {language === 'es' ? 'Consola de Administración Canela' : 'Canela Administration Console'}
              </h2>
              <p className="text-xs text-gray-400">
                {language === 'es' 
                  ? 'Gestiona películas, series de televisión, y sube temporadas/episodios adaptativos.' 
                  : 'Manage motion pictures, TV shows, soap operas, or organize seasons and episodes.'}
              </p>
            </div>
          </div>

          {/* Tab Selection Segments */}
          <div className="flex flex-wrap bg-neutral-900 border border-white/10 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'catalog' ? 'bg-[#E50914] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Catálogo' : 'Catalog'}</span>
            </button>
            <button
              onClick={() => { setActiveTab('add'); handleResetForm(); }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add' ? 'bg-[#E50914] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Agregar' : 'New Video'}</span>
            </button>
            <button
              onClick={() => { setActiveTab('edit'); if (videos.length > 0) handleLoadVideoForEditing(videos[0].id); }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'edit' ? 'bg-[#E50914] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Editar' : 'Edit Existing'}</span>
            </button>
            <button
              onClick={() => setActiveTab('episodes')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'episodes' ? 'bg-[#E50914] text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Episodios' : 'Episodes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CMS METRICS RIBBON */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-3 select-none hover:border-white/10 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-450">{language === 'es' ? 'PELÍCULAS' : 'MOVIES'}</span>
            <Film className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">{countMovies}</span>
            <span className="text-[10px] text-gray-500">{language === 'es' ? 'items' : 'items'}</span>
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-3 select-none hover:border-white/10 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-450">{language === 'es' ? 'SERIES Y NOVELAS' : 'TV SHOWS'}</span>
            <Tv className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">{countSeriesAndNovelas}</span>
            <span className="text-[10px] text-gray-500">{language === 'es' ? 'shows' : 'shows'}</span>
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-3 select-none hover:border-white/10 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-450">{language === 'es' ? 'CARGAS ADMIN' : 'CUSTOM VIDEOS'}</span>
            <Upload className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">{countCustomProps}</span>
            <span className="text-[10px] text-gray-500">{language === 'es' ? 'propios' : 'custom'}</span>
          </div>
        </div>

        <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-3 select-none hover:border-white/10 transition-all">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-450">{language === 'es' ? 'EPISODIOS TOTALES' : 'TOTAL EPISODES'}</span>
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">{countTotalEpisodes}</span>
            <span className="text-[10px] text-gray-500">{language === 'es' ? 'capítulos' : 'chapters'}</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs md:text-sm font-semibold rounded-xl flex items-center gap-2.5 animate-pulse">
          <Check className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* TABS 1 & 2: ADD OR EDIT MOVIE OR SERIES FORMS */}
      {(activeTab === 'add' || activeTab === 'edit') && (
        <form onSubmit={handlePublishOrEdit} className="space-y-6">
          {/* If EDITING TAB, show selector first */}
          {activeTab === 'edit' && (
            <div className="bg-neutral-900/90 border border-white/10 p-5 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                  <span className="text-xs font-bold text-gray-200 uppercase tracking-widest">
                    {language === 'es' ? 'Buscador y Selector de Video a Editar:' : 'Search and Choose Video to Edit:'}
                  </span>
                </div>
                {editingVideoId && (
                  <div className="text-xs text-yellow-400 font-bold bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-md shrink-0">
                    {language === 'es' ? 'Editando actualmente:' : 'Currently editing:'} <span className="text-white">
                      {(() => {
                        const currentEd = videos.find(v => v.id === editingVideoId);
                        return currentEd ? (language === 'es' ? currentEd.title_es : currentEd.title_en) : '';
                      })()}
                    </span>
                  </div>
                )}
              </div>

              {/* SEARCH BOX FOR EASY FILTERING */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'es' ? 'Escribe el nombre de la película o serie para filtrar al instante...' : 'Type film or series title to instantly filter...'}
                  value={editSearchQuery}
                  onChange={(e) => setEditSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-[#E50914] text-xs md:text-sm text-white placeholder:text-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none transition-all"
                />
              </div>

              {/* DISPLAY FILTERED VIDEOS IN A COMPACT SCROLLABLE VISUAL CARD list */}
              {(() => {
                const searchLower = editSearchQuery.toLowerCase().trim();
                const filtered = videos.filter(v => 
                  v.title_es.toLowerCase().includes(searchLower) || 
                  v.title_en.toLowerCase().includes(searchLower) ||
                  v.category.toLowerCase().includes(searchLower)
                );

                if (filtered.length === 0) {
                  return (
                    <p className="text-xs text-red-500 italic py-2 text-center font-bold">
                      {language === 'es' ? 'No se encontraron resultados para tu búsqueda.' : 'No matching videos found.'}
                    </p>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {filtered.map(v => {
                      const isSelected = v.id === editingVideoId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            handleLoadVideoForEditing(v.id);
                          }}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#E50914]/15 border-[#E50914] text-white shadow shadow-red-950/25' 
                              : 'bg-black/45 border-white/5 hover:border-white/15 text-gray-300 hover:text-white hover:bg-white/[0.02]'
                          }`}
                        >
                          <img 
                            src={v.poster_url || "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=200"} 
                            alt={v.title_es} 
                            referrerPolicy="no-referrer"
                            className="w-8 h-11 rounded object-cover shrink-0 bg-neutral-900 border border-white/5"
                          />
                          <div className="min-w-0 flex-1 leading-tight">
                            <span className="text-[9px] px-1 py-0.2 bg-white/5 border border-white/15 rounded text-gray-400 font-bold uppercase tracking-wide block w-max mb-1">
                              {v.category === 'movies' ? (language === 'es' ? 'Película' : 'Movie') : (language === 'es' ? 'Serie' : 'Series')}
                            </span>
                            <p className="text-xs font-black truncate text-white">
                              {language === 'es' ? v.title_es : v.title_en}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium">
                              {v.genre_es || v.year}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Load Sample Presets (Only in Add mode to help testing) */}
          {activeTab === 'add' && (
            <div className="flex flex-wrap items-center gap-2 bg-neutral-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-xs text-yellow-500 font-bold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                 {language === 'es' ? 'Presets rápidos de test:' : 'Fast Presets:'}
              </span>
              <button
                type="button"
                onClick={() => loadPresetSample(1)}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white/90 text-[10px] font-semibold rounded transition-all cursor-pointer"
              >
                {language === 'es' ? 'Película Cosmos' : 'Cosmos Movie'}
              </button>
              <button
                type="button"
                onClick={() => loadPresetSample(2)}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white/90 text-[10px] font-semibold rounded transition-all cursor-pointer"
              >
                {language === 'es' ? 'Fútbol En Directo' : 'Live Soccer'}
              </button>
            </div>
          )}

          {/* Title Dual Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
                {translations.titleEs}
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Sintel: El Comienzo"
                value={titleEs}
                onChange={(e) => setTitleEs(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-600 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
                {translations.titleEn}
              </label>
              <input
                type="text"
                placeholder="e.g. Sintel: The Beginning"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-600 text-white"
              />
            </div>
          </div>

          {/* Descriptions Dual Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
                {translations.descEs}
              </label>
              <textarea
                rows={3}
                placeholder="Escribe la sinopsis en español..."
                value={descEs}
                onChange={(e) => setDescEs(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-600 resize-none text-white text-xs leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
                {translations.descEn}
              </label>
              <textarea
                rows={3}
                placeholder="Write the English synopsis..."
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-600 resize-none text-white text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* INTERACTIVE VISUAL CATEGORY CARD PICKER */}
          <div className="bg-neutral-900/40 border border-white/5 p-4 rounded-xl space-y-3">
            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              {translations.category}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'movies', label: translations.movies, icon: Film, bg: 'hover:border-red-500 hover:text-red-400' },
                { id: 'series', label: translations.series, icon: Tv, bg: 'hover:border-blue-500 hover:text-blue-400' },
                { id: 'novelas', label: translations.novelas, icon: Heart, bg: 'hover:border-pink-500 hover:text-pink-400' },
                { id: 'sports', label: translations.sports, icon: Trophy, bg: 'hover:border-yellow-500 hover:text-yellow-400' },
                { id: 'kids', label: translations.kids, icon: Smile, bg: 'hover:border-green-500 hover:text-green-400' }
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id as any)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#E50914] border-[#E50914] text-white shadow-lg bg-gradient-to-r from-[#E50914] to-red-650 scale-[1.03] font-black'
                        : `bg-black/30 border-white/10 text-gray-400 ${item.bg}`
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metadata Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.year}</label>
              <input
                type="text"
                placeholder="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.rating}</label>
              <input
                type="text"
                placeholder="PG-13 / TV-MA"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.duration}</label>
              <input
                type="text"
                placeholder="e.g. 1h 45m"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{language === 'es' ? 'Fondo Banner' : 'Wide Banner URL'}</label>
              <input
                type="text"
                placeholder="https://..."
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.posterUrl}</label>
              <input
                type="text"
                placeholder="https://..."
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
              />
            </div>
          </div>

          {/* Casting and Genres block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.cast}</label>
              <input
                type="text"
                placeholder="Ej: Pedro Infante, Sofia Vergara, Diego Luna"
                value={cast}
                onChange={(e) => setCast(e.target.value)}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm outline-none transition-all text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
                {language === 'es' ? 'Género' : 'Genre'}
              </label>
              <input
                type="text"
                placeholder="Drama, Comedia"
                value={language === 'es' ? genreEs : genreEn}
                onChange={(e) => {
                  setGenreEs(e.target.value);
                  setGenreEn(e.target.value);
                }}
                className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-sm outline-none transition-all text-white"
              />
            </div>
          </div>

          {/* CURATION & CMS CONTROL PANEL (IMAGE A/B PRO COMPONENT) */}
          <div className="bg-neutral-900/85 border border-white/5 p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-black tracking-widest text-[#E50914] uppercase flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span>{language === 'es' ? 'Controles de Contenido (CMS)' : 'CMS Content Control'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              {/* STATUS */}
              <div className="bg-black/40 border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-200 uppercase mb-1 flex items-center gap-1.5">
                    {status === 'published' ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span>{language === 'es' ? 'Estado' : 'Status'}</span>
                  </h4>
                  <p className="text-[10px] text-gray-500 mb-2">
                    {language === 'es' ? 'Los borradores solo son visibles para administradores.' : 'Drafts are hidden from normal users.'}
                  </p>
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="bg-neutral-900 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-[#E50914] w-full cursor-pointer font-bold"
                >
                  <option value="published" className="text-emerald-400 font-bold">{language === 'es' ? '🟢 Publicado' : '🟢 Published'}</option>
                  <option value="draft" className="text-amber-500 font-bold">{language === 'es' ? '🟡 Borrador (Draft)' : '🟡 Draft'}</option>
                </select>
              </div>

              {/* FEATURED IN HERO BANNER */}
              <label className="bg-black/40 border border-white/5 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-white/10 select-none">
                <div className="space-y-0.5 pr-2">
                  <h4 className="text-xs font-bold text-gray-200 uppercase flex items-center gap-1.5">
                    <Star className={`w-3.5 h-3.5 ${isFeatured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-450'}`} />
                    <span>{language === 'es' ? 'Destacado' : 'Featured Hero'}</span>
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    {language === 'es' ? 'Fuerza a este título a ser la portada Slider principal.' : 'Promote this video to be the main home hero slider.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#E50914]"
                />
              </label>

              {/* IS TRENDING BADGE */}
              <label className="bg-black/40 border border-white/5 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-white/10 select-none">
                <div className="space-y-0.5 pr-2">
                  <h4 className="text-xs font-bold text-gray-200 uppercase flex items-center gap-1.5">
                    <TrendingUp className={`w-3.5 h-3.5 ${isTrending ? 'text-red-500' : 'text-gray-450'}`} />
                    <span>{language === 'es' ? 'Tendencia' : 'Trending'}</span>
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    {language === 'es' ? 'Añade distintivo "Tendencia" y prioridad en catalogación.' : 'Adds "Trending" tags and boosts rank in homepage shelves.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#E50914]"
                />
              </label>

              {/* IS POPULAR BADGE */}
              <label className="bg-black/40 border border-white/5 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-white/10 select-none">
                <div className="space-y-0.5 pr-2">
                  <h4 className="text-xs font-bold text-gray-200 uppercase flex items-center gap-1.5">
                    <Flame className={`w-3.5 h-3.5 ${isPopular ? 'text-amber-500 fill-amber-500' : 'text-gray-455'}`} />
                    <span>{language === 'es' ? 'Popular' : 'Popular'}</span>
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    {language === 'es' ? 'Coloca el título en la estantería "Más Populares".' : 'Places this video inside the "Most Popular" shelves.'}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-[#E50914]"
                />
              </label>
            </div>
          </div>

          {/* Media source type picker */}
          <div className="border bg-black/60 border-white/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-xs font-bold tracking-wider uppercase text-red-500">
                {language === 'es' ? 'Enlaces Web o Archivo de Video' : 'Video Web Streams or Local File'}
              </h3>
              {activeTab === 'add' && (
                <div className="flex bg-neutral-800 p-1 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setSourceType('file')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      sourceType === 'file' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {language === 'es' ? 'Archivo Local' : 'Local File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceType('url')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      sourceType === 'url' ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {language === 'es' ? 'Enlaces URL' : 'URLs'}
                  </button>
                </div>
              )}
            </div>

            {/* LOCAL FILE CHOOSE SECTION with Drag and Drop */}
            {sourceType === 'file' && activeTab === 'add' && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-white/10 hover:border-[#E50914]/50 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center gap-3 bg-neutral-900/40 relative ${
                  dragActive ? 'border-red-500 bg-red-500/5' : ''
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="p-3 bg-neutral-800 rounded-full text-gray-400 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-sans">
                  {localFile ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 justify-center">
                      <Check className="w-4 h-4" />
                      {translations.customVideoFile} <span className="text-white italic">{localFile.name}</span>
                    </span>
                  ) : (
                    <p className="text-gray-400 font-semibold">{translations.dragAndDropVideo}</p>
                  )}
                </div>
              </div>
            )}

            {/* ONLINE STREAMS MULTIPLE QUALITY (Bitrates) FORM SENSOR */}
            {(sourceType === 'url' || activeTab === 'edit') && (
              <div className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.video1080p}</label>
                    <input
                      type="url"
                      placeholder="https://example.com/movie_1080p.mp4"
                      value={video1080}
                      onChange={(e) => setVideo1080(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.video720p}</label>
                    <input
                      type="url"
                      placeholder="https://example.com/movie_720p.mp4"
                      value={video720}
                      onChange={(e) => setVideo720(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.video480p}</label>
                    <input
                      type="url"
                      placeholder="https://example.com/movie_480p.mp4"
                      value={video480}
                      onChange={(e) => setVideo480(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs outline-none transition-all text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtitles custom tracks VTT textboxes */}
          <div className="border bg-black/40 border-white/5 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-red-500">
              {translations.subtitlesLabel}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.subtitlesEs}</label>
                <textarea
                  rows={2}
                  placeholder={`WEBVTT\n\n1\n00:00:01.000 --> 00:00:05.000\n¡Disfruta en Canela TV!`}
                  value={customVttEs}
                  onChange={(e) => setCustomVttEs(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-xs font-mono outline-none transition-all placeholder:text-gray-700 resize-none text-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">{translations.subtitlesEn}</label>
                <textarea
                  rows={2}
                  placeholder={`WEBVTT\n\n1\n00:00:01.000 --> 00:00:05.000\nEnjoy on Canela TV!`}
                  value={customVttEn}
                  onChange={(e) => setCustomVttEn(e.target.value)}
                  className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-3 py-2 text-xs font-mono outline-none transition-all placeholder:text-gray-700 resize-none text-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Toggle submit text */}
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-red-700 text-white font-sans font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-950/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            <span>
              {activeTab === 'edit'
                ? (language === 'es' ? 'Guardar Cambios Editados' : 'Save Video Details')
                : translations.submit
              }
            </span>
          </button>
        </form>
      )}

      {/* TAB 3: DEDICATED SEASONS AND EPISODES CREATION & DELETION GRID */}
      {activeTab === 'episodes' && (
        <div className="space-y-6">
          <div className="p-5 bg-neutral-900/95 border border-white/10 rounded-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#E50914]" />
                  <span>{language === 'es' ? '1. Selecciona o Busca la Serie o Novela:' : '1. Search & Select Series or Soap Opera:'}</span>
                </span>
                <span className="text-[10px] text-gray-400">
                  {language === 'es' ? 'Filtra por nombre y haz clic para cargar sus temporadas y capítulos.' : 'Filter by name and click to configure seasons and episodes.'}
                </span>
              </div>
              {selectedSeriesId && activeSeriesForEpisodes && (
                <div className="text-xs text-yellow-400 font-bold bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-md">
                  {language === 'es' ? 'Gestionando ahora:' : 'Managing now:'} <span className="text-white">{language === 'es' ? activeSeriesForEpisodes.title_es : activeSeriesForEpisodes.title_en}</span>
                </div>
              )}
            </div>

            {seriesAndNovelas.length === 0 ? (
              <p className="text-xs text-red-400 font-bold italic py-4 text-center">
                {language === 'es' ? '¡Por favor agrega primero una serie!' : 'Please upload a series first!'}
              </p>
            ) : (
              <div className="space-y-3">
                {/* Search box */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'es' ? 'Buscar serie/novela por nombre...' : 'Search series/show by title...'}
                    value={episodeSeriesSearchQuery}
                    onChange={(e) => setEpisodeSeriesSearchQuery(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 hover:border-white/20 focus:border-[#E50914] text-xs text-white placeholder:text-gray-500 rounded-lg pl-9 pr-4 py-2 outline-none transition-all"
                  />
                </div>

                {/* Grid layout */}
                {(() => {
                  const queryLower = episodeSeriesSearchQuery.toLowerCase().trim();
                  const filtered = seriesAndNovelas.filter(s => 
                    s.title_es.toLowerCase().includes(queryLower) || 
                    s.title_en.toLowerCase().includes(queryLower)
                  );

                  if (filtered.length === 0) {
                    return (
                      <p className="text-xs text-red-400 italic py-2 text-center">
                        {language === 'es' ? 'No se encontraron series para este término.' : 'No matching series.'}
                      </p>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 py-1 max-h-[160px] overflow-y-auto pr-1">
                      {filtered.map(s => {
                        const isSelected = s.id === selectedSeriesId;
                        const epCount = s.episodes ? s.episodes.length : 0;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedSeriesId(s.id)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#E50914]/15 border-[#E50914] text-white shadow shadow-red-950/30' 
                                : 'bg-black/45 border-white/5 hover:border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.02]'
                            }`}
                          >
                            <img 
                              src={s.poster_url || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200"} 
                              alt={s.title_es}
                              referrerPolicy="no-referrer"
                              className="w-8 h-11 rounded object-cover shrink-0 bg-neutral-900 border border-white/5"
                            />
                            <div className="min-w-0 flex-1 leading-tight">
                              <p className="text-xs font-black truncate text-white">
                                {language === 'es' ? s.title_es : s.title_en}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {language === 'es' ? `${epCount} capítulos` : `${epCount} episodes`}
                              </p>
                              <span className="text-[9px] text-[#E50914] font-bold mt-1 uppercase block tracking-wider">
                                {s.category === 'novelas' ? (language === 'es' ? 'Novela' : 'Soap Opera') : (language === 'es' ? 'Serie' : 'TV Series')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {activeSeriesForEpisodes && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* 1-CLICK DEMO CHAPTERS FILLER BANNER */}
              <div className="bg-neutral-900/40 border border-[#E50914]/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl select-none">
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-black text-white tracking-wide uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E50914] animate-pulse" />
                    <span>{language === 'es' ? 'Relleno de Demostración con 1-Clic' : '1-Click Demo Episode Filler'}</span>
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                    {language === 'es' 
                      ? '¿Quieres probar el reproductor y el selector de episodios al instante sin rellenar formularios? Sube automáticamente 12 capítulos ordenados en la Temporada 1, con nombres reales y enlaces .mp4 listos para verse.'
                      : 'Load 12 beautifully titled, chronological demo chapters for Season 1 into this series instantly. Ideal for viewing the media player in action without tedious form entry.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const titles_es_pool = [
                      "El Reencuentro Inesperado", "La Gran Traición", "Secreto de Familia", "La Sospecha Crece", "Un Amor Prohibido",
                      "Desenmascarados en la Mansión", "Dinero Sucio", "La Huida Nocturna", "Confesión bajo la Lluvia", "El Juicio Final",
                      "Consecuencias Crueles", "La Gran Final (Fin de Temporada)"
                    ];
                    
                    const titles_en_pool = [
                      "The Unexpected Reunion", "The Ultimate Betrayal", "Family Secret", "Rising Suspicion", "A Forbidden Love",
                      "Unmasked in the Mansion", "Dirty Money", "Night Escape", "Confession in the Rain", "The Ultimate Trial",
                      "Cruel Consequences", "The Grand Finale (Season Finale)"
                    ];

                    const demoEpisodes: Episode[] = [];
                    const durations = ["42m", "45m", "47m", "43m", "44m", "46m", "45m", "48m", "41m", "44m", "46m", "52m"];
                    const posters = [
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
                      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
                      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400",
                      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400"
                    ];

                    for (let i = 1; i <= 12; i++) {
                      const postIdx = i % posters.length;
                      demoEpisodes.push({
                        id: `ep-demo-${Date.now()}-${i}`,
                        episodeNumber: i,
                        seasonNumber: 1,
                        title_es: titles_es_pool[i - 1],
                        title_en: titles_en_pool[i - 1],
                        duration: durations[i - 1],
                        release_date: "2026",
                        poster_url: posters[postIdx],
                        video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      });
                    }

                    const updatedVideo: Video = {
                      ...activeSeriesForEpisodes,
                      episodes: demoEpisodes
                    };

                    onUpdateVideo(updatedVideo);
                    setNotification(language === 'es' ? '¡Se han generado de forma masiva 12 episodios de demostración!' : '12 Demo episodes bulk generated!');
                    setTimeout(() => setNotification(null), 3000);
                  }}
                  className="bg-neutral-950 border border-[#E50914] text-white hover:bg-[#E50914] hover:text-white font-sans text-xs font-bold py-2.5 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow active:scale-95 shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-spin-slow" />
                  <span>{language === 'es' ? 'Auto-rellenar 12 Capítulos' : 'Auto-fill 12 Chapters'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* FORM TO ADD EPISODES */}
              <form onSubmit={handleAddEpisode} className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-4">
                <h3 className="text-sm font-black text-white tracking-wider uppercase border-b border-white/5 pb-2 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#E50914]" />
                  <span>{language === 'es' ? 'Añadir Nuevo Episodio' : 'Add New Episode'}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {language === 'es' ? 'Temporada Nº' : 'Season Number'}
                    </label>
                    <select
                      value={selectedSeasonNumber}
                      onChange={(e) => setSelectedSeasonNumber(parseInt(e.target.value))}
                      className="w-full bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#E50914]"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>
                          {language === 'es' ? `Temporada ${num}` : `Season ${num}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {language === 'es' ? 'Capítulo / Episodio Nº' : 'Episode Number'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={epNumber}
                      onChange={(e) => setEpNumber(parseInt(e.target.value) || 1)}
                      className="w-full bg-black border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#E50914]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {language === 'es' ? 'Título Episodio (Español)' : 'Episode Title (Spanish)'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: El Regreso del Héroe"
                      value={epTitleEs}
                      onChange={(e) => setEpTitleEs(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {language === 'es' ? 'Título Episodio (Inglés)' : 'Episode Title (English)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Hero Returns"
                      value={epTitleEn}
                      onChange={(e) => setEpTitleEn(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {language === 'es' ? 'Duración' : 'Duration'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45m"
                      value={epDuration}
                      onChange={(e) => setEpDuration(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {language === 'es' ? 'Fecha de Lanzamiento' : 'Release Year'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2026"
                      value={epReleaseDate}
                      onChange={(e) => setEpReleaseDate(e.target.value)}
                      className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {language === 'es' ? 'URL de Imagen Foto Episodio poster (Unsplash/Web)' : 'Episode Backdrop Picture URL'}
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={epPosterUrl}
                    onChange={(e) => setEpPosterUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-gray-700"
                  />
                  <span className="text-[9px] text-gray-500 mt-0.5 block">
                    {language === 'es' ? '*Dejar vacío para heredar póster de la serie.' : '*Leave empty to inherit the series poster.'}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {language === 'es' ? 'URL de Enlace de Video Streaming (.mp4)' : 'Video Stream URL (.mp4)'}
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={epVideoUrl}
                    onChange={(e) => setEpVideoUrl(e.target.value)}
                    className="w-full bg-black border border-white/10 focus:border-[#E50914] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>

                {editingEpisodeId && (
                  <div className="p-3 bg-yellow-550/10 border border-yellow-500/20 text-yellow-500 text-xs font-semibold rounded-lg flex items-center justify-between select-none animate-fadeIn">
                    <span className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-yellow-500" />
                      <span>{language === 'es' ? 'Editando Episodio Cargado' : 'Editing Loaded Episode'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEpisodeId(null);
                        setEpTitleEs('');
                        setEpTitleEn('');
                        setEpPosterUrl('');
                        setEpNumber(currentEpisodesForActiveSeries.length + 1);
                      }}
                      className="text-[10px] bg-yellow-500/20 text-yellow-400 font-bold px-2 py-0.5 rounded-md hover:bg-yellow-500/30 font-sans"
                    >
                      {language === 'es' ? 'Cancelar' : 'Cancel'}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-2 mt-4 ${
                    editingEpisodeId ? 'bg-yellow-600 hover:bg-yellow-750' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {editingEpisodeId ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  <span>
                    {editingEpisodeId 
                      ? (language === 'es' ? 'Guardar Cambios de Episodio' : 'Save Episode Changes')
                      : (language === 'es' ? 'Confirmar Añadir Episodio' : 'Save New Episode')
                    }
                  </span>
                </button>
              </form>

              {/* VIEW EPISODES GRID SCROLLER WITH REMOVAL ENGINE */}
              <div className="bg-black/20 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-white tracking-wider uppercase border-b border-white/5 pb-2 flex items-center justify-between">
                    <span>{language === 'es' ? 'Episodios Cargados' : 'Loaded Episodes list'}</span>
                    <span className="bg-[#E50914]/20 border border-[#E50914]/30 text-white text-xs px-2.5 py-0.5 rounded-full font-mono">
                      {currentEpisodesForActiveSeries.length}
                    </span>
                  </h3>

                  {currentEpisodesForActiveSeries.length === 0 ? (
                    <div className="py-20 text-center space-y-2">
                      <VideoIcon className="w-8 h-8 text-gray-600 mx-auto animate-pulse" />
                      <p className="text-xs text-gray-500 italic max-w-xs mx-auto">
                        {language === 'es' 
                          ? 'Esta serie no tiene episodios cargados en el localStorage. Agrega uno usando el formulario izquierdo o se auto-generarán demos al ver detalles.' 
                          : 'No custom episodes loaded for this series yet in storage.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 mt-3">
                      {currentEpisodesForActiveSeries.map((ep) => {
                        const isCurrentEditing = editingEpisodeId === ep.id;
                        return (
                          <div
                            key={ep.id}
                            className={`flex gap-3 border rounded-xl p-3 items-center justify-between transition-all ${
                              isCurrentEditing 
                                ? 'bg-yellow-500/5 border-yellow-500/40 shadow-inner' 
                                : 'bg-neutral-900 border border-white/5'
                            }`}
                          >
                            <div className="flex gap-2.5 items-center min-w-0">
                              <img
                                referrerPolicy="no-referrer"
                                src={ep.poster_url}
                                alt={ep.title_es}
                                className="w-12 h-8 object-cover rounded bg-black border border-white/5"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate text-white">
                                  {language === 'es' ? ep.title_es : ep.title_en}
                                </p>
                                <p className="text-[9px] text-gray-500 font-semibold tracking-wider font-mono">
                                  T{ep.seasonNumber}E{ep.episodeNumber} • {ep.duration} • {ep.release_date}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleLoadEpisodeForEditing(selectedSeriesId, ep)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  isCurrentEditing 
                                    ? 'bg-yellow-500 text-black font-bold' 
                                    : 'hover:bg-neutral-850 text-gray-400 hover:text-yellow-500'
                                }`}
                                title={language === 'es' ? 'Editar Episodio' : 'Edit Episode'}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveEpisode(selectedSeriesId, ep.id)}
                                className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar Episodio"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 leading-normal flex items-start gap-1.5">
                  <Info className="w-4 h-4 shrink-0 text-[#E50914]" />
                  <p>
                    {language === 'es'
                      ? 'Los episodios se ordenan dinámicamente según la temporada y número de capítulo al guardarse.'
                      : 'Episodes are sorted programmatically based on season and number upon storage.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 4: ADVANCED CATALOG MEDIA CMS DATABASE AND LIVE TOGGLES */}
      {activeTab === 'catalog' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Controls */}
          <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'es' ? 'Buscar en base de datos...' : 'Search database by title/id...'}
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-[#E50914] placeholder:text-gray-650"
                />
              </div>

              {/* Category Filter */}
              <select
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="all">{language === 'es' ? 'Todas las Categorías' : 'All Categories'}</option>
                <option value="movies">{translations.movies}</option>
                <option value="series">{translations.series}</option>
                <option value="novelas">{translations.novelas}</option>
                <option value="sports">{translations.sports}</option>
                <option value="kids">{translations.kids}</option>
              </select>

              {/* Publish Stat filter */}
              <select
                value={catalogStatus}
                onChange={(e) => setCatalogStatus(e.target.value)}
                className="bg-black border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 outline-none focus:border-[#E50914] cursor-pointer"
              >
                <option value="all">{language === 'es' ? 'Todos los Estados' : 'All Statuses'}</option>
                <option value="published">{language === 'es' ? '🟢 Publicados' : '🟢 Published Only'}</option>
                <option value="draft">{language === 'es' ? '🟡 Borradores (Draft)' : '🟡 Drafts Only'}</option>
              </select>
            </div>

            {/* Reset Defaults Database button */}
            <button
              type="button"
              onClick={() => {
                if (confirm(language === 'es' 
                  ? '¿Quieres restablecer la biblioteca de Canela a los títulos originales predeterminados de fábrica? Esto eliminará tus cargas.' 
                  : 'Do you want to reset the entire Canela library back to factory defaults? Your custom uploads will be cleared.')) {
                  localStorage.removeItem('canela_videos');
                  localStorage.removeItem('canela_reviews');
                  window.location.reload();
                }
              }}
              className="p-1.5 border border-dashed border-red-500/30 hover:border-red-500 rounded-lg text-[10px] text-red-500 font-extrabold hover:bg-red-500/10 transition-all flex items-center gap-1 cursor-pointer shrink-0 font-sans"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-500 font-bold" />
              <span>{language === 'es' ? 'Recuperar Catálogo Original' : 'Reset Defaults'}</span>
            </button>
          </div>

          {/* Table list of database items */}
          <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/40">
            <div className="p-4 bg-neutral-900/60 border-b border-white/5 flex items-center justify-between text-xs tracking-widest text-gray-400 font-bold uppercase select-none">
              <span>{language === 'es' ? 'Catálogo de Videos Disponibles:' : 'Current video files:'}</span>
              <span className="font-mono text-[10px] lowercase text-[#E50914] font-semibold">
                {
                  videos.filter(v => {
                    const matchesSearch = !catalogSearch || v.title_es.toLowerCase().includes(catalogSearch.toLowerCase()) || v.title_en.toLowerCase().includes(catalogSearch.toLowerCase()) || v.id.toLowerCase().includes(catalogSearch.toLowerCase());
                    const matchesCategory = catalogCategory === 'all' || v.category === catalogCategory;
                    const matchesStatus = catalogStatus === 'all' || (catalogStatus === 'draft' && v.status === 'draft') || (catalogStatus === 'published' && v.status !== 'draft');
                    return matchesSearch && matchesCategory && matchesStatus;
                  }).length
                } {language === 'es' ? 'resultados' : 'items filtered'}
              </span>
            </div>

            <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto pr-1">
              {videos.filter(v => {
                const matchesSearch = !catalogSearch || v.title_es.toLowerCase().includes(catalogSearch.toLowerCase()) || v.title_en.toLowerCase().includes(catalogSearch.toLowerCase()) || v.id.toLowerCase().includes(catalogSearch.toLowerCase());
                const matchesCategory = catalogCategory === 'all' || v.category === catalogCategory;
                const matchesStatus = catalogStatus === 'all' || (catalogStatus === 'draft' && v.status === 'draft') || (catalogStatus === 'published' && v.status !== 'draft');
                return matchesSearch && matchesCategory && matchesStatus;
              }).length === 0 ? (
                <div className="py-24 text-center text-gray-500 text-xs italic">
                  {language === 'es' ? 'No se encontraron títulos coincidiendo con la búsqueda' : 'No titles matching your filter settings.'}
                </div>
              ) : (
                videos.filter(v => {
                  const matchesSearch = !catalogSearch || v.title_es.toLowerCase().includes(catalogSearch.toLowerCase()) || v.title_en.toLowerCase().includes(catalogSearch.toLowerCase()) || v.id.toLowerCase().includes(catalogSearch.toLowerCase());
                  const matchesCategory = catalogCategory === 'all' || v.category === catalogCategory;
                  const matchesStatus = catalogStatus === 'all' || (catalogStatus === 'draft' && v.status === 'draft') || (catalogStatus === 'published' && v.status !== 'draft');
                  return matchesSearch && matchesCategory && matchesStatus;
                }).map(vid => {
                  const isDraft = vid.status === 'draft';
                  const isFeat = vid.isFeatured;
                  const isTrend = vid.isTrending;
                  const isPop = vid.isPopular;

                  return (
                    <div 
                      key={vid.id}
                      className="p-3 bg-neutral-900/40 hover:bg-[#111115] transition-all flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs"
                    >
                      {/* Left thumbnail & metadata */}
                      <div className="flex gap-3 items-center w-full sm:w-auto min-w-0">
                        <img
                          referrerPolicy="no-referrer"
                          src={vid.poster_url}
                          alt={vid.title_es}
                          className="w-9 h-12 object-cover rounded bg-neutral-800 border border-white/10 shrink-0 select-none shadow"
                        />
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-gray-100 truncate flex items-center gap-1.5 pb-0.5">
                            <span className="truncate">{language === 'es' ? vid.title_es : vid.title_en}</span>
                            {vid.isCustom && (
                              <span className="bg-purple-605 border border-purple-500/30 text-purple-400 text-[8px] px-1.5 py-px rounded uppercase select-none font-sans font-black shrink-0">
                                {language === 'es' ? 'Admin' : 'Custom'}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] text-gray-450 font-semibold tracking-wide flex items-center gap-1 select-none font-mono">
                            <span className="capitalize text-yellow-500 font-sans">{vid.category}</span>
                            <span>•</span>
                            <span>{vid.year}</span>
                            <span>•</span>
                            <span>{vid.duration}</span>
                          </p>
                          <p className="text-[9px] text-gray-500 truncate select-all font-mono mt-0.5 max-w-[200px]">ID: {vid.id}</p>
                        </div>
                      </div>

                      {/* Middle CMS Quick Switches */}
                      <div className="flex flex-wrap items-center gap-2 select-none w-full sm:w-auto justify-start sm:justify-end">
                        {/* Interactive Status Switch Badge */}
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = isDraft ? 'published' : 'draft';
                            onUpdateVideo({ ...vid, status: nextStatus });
                            setNotification(language === 'es' 
                              ? `¡${language === 'es' ? vid.title_es : vid.title_en} en ${nextStatus === 'draft' ? 'Borrador 🟡' : 'Publicado 🟢'}!` 
                              : `Status toggled successfully!`);
                            setTimeout(() => setNotification(null), 1500);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide border transition-all cursor-pointer flex items-center gap-1 ${
                            isDraft
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 hover:bg-amber-500/25'
                              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                          }`}
                          title={language === 'es' ? 'Alternar Visibilidad (Publicado/Borrador)' : 'Toggle visibility (Published/Draft)'}
                        >
                          {isDraft ? <EyeOff className="w-3 h-3 shrink-0" /> : <Eye className="w-3 h-3 shrink-0" />}
                          <span>{isDraft ? (language === 'es' ? 'Borrador' : 'Draft') : (language === 'es' ? 'Publicado' : 'Published')}</span>
                        </button>

                        {/* Interactive Featured Banner Toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!isFeat) {
                              // Unset other features first
                              videos.forEach(ov => {
                                if (ov.id !== vid.id && ov.isFeatured) {
                                  onUpdateVideo({ ...ov, isFeatured: false });
                                }
                              });
                            }
                            onUpdateVideo({ ...vid, isFeatured: !isFeat });
                            setNotification(language === 'es' 
                              ? `¡${language === 'es' ? vid.title_es : vid.title_en} fijado como Héroe! ⭐` 
                              : `Featured landing flag updated!`);
                            setTimeout(() => setNotification(null), 1500);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide border transition-all cursor-pointer flex items-center gap-1 ${
                            isFeat
                              ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/25'
                              : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-700 hover:text-white'
                          }`}
                          title={language === 'es' ? 'Establecer Portada Principal Héroe' : 'Toggle Featured Banner'}
                        >
                          <Star className={`w-3 h-3 shrink-0 ${isFeat ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          <span>{language === 'es' ? 'Destacado' : 'Featured'}</span>
                        </button>

                        {/* Interactive Trending Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateVideo({ ...vid, isTrending: !isTrend });
                            setNotification(language === 'es' ? '¡Tendencias Actualizadas!' : 'Trending state updated!');
                            setTimeout(() => setNotification(null), 1500);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide border transition-all cursor-pointer flex items-center gap-1 ${
                            isTrend
                              ? 'bg-red-500/15 border-red-500/40 text-red-500 hover:bg-red-500/25'
                              : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-700 hover:text-white'
                          }`}
                        >
                          <TrendingUp className="w-3 h-3 shrink-0" />
                          <span>{language === 'es' ? 'Tendencia' : 'Trending'}</span>
                        </button>

                        {/* Interactive Popular Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateVideo({ ...vid, isPopular: !isPop });
                            setNotification(language === 'es' ? '¡Estantería Más Popular actualizada!' : 'Popular landing flag updated!');
                            setTimeout(() => setNotification(null), 1500);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide border transition-all cursor-pointer flex items-center gap-1 ${
                            isPop
                              ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 hover:bg-amber-500/25'
                              : 'bg-neutral-800 border-white/5 text-gray-400 hover:bg-neutral-700 hover:text-white'
                          }`}
                        >
                          <Flame className="w-3 h-3 shrink-0" />
                          <span>{language === 'es' ? 'Popular' : 'Popular'}</span>
                        </button>
                      </div>

                      {/* Right Detail Operations */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        {/* Edit metadata */}
                        <button
                          type="button"
                          onClick={() => {
                            handleLoadVideoForEditing(vid.id);
                            setActiveTab('edit');
                          }}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-yellow-500 text-[10px] font-bold text-gray-200 hover:text-neutral-950 rounded transition-all cursor-pointer flex items-center gap-0.5 shadow-sm"
                          title="Load Info into Edit Template Tab"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{language === 'es' ? 'Editar' : 'Edit'}</span>
                        </button>

                        {/* Delete video */}
                        <button
                          type="button"
                          onClick={() => {
                            const vidTitle = language === 'es' ? vid.title_es : vid.title_en;
                            const confirmMsg = language === 'es'
                              ? `¿Estás seguro de que quieres eliminar "${vidTitle}" de la biblioteca?`
                              : `Are you sure you want to remove "${vidTitle}" from catalog?`;
                            if (confirm(confirmMsg)) {
                              onRemoveVideo(vid.id);
                              setNotification(language === 'es' ? '¡Vídeo eliminado!' : 'Video removed successfully!');
                              setTimeout(() => setNotification(null), 2500);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-all cursor-pointer"
                          title="Delete Video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CUSTOM UPLOADS LIST */}
      {activeTab !== 'episodes' && activeTab !== 'catalog' && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-sm font-bold mb-3 tracking-wide flex items-center gap-2 select-none">
            <span>{translations.customUploads}</span>
            <span className="bg-[#E50914]/15 border border-[#E50914]/30 text-white rounded-full text-xs px-2.5 py-0.5 font-mono">
              {customVideos.length}
            </span>
          </h3>

          {customVideos.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-2 leading-relaxed">
              {translations.noCustomUploads}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="flex gap-2.5 bg-black/60 border border-white/5 rounded-xl p-2.5 items-center justify-between"
                >
                  <div className="flex gap-2.5 items-center min-w-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={vid.poster_url}
                      alt={language === 'es' ? vid.title_es : vid.title_en}
                      className="w-9 h-12 object-cover rounded bg-neutral-800 border border-white/10 select-none shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-white">
                        {language === 'es' ? vid.title_es : vid.title_en}
                      </p>
                      <p className="text-[9px] text-gray-400 font-mono tracking-widest uppercase truncate">
                        {vid.category} | {vid.year} | {vid.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleLoadVideoForEditing(vid.id)}
                      className="p-1 px-2.5 bg-neutral-800 hover:bg-[#E50914]/80 text-[10px] text-gray-300 hover:text-white font-semibold rounded transition-colors cursor-pointer"
                    >
                      {language === 'es' ? 'Editar' : 'Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveVideo(vid.id)}
                      className="p-1.5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
