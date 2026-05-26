import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Loader2,
  Check,
  RotateCcw,
  RotateCw,
  AppWindow,
  Cast,
  Settings,
  Tv,
  Sparkles,
  Info,
  HelpCircle,
  Eye,
  Activity,
  Heart,
  Sliders,
  SkipForward,
  Keyboard
} from 'lucide-react';
import { Video, Language, Episode } from '../types';

interface JWPlayerProps {
  video: Video;
  language: Language;
  isTheater: boolean;
  onToggleTheater: () => void;
  onNextVideo?: () => void;
  onUpdateActiveVideo?: (video: Video) => void;
  onClose: () => void;
  activeEpisode?: Episode | null;
  onPlayEpisode?: (episode: Episode) => void;
  isLiveStream?: boolean;
  isTvModeInitial?: boolean;
}

// 6 Classic Golden Age movies matching Screenshot 1
const RECO_VIDEOS = [
  {
    id: "v-class-mujer-sin-alma",
    title_es: "la MUJER SIN ALMA",
    title_en: "The Woman Without a Soul",
    description_es: "Una obra cumbre del melodrama de la Época de Oro, donde María Félix encarna a la implacable Teresa en una lucha de pasiones, orgullo y ambición desenfrenada.",
    description_en: "A masterpiece of Golden Age melodrama, featuring María Félix as the ruthless Teresa in a struggle of passion, pride, and unchecked ambition.",
    category: "movies" as const,
    genre_es: "Drama, Romance, Classic",
    genre_en: "Drama, Romance, Classic",
    duration: "1h 55m",
    poster_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400",
    rating: "PG",
    year: "1944",
    cast: ["María Félix", "Fernando Soler", "Andrés Soler"],
    streams: [{ label: "Auto" as const, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }]
  },
  {
    id: "v-class-el-surdo",
    title_es: "EL SURDO",
    title_en: "The Left-Handed One",
    description_es: "Antonio Espino 'Clavillazo' desata las risas más locas en esta divertida joya de enredos rurales y destreza física.",
    description_en: "Antonio Espino 'Clavillazo' unleashes the funniest laughter in this classic comedic gem of rural entanglements.",
    category: "movies" as const,
    genre_es: "Comedy, Drama, Classic",
    genre_en: "Comedy, Drama, Classic",
    duration: "1h 32m",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400",
    rating: "PG",
    year: "1954",
    cast: ["Antonio Espino Clavillazo", "Lilia Prado"],
    streams: [{ label: "Auto" as const, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }]
  },
  {
    id: "v-class-la-alegre-casada",
    title_es: "la ALEGRE CASADA",
    title_en: "The Cheerful Married Woman",
    description_es: "Domingo Soler encabeza un maravilloso elenco de comedia familiar y romance de mediados del siglo XX en el México de oro.",
    description_en: "Domingo Soler leads a wonderful ensemble casting in a masterpiece of family romance in mid-century gold Mexico.",
    category: "movies" as const,
    genre_es: "Comedy, Romance, Classic",
    genre_en: "Comedy, Romance, Classic",
    duration: "1h 40m",
    poster_url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400",
    rating: "PG",
    year: "1952",
    cast: ["Domingo Soler", "Marga López"],
    streams: [{ label: "Auto" as const, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }]
  },
  {
    id: "v-class-mi-alma-por-un-amor",
    title_es: "MI ALMA POR UN AMOR",
    title_en: "My Soul For a Love",
    description_es: "Enrique Guzmán y Angélica María protagonizan este romance musical clásico rebosante de canciones inolvidables y juventud.",
    description_en: "Enrique Guzmán and Angélica María star in this classic musical romance full of unforgettable melodies and youth.",
    category: "movies" as const,
    genre_es: "Comedy, Romance, Music",
    genre_en: "Comedy, Romance, Music",
    duration: "1h 38m",
    poster_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400",
    rating: "PG",
    year: "1964",
    cast: ["Enrique Guzmán", "Angélica María"],
    streams: [{ label: "Auto" as const, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }]
  },
  {
    id: "v-class-este-mundo",
    title_es: "ESTE MUNDO EN QUE VIVIMOS",
    title_en: "This World We Live In",
    description_es: "La inolvidable Sara García y Andrés Soler nos regalan un torbellino de emociones sinceras, valores e historias entrelazadas con maestría.",
    description_en: "The unforgettable Sara García and Andrés Soler provide a whirlwind of genuine emotions and values woven with supreme mastery.",
    category: "movies" as const,
    genre_es: "Drama, Classic",
    genre_en: "Drama, Classic",
    duration: "1h 45m",
    poster_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400",
    rating: "PG",
    year: "1955",
    cast: ["Sara García", "Andrés Soler"],
    streams: [{ label: "Auto" as const, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }]
  },
  {
    id: "v-class-ella-lucifer",
    title_es: "ELLA, LUCIFER Y YO",
    title_en: "She, Lucifer and I",
    description_es: "Un apasionante y misterioso thriller de época estelarizado por Abel Salazar y Sara Montiel que mantiene al espectador al filo de su asiento.",
    description_en: "A suspenseful and mysterious period thriller starring Abel Salazar and Sara Montiel that keeps the audience on the edge of their seats.",
    category: "movies" as const,
    genre_es: "Mystery, Drama, Classic",
    genre_en: "Mystery, Drama, Classic",
    duration: "1h 30m",
    poster_url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400",
    rating: "PG",
    year: "1953",
    cast: ["Abel Salazar", "Sara Montiel"],
    streams: [{ label: "Auto" as const, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }]
  }
];

const getSubtitleForTime = (time: number, isSpanish: boolean, title: string): string => {
  if (time < 5) {
    return isSpanish ? "Canela TV presenta..." : "Canela TV presents...";
  } else if (time >= 5 && time < 12) {
    return isSpanish 
      ? `Estás viendo: ${title}` 
      : `You are watching: ${title}`;
  } else if (time >= 12 && time < 24) {
    return isSpanish 
      ? "Un clásico inolvidable de la época de oro y del cine premium latino gratis." 
      : "An unforgettable masterpiece from the golden age of premium Latin cinema.";
  } else if (time >= 24 && time < 36) {
    return isSpanish 
      ? "Siente la emoción del drama clásico con sonido estereofónico remasterizado." 
      : "Feel the emotion of classic drama with high-fidelity remastered audio.";
  } else if (time >= 36 && time < 50) {
    return isSpanish 
      ? "[Efecto dramático: sonido ambiental y susurros de misterio]" 
      : "[Dramatic effect: ambient background whispers and growing mystery]";
  } else if (time >= 50 && time < 65) {
    return isSpanish 
      ? "Puedes usar las flechas del teclado para regular volumen y adelantar capítulos." 
      : "You can use keyboard arrows to adjust volume and seek through chapters.";
  } else if (time >= 65 && time < 80) {
    return isSpanish 
      ? "Todo el entretenimiento gratis en español en una sola aplicación." 
      : "All free entertainment in your language in a single, high-fidelity app.";
  } else {
    const index = Math.floor((time - 80) / 15) % 4;
    const subsEs = [
      "No te pierdas de los próximos capítulos y estrenos semanales.",
      "Recomienda esta maravillosa reproducción con tus seres queridos.",
      "La calidad del streaming se adapta automáticamente a tu conexión de internet.",
      "Explora el catálogo premium para descubrir más contenido similar."
    ];
    const subsEn = [
      "Do not miss the upcoming chapters and exclusive weekly releases.",
      "Recommend this marvelous cinematic record with your beloved ones.",
      "Adaptive streaming speed is dynamically adjusting base on active bandwidth.",
      "Navigate to related recommendations shelf below to discover similar entertainment."
    ];
    return isSpanish ? subsEs[index] : subsEn[index];
  }
};

export default function JWPlayer({
  video,
  language,
  isTheater,
  onToggleTheater,
  onNextVideo,
  onUpdateActiveVideo,
  onClose,
  activeEpisode = null,
  onPlayEpisode = () => {},
  isLiveStream = false,
  isTvModeInitial = false
}: JWPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Core Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active settings popover state (holds 'settings' or null)
  const [activeMenu, setActiveMenu] = useState<'settings' | null>(null);
  const [activeSubtitle, setActiveSubtitle] = useState<'es' | 'en' | 'off'>('off');
  const [activeAudio, setActiveAudio] = useState<'es' | 'en'>('es');

  // Subtitle styling customizations
  const [subSize, setSubSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [subColor, setSubColor] = useState<'white' | 'yellow' | 'emerald'>('white');

  // Playback constraints speed and native playbackRate
  const [playSpeed, setPlaySpeed] = useState<number>(1.0);
  const [streamQuality, setStreamQuality] = useState<string>('Auto');
  const [ambientGlow, setAmbientGlow] = useState<boolean>(true);

  // Interactive Play/Pause Ripple Circles & gesture touch
  const [showRipple, setShowRipple] = useState<'play' | 'pause' | 'skip-forward' | 'skip-backward' | null>(null);
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keyboard cheat-sheet overlay
  const [isKeyboardHelpOpen, setIsKeyboardHelpOpen] = useState<boolean>(false);

  // Indicator notices
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smartphone touch tracker & Smart TV mode / Simulated Casting optimization states
  const lastTouchRef = useRef<number>(0);
  const [isTvMode, setIsTvMode] = useState<boolean>(isTvModeInitial);
  const [isCasting, setIsCasting] = useState<boolean>(false);

  const testStreamUrl = video.streams?.find(s => s.label === '1080p')?.url || video.streams?.[0]?.url || '';

  // Detect live mode context
  const isCurrentlyLive = isLiveStream || video.category === 'sports' || video.id === 'live-stream' || false;

  // Next chronological episode solver inside the current playlist
  let nextChronologicalEpisode: Episode | null = null;
  if (video.episodes && activeEpisode) {
    const currentIdx = video.episodes.findIndex(e => e.id === activeEpisode.id);
    if (currentIdx !== -1 && currentIdx + 1 < video.episodes.length) {
      nextChronologicalEpisode = video.episodes[currentIdx + 1];
    }
  }

  // Synchronize play state and load source when source changes
  useEffect(() => {
    setActiveSubtitle('off');
    setCurrentTime(0);
    setIsPlaying(false);
    setPlaySpeed(1.0);

    const videoEl = videoRef.current;
    if (videoEl && testStreamUrl) {
      try {
        videoEl.load();
        
        // Auto playback after user gesture
        const playPromise = videoEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.log("Playback deferred until fully buffered:", err);
              setIsPlaying(false);
            });
        }
      } catch (err) {
        console.warn("Video failed to play immediately:", err);
        setIsPlaying(false);
      }
    }
  }, [testStreamUrl]);

  // Sync playback rates
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playSpeed;
    }
  }, [playSpeed, testStreamUrl, isPlaying]);

  // Flash onscreen feedback label
  const flashActionLabel = (text: string) => {
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    setActionLabel(text);
    actionTimeoutRef.current = setTimeout(() => {
      setActionLabel(null);
    }, 850);
  };

  // Activity idle trigger
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    
    idleTimeoutRef.current = setTimeout(() => {
      if (isPlaying && activeMenu === null && !isKeyboardHelpOpen) {
        setControlsVisible(false);
      }
    }, 4500); 
  };

  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    };
  }, [isPlaying, activeMenu, isKeyboardHelpOpen]);

  // Trigger double-click seeks or large center ripple animation overlays
  const triggerRippleEffect = (type: 'play' | 'pause' | 'skip-forward' | 'skip-backward') => {
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    setShowRipple(type);
    
    let label = "";
    if (type === 'play') label = "PLAY";
    if (type === 'pause') label = "PAUSE";
    if (type === 'skip-forward') label = "+10s";
    if (type === 'skip-backward') label = "-10s";
    flashActionLabel(label);

    rippleTimeoutRef.current = setTimeout(() => {
      setShowRipple(null);
    }, 500);
  };

  // Core actions
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      try {
        videoRef.current.pause();
      } catch (e) {
        console.warn(e);
      }
      setIsPlaying(false);
      triggerRippleEffect('pause');
    } else {
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              triggerRippleEffect('play');
            })
            .catch(err => {
              console.warn("Playback postponed: ", err);
            });
        }
      } catch (err) {
        console.warn("Playback error: ", err);
      }
    }
  };

  // Handle double clicking video element for skips (netflix style)
  const handleVideoDoubleClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (isCurrentlyLive || !videoRef.current) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    if (clickX > width / 2) {
      // Skip forward 10s
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
      triggerRippleEffect('skip-forward');
    } else {
      // Skip backward 10s
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
      triggerRippleEffect('skip-backward');
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
    flashActionLabel(nextMute ? "MUTE" : `VOLUME ${Math.round(volume * 100)}%`);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const nextVol = parseFloat(e.target.value);
    videoRef.current.volume = nextVol;
    setVolume(nextVol);
    if (nextVol > 0) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrentlyLive || !videoRef.current) return;
    const seekPercentage = parseFloat(e.target.value);
    const newTime = (seekPercentage / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 6481);
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  // Keyboard Shortcuts Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tagName = (e.target as HTMLElement).tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || (e.target as HTMLElement).isContentEditable) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Space plays/pauses
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f': // F fullscreen
          e.preventDefault();
          handleToggleFullscreen();
          break;
        case 'm': // M mute
          e.preventDefault();
          handleMuteToggle();
          break;
        case 'arrowright': // Forward 10s
          if (isCurrentlyLive) return;
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
            triggerRippleEffect('skip-forward');
          }
          break;
        case 'arrowleft': // Backward 10s
          if (isCurrentlyLive) return;
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
            triggerRippleEffect('skip-backward');
          }
          break;
        case 'arrowup': // Vol Up
          e.preventDefault();
          if (videoRef.current) {
            const nv = Math.min(volume + 0.1, 1);
            videoRef.current.volume = nv;
            setVolume(nv);
            videoRef.current.muted = false;
            setIsMuted(false);
            flashActionLabel(`VOLUME ${Math.round(nv * 100)}%`);
          }
          break;
        case 'arrowdown': // Vol Down
          e.preventDefault();
          if (videoRef.current) {
            const nv = Math.max(volume - 0.1, 0);
            videoRef.current.volume = nv;
            setVolume(nv);
            flashActionLabel(`VOLUME ${Math.round(nv * 100)}%`);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, duration, isCurrentlyLive]);

  // Picture in Picture
  const handleTriggerPiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        flashActionLabel("PiP OFF");
      } else {
        await videoRef.current.requestPictureInPicture();
        flashActionLabel("PiP ON");
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '01:48:01'; 
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const pad = (n: number) => String(n).padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `00:${pad(m)}:${pad(s)}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Classic styling filters
  const isClassicMovie = video.rating === 'PG' || video.genre_es.toLowerCase().includes('classic') || video.id.includes('ama-tu-projimo') || video.id.includes('v-class-');

  // Dynamic values of custom subtitle styling attributes
  let sizeClass = isTvMode ? 'text-2xl md:text-4xl font-extrabold tracking-wider px-7 py-3 shadow-[0_0_50px_rgba(0,0,0,0.95)]' : 'text-base md:text-lg';
  if (!isTvMode) {
    if (subSize === 'sm') sizeClass = 'text-xs md:text-sm';
    if (subSize === 'lg') sizeClass = 'text-lg md:text-xl';
    if (subSize === 'xl') sizeClass = 'text-xl md:text-3xl';
  }

  let colorClass = 'text-white bg-black/85 border-white/10';
  if (subColor === 'yellow') colorClass = 'text-yellow-400 bg-neutral-950/95 border-yellow-500/20';
  if (subColor === 'emerald') colorClass = 'text-emerald-300 bg-black/95 border-emerald-500/20';

  return (
    <div
      id="custom-epic-jw-player"
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setControlsVisible(false)}
      className={`relative w-full h-full min-h-screen bg-black overflow-hidden flex flex-col justify-between z-10 select-none animate-fadeIn transition-all ${
        isTvMode ? 'p-1' : ''
      }`}
    >
      {/* SIMULATED CASTING SYSTEM OVERLAY (Optimizado para Conexión TV) */}
      {isCasting && (
        <div className="absolute inset-0 z-[999] bg-[#0c0d10]/98 flex flex-col items-center justify-center text-center p-6 animate-fadeIn font-sans">
          <div className="max-w-md space-y-6 flex flex-col items-center">
            {/* Spinning radar graphic */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#E50914]/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border border-yellow-400/40 animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E50914] to-yellow-400 flex items-center justify-center text-white shadow-2xl relative z-10 animate-bounce">
                <Cast className="w-8 h-8 stroke-[2]" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {language === 'es' ? 'Transmitiendo a Smart TV' : 'Casting to Smart TV'}
              </h3>
              <p className="text-xs text-[#E50914] font-black tracking-widest uppercase">
                {video.title_es}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm pt-2 select-none">
                {language === 'es' 
                  ? 'La película se está reproduciendo en tu Smart TV en calidad Ultra HD 4K de forma gratuita. Usa tu smartphone como control remoto.' 
                  : 'The stream is now playing on your Smart TV in free Ultra HD 4K. Use this smartphone screen as your controller remote.'}
              </p>
            </div>

            {/* Smart simulated remote controller helpers buttons inside casting screen */}
            <div className="grid grid-cols-3 gap-3 w-full bg-neutral-900/60 p-4 rounded-2xl border border-white/5 shadow-2xl">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
                    flashActionLabel("-10s");
                  }
                }}
                className="py-3 bg-neutral-800 hover:bg-neutral-700 font-bold rounded-xl text-xs active:scale-95 transition-all text-gray-200 cursor-pointer"
              >
                ⏪ -10s
              </button>
              <button
                onClick={handlePlayPause}
                className="py-3 bg-[#E50914]/20 hover:bg-[#E50914] border border-[#E50914]/30 hover:border-transparent font-black rounded-xl text-xs active:scale-95 transition-all text-white cursor-pointer"
              >
                {isPlaying ? "⏸️ PAUSA" : "▶️ PLAY"}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
                    flashActionLabel("+10s");
                  }
                }}
                className="py-3 bg-neutral-800 hover:bg-neutral-700 font-bold rounded-xl text-xs active:scale-95 transition-all text-gray-200 cursor-pointer"
              >
                +10s ⏩
              </button>

              <button
                onClick={() => {
                  if (videoRef.current) {
                    const nv = Math.max(volume - 0.1, 0);
                    videoRef.current.volume = nv;
                    setVolume(nv);
                    flashActionLabel(`VOL ${Math.round(nv * 100)}%`);
                  }
                }}
                className="py-2.5 bg-neutral-850 hover:bg-neutral-800 font-bold rounded-lg text-[10px] text-gray-300 cursor-pointer"
              >
                🔉 VOL -
              </button>
              <button
                onClick={handleMuteToggle}
                className="py-2.5 bg-neutral-850 hover:bg-neutral-800 font-bold rounded-lg text-[10px] text-gray-300 cursor-pointer"
              >
                🔇 MUTEAR
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    const nv = Math.min(volume + 0.1, 1);
                    videoRef.current.volume = nv;
                    setVolume(nv);
                    videoRef.current.muted = false;
                    setIsMuted(false);
                    flashActionLabel(`VOL ${Math.round(nv * 100)}%`);
                  }
                }}
                className="py-2.5 bg-neutral-850 hover:bg-neutral-800 font-bold rounded-lg text-[10px] text-gray-300 cursor-pointer"
              >
                🔊 VOL +
              </button>
            </div>

            <button
              onClick={() => {
                setIsCasting(false);
                flashActionLabel("CONEXIÓN CERRADA");
              }}
              className="px-6 py-2 bg-[#E50914] hover:bg-red-700 text-xs font-black text-white rounded-lg transition-colors cursor-pointer select-none"
            >
              {language === 'es' ? 'Detener Transmisión' : 'Disconnect Cast'}
            </button>
          </div>
        </div>
      )}
      {/* Scope style block for clean, self-contained custom keyframes (ripple ping and subtle glow) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rippleFade {
          0% { transform: scale(0.65); opacity: 0; }
          50% { transform: scale(1.1); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-ripple-once {
          animation: rippleFade 0.5s ease-out forwards;
        }
      `}} />

      {/* AMBIENT LIGHT BULB GLOW LAYER - Apple-TV styled color aura matching the poster artwork */}
      {ambientGlow && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none select-none transition-opacity duration-1000">
          <img
            referrerPolicy="no-referrer"
            src={video.backdrop_url || video.poster_url}
            alt=""
            className="w-full h-full object-cover scale-[1.35] blur-[120px] opacity-[0.24] pointer-events-none"
          />
        </div>
      )}

      {/* Absolute Video Node */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black z-0">
        <video
          id="html5-video-node"
          ref={videoRef}
          src={testStreamUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onSeeking={() => setIsBuffering(true)}
          onSeeked={() => setIsBuffering(false)}
          onEnded={() => {
            setIsPlaying(false);
            if (nextChronologicalEpisode) {
              onPlayEpisode(nextChronologicalEpisode);
            } else if (onNextVideo) {
              onNextVideo();
            }
          }}
          onClick={handlePlayPause}
          onDoubleClick={handleVideoDoubleClick}
          onTouchStart={(e) => {
            const now = Date.now();
            const timespan = now - lastTouchRef.current;
            if (timespan < 300) {
              if (isCurrentlyLive || !videoRef.current) return;
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0] || e.changedTouches[0];
              if (touch) {
                const touchX = touch.clientX - rect.left;
                const width = rect.width;
                if (touchX > width / 2) {
                  videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
                  triggerRippleEffect('skip-forward');
                } else {
                  videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
                  triggerRippleEffect('skip-backward');
                }
              }
            } else {
              handleMouseMove();
            }
            lastTouchRef.current = now;
          }}
          className={`w-full h-full object-contain pointer-events-auto cursor-pointer transition-all duration-300 ${
            isClassicMovie ? 'grayscale contrast-[1.12] brightness-[1.04]' : ''
          }`}
          playsInline
        />
      </div>

      {/* RETAINED SIMULATED SUBTITLES IN REAL TIME - Dynamic rendering with custom style selectors */}
      {activeSubtitle !== 'off' && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center pointer-events-none z-20 px-4 w-full max-w-3xl animate-fadeIn">
          <div className={`${sizeClass} ${colorClass} py-1.5 px-4 font-sans font-black rounded border shadow-2xl tracking-wide leading-relaxed inline-block max-w-[90vw] text-center`}>
            {getSubtitleForTime(currentTime, activeSubtitle === 'es', video.title_es)}
          </div>
        </div>
      )}

      {/* ACTION LABELS HUD OVERLAY (Volume changes, seeks, speed settings, rates feedback) */}
      {actionLabel && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/85 rounded-full text-[#E50914] font-black text-xs uppercase tracking-widest border border-red-500/20 shadow-2xl pointer-events-none z-50 transition-all">
          {actionLabel}
        </div>
      )}

      {/* NETFLIX-STYLE BIG CENTER PULSATING GESTURE RIPPLE */}
      {showRipple && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none z-30">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/70 border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md animate-ripple-once">
            {showRipple === 'play' && <Play className="w-9 h-9 sm:w-11 sm:h-11 fill-white text-white ml-1" />}
            {showRipple === 'pause' && <Pause className="w-9 h-9 sm:w-11 sm:h-11 fill-white text-white" />}
            {showRipple === 'skip-forward' && <RotateCw className="w-9 h-9 sm:w-11 sm:h-11 text-white" />}
            {showRipple === 'skip-backward' && <RotateCcw className="w-9 h-9 sm:w-11 sm:h-11 text-white" />}
          </div>
        </div>
      )}

      {/* Buffering Indicator Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 pointer-events-none">
          <Loader2 className="w-14 h-14 text-[#E50914] animate-spin" />
        </div>
      )}

      {/* TOP DECORATIVE AND DISMISSAL PANEL BAR */}
      <div
        className={`absolute top-0 inset-x-0 bg-gradient-to-b from-black/95 via-black/50 to-transparent p-6 md:px-12 flex items-center justify-between z-40 transition-all duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Back Arrow Title */}
        <button
          onClick={onClose}
          className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors cursor-pointer group/back focus:outline-none"
        >
          <svg
            className="w-6 h-6 transition-transform group-hover/back:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <div className="flex flex-col text-left">
            <span className="text-lg md:text-xl font-extrabold tracking-tight">
              {language === 'es' ? video.title_es : video.title_en}
            </span>
            {activeEpisode && (
              <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest leading-none mt-0.5">
                {language === 'es' ? 'Capítulo' : 'Chapter'} {activeEpisode.episodeNumber} • S{activeEpisode.seasonNumber}
              </span>
            )}
          </div>
        </button>

        {/* Dynamic Genre Badge indicators in vertical lines layout */}
        <div className="flex items-center gap-3.5 text-right select-none">
          <div className="flex flex-col">
            <span className="text-white text-sm md:text-base font-extrabold tracking-wide">
              {language === 'es' ? `Clasificación ${video.rating}` : `Rating ${video.rating}`}
            </span>
            <span className="text-gray-400 text-xs font-semibold">
              {language === 'es' 
                ? video.genre_es.replace(/,/g, ', ') 
                : video.genre_en.replace(/,/g, ', ')
              }
            </span>
          </div>
          <div className="w-[3px] bg-[#E50914] self-stretch rounded-full" />
        </div>
      </div>

      {/* CENTER PLAY BACKWARD FORWARD PANEL ROW */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-10 sm:gap-20 md:gap-28 pointer-events-auto">
          {/* Skip Backward 10s */}
          <button
            onClick={() => {
              if (isCurrentlyLive || !videoRef.current) return;
              videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
              triggerRippleEffect('skip-backward');
            }}
            disabled={isCurrentlyLive}
            className={`group relative flex items-center justify-center w-14 h-14 rounded-full text-white/95 hover:text-white hover:bg-white/10 transition-all transform hover:scale-110 active:scale-95 focus:outline-none ${
              isCurrentlyLive ? 'opacity-20 cursor-not-allowed pointer-events-none' : ''
            }`}
            title="Atrás 10s"
          >
            <RotateCcw className="w-10 h-10 stroke-[1.8]" />
            <span className="absolute text-[10px] font-black font-sans leading-none mt-1">10</span>
          </button>

          {/* Large Center PlayPause button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-20 h-20 rounded-full text-white/95 hover:text-white hover:bg-white/10 transition-all transform hover:scale-110 active:scale-95 focus:outline-none"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-14 h-14 fill-white stroke-none" />
            ) : (
              <Play className="w-14 h-14 fill-white stroke-none ml-2" />
            )}
          </button>

          {/* Skip Forward 10s */}
          <button
            onClick={() => {
              if (isCurrentlyLive || !videoRef.current) return;
              videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
              triggerRippleEffect('skip-forward');
            }}
            disabled={isCurrentlyLive}
            className={`group relative flex items-center justify-center w-14 h-14 rounded-full text-white/95 hover:text-white hover:bg-white/10 transition-all transform hover:scale-110 active:scale-95 focus:outline-none ${
              isCurrentlyLive ? 'opacity-20 cursor-not-allowed pointer-events-none' : ''
            }`}
            title="Adelante 10s"
          >
            <RotateCw className="w-10 h-10 stroke-[1.8]" />
            <span className="absolute text-[10px] font-black font-sans leading-none mt-1">10</span>
          </button>
        </div>
      </div>

      {/* SIGHT-AHEAD CONTROLS: NEXT EPISODE CHRONOLOGICAL OVERLAY FLOATING */}
      {nextChronologicalEpisode && controlsVisible && (
        <div className="absolute right-6 md:right-12 bottom-36 z-40 max-w-xs bg-black/90 hover:bg-[#121214] border border-[#E50914]/40 p-3.5 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn select-none group/nextBtn transition-all duration-305">
          <div className="flex items-start gap-3">
            <div className="w-20 aspect-video rounded overflow-hidden bg-neutral-900 border border-white/10 shrink-0 relative">
              <img
                referrerPolicy="no-referrer"
                src={nextChronologicalEpisode.poster_url}
                alt=""
                className="w-full h-full object-cover group-hover/nextBtn:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 text-white fill-white animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col text-left">
              <span className="text-[9px] text-[#E50914] font-black tracking-widest uppercase">
                {language === 'es' ? 'SIGUIENTE CAPÍTULO' : 'NEXT EPISODE'}
              </span>
              <h5 className="text-[11px] font-black text-white truncate my-0.5 group-hover/nextBtn:text-[#E50914] transition-colors">
                {language === 'es' ? nextChronologicalEpisode.title_es : nextChronologicalEpisode.title_en}
              </h5>
              <span className="text-[9px] text-gray-400 font-mono">
                S{nextChronologicalEpisode.seasonNumber}E{nextChronologicalEpisode.episodeNumber} • {nextChronologicalEpisode.duration}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onPlayEpisode && nextChronologicalEpisode) {
                onPlayEpisode(nextChronologicalEpisode);
              }
            }}
            className="w-full mt-2.5 bg-[#E50914] text-white hover:bg-red-700 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>{language === 'es' ? 'Siguiente Capítulo' : 'Play Next Chapter'}</span>
            <SkipForward className="w-3 h-3 text-white shrink-0" />
          </button>
        </div>
      )}

      {/* UNIFIED ELITE PANEL DE CONFIGURACIÓN DEL REPRODUCTOR (Simplified control dashboard overlay matching TV screenshot layout) */}
      {activeMenu === 'settings' && controlsVisible && (
        <div
          id="jw-player-audio-subtitles-hud"
          className="absolute left-1/2 bottom-32 -translate-x-1/2 w-[650px] max-w-[95vw] bg-[#1c1d21]/96 border border-white/5 rounded-2xl p-6 flex flex-col gap-4 z-50 shadow-2xl backdrop-blur-xl animate-fadeIn font-sans"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* COLUMN 1: AUDIO */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm md:text-base tracking-wide flex items-center gap-1.5 border-b border-white/10 pb-2">
                {language === 'es' ? 'Audio' : 'Audio'}
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'es', label: language === 'es' ? 'Español' : 'Spanish' },
                  { key: 'en', label: language === 'es' ? 'Inglés' : 'English' }
                ].map((item) => {
                  const isSel = activeAudio === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveAudio(item.key as any);
                        flashActionLabel(`${language === 'es' ? 'AUDIO' : 'AUDIO'}: ${item.key.toUpperCase()}`);
                      }}
                      className={`w-full text-left text-xs md:text-sm px-4 py-3 rounded-lg flex items-center justify-between transition-all select-none cursor-pointer ${
                        isSel
                          ? 'bg-[#333335] text-white border border-white/10 font-black'
                          : 'bg-[#121214]/50 text-gray-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSel && <Check className="w-4 h-4 text-red-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 2: SUBTÍTULOS */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm md:text-base tracking-wide flex items-center gap-1.5 border-b border-white/10 pb-2">
                {language === 'es' ? 'Subtítulos' : 'Subtitles'}
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'off', label: language === 'es' ? 'Desactivado' : 'Off' },
                  { key: 'es', label: language === 'es' ? 'Español' : 'Spanish' },
                  { key: 'en', label: language === 'es' ? 'Inglés' : 'English' }
                ].map((item) => {
                  const isSel = activeSubtitle === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveSubtitle(item.key as any);
                        flashActionLabel(`SUBTÍTULOS: ${item.key.toUpperCase()}`);
                      }}
                      className={`w-full text-left text-xs md:text-sm px-4 py-3 rounded-lg flex items-center justify-between transition-all select-none cursor-pointer ${
                        isSel
                          ? 'bg-[#333335] text-white border border-white/10 font-black'
                          : 'bg-[#121214]/50 text-gray-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSel && <Check className="w-4 h-4 text-red-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COLUMN 3: VELOCIDAD */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-extrabold text-sm md:text-base tracking-wide flex items-center gap-1.5 border-b border-white/10 pb-2">
                {language === 'es' ? 'Velocidad' : 'Speed'}
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { key: 0.5, label: '0.5x' },
                  { key: 1.0, label: language === 'es' ? 'Normal' : 'Normal' },
                  { key: 1.25, label: '1.25x' },
                  { key: 1.5, label: '1.5x' },
                  { key: 2.0, label: '2.0x' }
                ].map((item) => {
                  const isSel = playSpeed === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setPlaySpeed(item.key);
                        flashActionLabel(`VELOCIDAD: ${item.key}x`);
                      }}
                      className={`w-full text-left text-xs md:text-sm px-4 py-3 rounded-lg flex items-center justify-between transition-all select-none cursor-pointer ${
                        isSel
                          ? 'bg-[#333335] text-white border border-white/10 font-black'
                          : 'bg-[#121214]/50 text-gray-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSel && <Check className="w-4 h-4 text-red-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        id="jwp-bottom-gradient-wrapper"
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-32 pb-6 px-6 md:px-12 z-20 transition-all duration-300 ${
          controlsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        {isPlaying ? (
          /* ACTIVE PLAYING HUD: Elegant Seekbar with Yellow ad-breaks ticks */
          <div className="flex flex-col gap-3.5 w-full animate-fadeIn">
            {/* SMART TV CUSTOM INSTRUCTIONS FOR REMOTES */}
            {isTvMode && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] sm:text-xs font-black text-gray-300 font-sans px-1 pb-2.5 tracking-wider uppercase select-none border-b border-white/5 mb-1 animate-fadeIn">
                <span className="text-[#E50914] flex items-center gap-1">📺 {language === 'es' ? 'CONTROL REMOTO' : 'REMOTE CONTROL'}:</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">[◀ / ▶] SEEK</span>
                <span className="text-gray-600">•</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">[▲ / ▼] VOL</span>
                <span className="text-gray-600">•</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">[ESPACIO / ENTER] PLAY/PAUSA</span>
                <span className="text-gray-600">•</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">[M] MUTE</span>
                <span className="text-gray-600">•</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">[ESC] CLOSE</span>
              </div>
            )}

            <div className="flex items-center gap-6 w-full group/timeline">
              
              {isCurrentlyLive ? (
                /* LIVE TIMELINE BADGE (Disables standard tracking and replaces it with static low latency glowing badge) */
                <div className="flex-1 flex items-center justify-between py-2 border-y border-white/[0.04] bg-red-950/20 px-4 rounded-lg select-none">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                    <span className="text-xs font-black uppercase text-red-500 tracking-widest">{language === 'es' ? 'DIRECTO EN VIVO' : 'DIRECT LIVE FEED'}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">1080p Ultra HD • {language === 'es' ? 'Sincronizado' : 'In Sync'}</span>
                </div>
              ) : (
                /* NORMAL RECORD TIMELINE TRACK WITH YELLOW TICKS - Posas Films / Canela custom screens layout */
                <div className={`relative flex-1 group/bar ${isTvMode ? 'h-5' : 'h-3.5'} flex items-center`}>
                  {/* Background track bar */}
                  <div className={`absolute inset-x-0 bg-white/20 rounded-full ${isTvMode ? 'h-[5px]' : 'h-[3px]'}`} />
                  
                  {/* Active playing RED progress bar */}
                  <div
                    className={`absolute left-0 bg-[#E50914] rounded-full ${isTvMode ? 'h-[5px]' : 'h-[3px]'}`}
                    style={{ width: `${progress}%` }}
                  />
                  
                  {/* Actual range slider overlay */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.05"
                    value={progress}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-25"
                  />
                  
                  {/* Progress scrubber orb */}
                  <div
                    className={`absolute rounded-full bg-[#E50914] border border-white shadow-xl pointer-events-none transition-all ${
                      isTvMode 
                        ? 'w-5 h-5 -mt-0.5 scale-100 group-hover/timeline:scale-110' 
                        : 'w-3.5 h-3.5 scale-100 group-hover/timeline:scale-115'
                    }`}
                    style={{ left: `calc(${progress}% - ${isTvMode ? '10px' : '7.5px'})` }}
                  />
                </div>
              )}
 
              {/* Remaining timer or Live timing stamp */}
              {!isCurrentlyLive && (
                <span className={`text-white font-sans select-none tracking-tight ${isTvMode ? 'text-sm sm:text-base font-extrabold' : 'text-xs md:text-sm font-semibold'}`}>
                  {formatTime(Math.max(duration - currentTime, 0))}
                </span>
              )}
            </div>

            {/* BOTTOM ICON BAR ACTIONS (Volume, Audio setting, help, maximize details) */}
            <div className="flex items-center justify-between w-full mt-3">
              {/* Left Column: Volume Slider in solid high contrast white */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMuteToggle}
                  className="text-white hover:text-gray-300 transition-colors p-1 cursor-pointer focus:outline-none"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6 stroke-[1.8]" />
                  ) : (
                    <Volume2 className="w-6 h-6 stroke-[1.8]" />
                  )}
                </button>

                <div className="w-24 sm:w-32 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-white bg-white/20 hover:bg-white/35 cursor-pointer h-[3px] rounded-lg transition-all"
                    style={{
                      background: `linear-gradient(to right, white 0%, white ${
                        (isMuted ? 0 : volume) * 100
                      }%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Center Column: Audio / Speed Settings controller */}
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'settings' ? null : 'settings')}
                className="flex items-center gap-2 text-white hover:text-gray-300 bg-[#333333]/40 hover:bg-[#333333]/85 px-5 py-2.5 rounded-lg border border-white/10 transition-all font-sans text-xs md:text-sm font-semibold tracking-wide cursor-pointer focus:outline-none"
              >
                <Subtitles className="w-4 h-4 text-white" />
                <span>Audio y Subtítulos</span>
              </button>

              {/* Right Column Icons: Keyboard shortcuts menu, picture-in-picture stream casting, maximize sizing */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* ADVANCED SMART TV TOGGLE SENSOR */}
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isTvMode;
                    setIsTvMode(nextMode);
                    flashActionLabel(nextMode ? "MODO SMART TV: ACTIVO 📺" : "MODO SMART TV: DESACTIVADO");
                  }}
                  className={`transition-all px-2 py-1.5 rounded-lg cursor-pointer focus:outline-none flex items-center gap-1.5 text-xs font-black select-none ${
                    isTvMode 
                      ? 'bg-[#E50914] text-white border border-red-500/20 shadow-lg scale-105 animate-pulse' 
                      : 'text-[#E50914]/90 hover:text-white hover:bg-red-500/10 border border-red-500/10 bg-red-500/[0.02]'
                  }`}
                  title={language === 'es' ? 'Modo Smart TV (Optimizado)' : 'Smart TV Mode (10ft Control)'}
                >
                  <Tv className="w-4 h-4 stroke-[2]" />
                  <span className="text-[9px] uppercase font-sans font-black tracking-widest">{language === 'es' ? 'MODO TV' : 'TV MODE'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsKeyboardHelpOpen(true)}
                  className="text-white hover:text-gray-350 transition-colors p-1 cursor-pointer focus:outline-none"
                  title={language === 'es' ? 'Atajos de Teclado' : 'Keyboard Shortcuts'}
                >
                  <Keyboard className="w-5 h-5 stroke-[1.5]" />
                </button>

                <button
                  onClick={() => setIsCasting(true)}
                  className="text-white hover:text-gray-350 transition-colors p-1 cursor-pointer focus:outline-none"
                  title="Casting"
                >
                  <Cast className="w-5 h-5 stroke-[1.5]" />
                </button>

                <button
                  onClick={handleTriggerPiP}
                  className="text-white hover:text-gray-350 transition-colors p-1 cursor-pointer focus:outline-none"
                  title="Picture in Picture"
                >
                  <AppWindow className="w-5 h-5 stroke-[1.5]" />
                </button>

                <button
                  onClick={handleToggleFullscreen}
                  className="text-white hover:text-gray-350 transition-colors p-1 cursor-pointer focus:outline-none"
                  title="Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 stroke-[1.5]" />
                  ) : (
                    <Maximize className="w-5 h-5 stroke-[1.5]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* PAUSED HUD SHIELD: More classics lists similar titles row */
          <div className="flex flex-col gap-4 w-full animate-fadeIn select-none">
            {/* Gallery title */}
            <h3 className="text-white font-black font-sans text-base md:text-lg tracking-wide uppercase">
              {language === 'es' ? 'Más títulos como este' : 'More like this'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full overflow-x-auto pb-2 scrollbar-none">
              {RECO_VIDEOS.map((reco) => (
                <div
                  key={reco.id}
                  onClick={() => {
                    if (onUpdateActiveVideo) {
                      onUpdateActiveVideo(reco);
                    }
                  }}
                  className="group/card relative aspect-[16/9] rounded-md overflow-hidden bg-zinc-900 border border-white/5 hover:border-white/30 cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {/* Backdrop poster image */}
                  <img
                    referrerPolicy="no-referrer"
                    src={reco.poster_url}
                    alt={reco.title_es}
                    className="w-full h-full object-cover opacity-60 group-hover/card:opacity-80 transition-opacity"
                  />
                  
                  {/* Subtle black vignette grad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  {/* Left play circle */}
                  <div className="absolute left-3 bottom-3 flex items-center justify-center bg-white text-black h-7 w-7 rounded-full shadow-lg transition-transform group-hover/card:scale-110">
                    <Play className="w-3.5 h-3.5 fill-black text-black ml-0.5" />
                  </div>

                  {/* Crimson glow border on active hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover/card:border-[#E50914] rounded-md transition-colors pointer-events-none" />

                  {/* Title */}
                  <div className="absolute inset-x-3 bottom-12 flex flex-col justify-end">
                    <span 
                      className="text-white text-xs font-black tracking-tight drop-shadow-md text-[11px] font-sans italic uppercase block leading-none"
                      style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
                    >
                      {reco.title_es}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
