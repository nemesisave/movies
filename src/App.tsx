import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Globe,
  Settings,
  Plus,
  Check,
  Play,
  Heart,
  MessageSquare,
  Star,
  Tv,
  Film,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  ChevronDown,
  Flame,
  TrendingUp,
  Gift,
  Trophy,
  Send,
  Tv2,
  Clock,
  Compass,
  Radio,
  Award,
  User
} from 'lucide-react';
import { Video, Language, UserReview, Episode } from './types';
import { DEFAULT_VIDEOS, TRANSLATIONS } from './data';
import JWPlayer from './components/JWPlayer';
import UploadDashboard from './components/UploadDashboard';
import LoginModal from './components/LoginModal';

// Live Chat messages pool for Canales En Vivo
const MOCK_CHAT_POOL = [
  { user: "Carlos_99", msg: "¡Qué partidazo de El Quinto Partido! Julian Gil lo hace increíble ⚽🔥" },
  { user: "Sofia_Lopez", msg: "Al fin un stream gratis en 1080p sin cortes!" },
  { user: "Cinefilo_Gomez", msg: "Este clásico del Cine de Oro mexicano es una obra maestra" },
  { user: "Laura_Marta", msg: "La calidad de audio en Canela.tv es genial 💯" },
  { user: "NovelaFan_04", msg: "Reyyan y Miran hacen la mejor pareja turca de todos los tiempos 😍" },
  { user: "EdStafford_Survival", msg: "¡Increíble la resistencia de Ed Stafford en la selva!" },
  { user: "KidsParent", msg: "A mis hijos les encanta el rincón de canelitas!" },
  { user: "Hyundai_Driver", msg: "Presentado por Hyundai! Tremendo diseño del slider" },
  { user: "Luis_Zapata", msg: "Gaby Spanic es la villana más espectacular de las novelas" },
  { user: "Claudio_Díaz", msg: "El Capo está tremenda, ¡qué tensión!" },
  { user: "Estelita", msg: "¡Saludos de Monterrey, me encanta Canela TV!" },
  { user: "Mendez_Films", msg: "Me encanta que se mantenga el formato original para clásicos" },
  { user: "PasionTurca", msg: "Hercai en español es simplemente supremo" },
  { user: "SportsFanatic", msg: "Vamos Selección, un Quinto Partido histórico!" }
];

// 8 Retro Golden Era Cinema Classics matching TV screenshot
export const RECIEN_AGREGADO_CLASSICS = [
  {
    id: "v-tu-y-las-nubes",
    title_es: "Tú y las nubes",
    title_en: "Tú y las nubes",
    description_es: "Clásica historia de enredos amorosos, picardía y canciones inolvidables de la Época de Oro con Lola Flores y Miguel Aceves Mejía.",
    description_en: "Clásica historia de enredos amorosos, picardía y canciones inolvidables de la Época de Oro con Lola Flores y Miguel Aceves Mejía.",
    category: "movies",
    genre_es: "Classic, Drama, Musical",
    genre_en: "Classic, Drama, Musical",
    duration: "1h 40m",
    poster_url: "/src/assets/images/tu_y_las_nubes_poster_1779730297599.png",
    backdrop_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600",
    rating: "TV-PG",
    year: "1955",
    cast: ["Lola Flores", "Miguel Aceves Mejía", "Tony Aguilar"],
    director: "Miguel Zacarías",
    country: "Mexico"
  },
  {
    id: "v-rancho-grande",
    title_es: "Allá en el Rancho Grande",
    title_en: "Allá en el Rancho Grande",
    description_es: "La comedia de charros y canciones más icónica que puso en marcha la Época de Oro del Cine Mexicano, protagonizada por Jorge Negrete.",
    description_en: "The highly iconic charro comedy and songs that kicked off the Golden Era of Mexican Cinema, starring Jorge Negrete.",
    category: "movies",
    genre_es: "Classic, Comedia, Drama",
    genre_en: "Classic, Comedy, Drama",
    duration: "1h 35m",
    poster_url: "/src/assets/images/alla_en_el_rancho_grande_poster_1779730319187.png",
    backdrop_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1600",
    rating: "TV-PG",
    year: "1936",
    cast: ["Jorge Negrete", "Tito Guízar", "Esther Fernández"],
    director: "Fernando de Fuentes",
    country: "Mexico"
  },
  {
    id: "v-dos-tipos-cuidado",
    title_es: "Dos Tipos de Cuidado",
    title_en: "Dos Tipos de Cuidado",
    description_es: "Dos amigos inseparables se convierten en rivales por un malentendido de honor en la comedia ranchera mexicana más gloriosa de todos los tiempos.",
    description_en: "Two inseparable friends become rivals over an honor misunderstanding in the most glorious Mexican ranch comedy of all time.",
    category: "movies",
    genre_es: "Classic, Comedia, Musical",
    genre_en: "Classic, Comedy, Musical",
    duration: "1h 50m",
    poster_url: "/src/assets/images/dos_tipos_de_cuidado_poster_1779730334542.png",
    backdrop_url: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1600",
    rating: "TV-PG",
    year: "1953",
    cast: ["Pedro Infante", "Jorge Negrete", "Carmelita González"],
    director: "Ismael Rodríguez",
    country: "Mexico"
  },
  {
    id: "v-las-mananitas",
    title_es: "Las Mañanitas",
    title_en: "Las Mañanitas",
    description_es: "Aventuras pícaras y amorosas de la época clásica rural, marcadas por hermosas serenatas y el carisma insustituible de Pedro Infante.",
    description_en: "Mischievous and loving adventures of the rural classical era, marked by beautiful serenades and the irreplaceable charisma of Pedro Infante.",
    category: "movies",
    genre_es: "Classic, Drama, Musical",
    genre_en: "Classic, Drama, Musical",
    duration: "1h 30m",
    poster_url: "/src/assets/images/las_mananitas_poster_1779730349256.png",
    backdrop_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1600",
    rating: "TV-PG",
    year: "1948",
    cast: ["Pedro Infante", "Lupita Torrentera", "Andrés Soler"],
    director: "Joaquín Pardavé",
    country: "Mexico"
  },
  {
    id: "v-cartas-marcadas",
    title_es: "Carta Marcadas",
    title_en: "Cartas Marcadas",
    description_es: "Pedro Infante y Marga López protagonizan una emotiva historia de promesas, secretos familiares y cartas de amor perdidas en el tiempo.",
    description_en: "Pedro Infante and Marga Lopez star in an emotional story of promises, family secrets, and love letters lost in time.",
    category: "movies",
    genre_es: "Classic, Drama, Romance",
    genre_en: "Classic, Drama, Romance",
    duration: "1h 42m",
    poster_url: "/src/assets/images/cartas_marcadas_poster_1779730364368.png",
    backdrop_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600",
    rating: "TV-PG",
    year: "1948",
    cast: ["Pedro Infante", "Marga López", "Elda Peralta"],
    director: "Miguel Zacarías",
    country: "Mexico"
  },
  {
    id: "v-escuela-solteras",
    title_es: "Escuela para Solteras",
    title_en: "Escuela para Solteras",
    description_es: "Un divertido complot de enredos y sabios consejos de amor para ganar el corazón de las mujeres más codiciadas de la provincia.",
    description_en: "A hilarious plot of entanglements and wise advice on love to win the hearts of the most coveted women in the province.",
    category: "movies",
    genre_es: "Classic, Comedia, Romance",
    genre_en: "Classic, Comedy, Romance",
    duration: "1h 38m",
    poster_url: "/src/assets/images/escuela_para_solteras_poster_1779730381832.png",
    backdrop_url: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1600",
    rating: "TV-PG",
    year: "1965",
    cast: ["Luis Aguilar", "Amador Aguilar", "Fanny Cano"],
    director: "Miguel Zacarías",
    country: "Mexico"
  },
  {
    id: "v-cartas-ufemia",
    title_es: "Cartas a Ufemia",
    title_en: "Cartas a Ufemia",
    description_es: "Las desternillantes misivas y serenatas enviadas a una hermosa mujer causan estragos cómicos en un pequeño pueblo de México.",
    description_en: "The hilarious love letters and serenades sent to a beautiful woman cause comedic havoc in a small Mexican town.",
    category: "movies",
    genre_es: "Classic, Comedia, Musical",
    genre_en: "Classic, Comedy, Musical",
    duration: "1h 35m",
    poster_url: "/src/assets/images/cartas_a_ufemia_poster_1779730398533.png",
    backdrop_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1600",
    rating: "TV-PG",
    year: "1952",
    cast: ["Miguel Aceves Mejía", "Delia Casanova", "Víctor Alcocer"],
    director: "Zacarías Gómez",
    country: "Mexico"
  },
  {
    id: "v-solo-veracruz",
    title_es: "Solo Veracruz es Bello",
    title_en: "Solo Veracruz es Bello",
    description_es: "Un radiante homenaje musical lleno de jaranas, sol de costa y picardía jarocha en los bellos parajes del Veracruz de antaño.",
    description_en: "A radiant musical tribute full of local jarana music, beach sun, and jarocho charm in old Veracruz.",
    category: "movies",
    genre_es: "Classic, Musical, Comedia",
    genre_en: "Classic, Musical, Comedy",
    duration: "1h 30m",
    poster_url: "/src/assets/images/solo_veracruz_es_bello_poster_1779730411705.png",
    backdrop_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600",
    rating: "TV-PG",
    year: "1961",
    cast: ["Rosita Quintana", "Manuel Capetillo", "Queta Garay"],
    director: "Roselio Gómez",
    country: "Mexico"
  },
  {
    id: "v-ahi-viene-martin-corona",
    title_es: "Ahí Viene Martín Corona",
    title_en: "Ahí Viene Martín Corona",
    description_es: "Pedro Infante da vida al legendario vaquero justiciero Martín Corona, enfrentado a las injusticias de los malhechores del norte mexicano.",
    description_en: "Pedro Infante brings to life the legendary cowboy outlaw Martín Corona, fighting against the lawless bands of Northern Mexico.",
    category: "movies",
    genre_es: "Classic, Action, Drama",
    genre_en: "Classic, Action, Drama",
    duration: "1h 35m",
    poster_url: "/src/assets/images/ahi_viene_martin_corona_poster_1779730427836.png",
    backdrop_url: "https://images.unsplash.com/photo-1485642234645-a62644f84728?q=80&w=1600",
    rating: "TV-PG",
    year: "1952",
    cast: ["Pedro Infante", "Sara Montiel", "Eulalio González Piporro"],
    director: "Miguel Zacarías",
    country: "Mexico"
  },
  {
    id: "v-cuando-quiere-un-mexicano",
    title_es: "Cuando Quiere un Mexicano",
    title_en: "Cuando Quiere un Mexicano",
    description_es: "El amor florece entre cantares y malentendidos rancheros de la mano de Jorge Negrete en su plenitud como el supremo charro cantor.",
    description_en: "Love blossoms between beautiful ranch songs and comedy sketch entanglements featuring Jorge Negrete as the singer charro.",
    category: "movies",
    genre_es: "Classic, Romance, Musical",
    genre_en: "Classic, Romance, Musical",
    duration: "1h 30m",
    poster_url: "/src/assets/images/cuando_quiere_un_mexicano_poster_1779730444622.png",
    backdrop_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600",
    rating: "TV-PG",
    year: "1944",
    cast: ["Jorge Negrete", "Amanda Ledesma", "Enrique Herrera"],
    director: "Juan Bustillo Oro",
    country: "Mexico"
  }
];

export const RECIEN_AGREGADO_NOVELAS = [
  {
    id: "v-juana-la-virgen",
    title_es: "Juana la Virgen",
    title_en: "Juana la Virgen",
    description_es: "Juana es una joven virgen de diecisiete años que queda embarazada por un error médico de inseminación artificial.",
    description_en: "Juana is a seventeen-year-old virgin who gets pregnant due to a medical artificial insemination error.",
    category: "novelas",
    genre_es: "Novela, Drama, Romance",
    genre_en: "Soap Opera, Drama, Romance",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600",
    rating: "TV-14",
    year: "2002",
    cast: ["Daniela Alvarado", "Ricardo Álamo", "Roxana Díaz"],
    director: "Tony Rodríguez",
    country: "Venezuela"
  },
  {
    id: "v-gorda-bella",
    title_es: "Mi Gorda Bella",
    title_en: "Mi Gorda Bella",
    description_es: "Valentina es una joven dulce y con sobrepeso que hereda una inmensa fortuna, pero debe luchar contra la codicia de su propia tía.",
    description_en: "Valentina is a sweet, overweight young woman who inherits a fortune, but must fight against her greedy aunt.",
    category: "novelas",
    genre_es: "Novela, Drama, Comedia",
    genre_en: "Soap Opera, Drama, Comedy",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600",
    rating: "TV-14",
    year: "2002",
    cast: ["Natalia Streignard", "Juan Pablo Raba", "Hilda Abrahamz"],
    director: "José Alcalde",
    country: "Venezuela"
  },
  {
    id: "v-la-revancha",
    title_es: "La Revancha",
    title_en: "La Revancha",
    description_es: "Dos hermanas separadas al nacer buscan justicia por la muerte de su padre, sin saber que el destino las unirá por el amor de un mismo hombre.",
    description_en: "Two sisters separated at birth seek justice for their father's death, unaware that destiny will unite them in love with the same man.",
    category: "novelas",
    genre_es: "Novela, Drama, Acción",
    genre_en: "Soap Opera, Drama, Action",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600",
    rating: "TV-14",
    year: "2000",
    cast: ["Danna García", "Jorge Reyes", "Marcelo Cezán"],
    director: "Yaky Ortega",
    country: "Venezuela"
  },
  {
    id: "v-vivir-destiempo",
    title_es: "Vivir a Destiempo",
    title_en: "Vivir a Destiempo",
    description_es: "Paula ha vivido sometida a un matrimonio frío, pero el reencuentro con su primer amor reavivará la pasión y el anhelo de libertad.",
    description_en: "Paula has lived subjected to a cold marriage, but the reunion with her first love will revive passion and the desire for freedom.",
    category: "novelas",
    genre_es: "Novela, Drama",
    genre_en: "Soap Opera, Drama",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600",
    rating: "TV-14",
    year: "2013",
    cast: ["Edith González", "Ramiro Fumazoni", "Humberto Zurita"],
    director: "Mauricio Meneses",
    country: "Mexico"
  },
  {
    id: "v-esposa-joven",
    title_es: "Esposa Joven",
    title_en: "Esposa Joven",
    description_es: "Zehra es una niña inteligente de trece años cuyos sueños se ven truncados tras ser obligada a casarse con un adinerado heredero.",
    description_en: "Zehra is an intelligent thirteen-year-old girl whose dreams are cut short after being forced to marry a wealthy heir.",
    category: "novelas",
    genre_es: "Novela, Drama",
    genre_en: "Soap Opera, Drama",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600",
    rating: "TV-14",
    year: "2013",
    cast: ["Çağla Şimşek", "Orhan Şimşek", "Gözde Mukavelat"],
    director: "Naci Çelik Berksoy",
    country: "Turkey"
  },
  {
    id: "v-mujer-vida",
    title_es: "La Mujer de mi Vida",
    title_en: "La Mujer de mi Vida",
    description_es: "Bárbarita es una chica dulce que se casa con un millonario, desatando una red de celos familiares e intrigas pasionales.",
    description_en: "Barbarita is a sweet girl who marries a millionaire, unleashing a web of family jealousy and passionate intrigues.",
    category: "novelas",
    genre_es: "Novela, Drama, Romance",
    genre_en: "Soap Opera, Drama, Romance",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600",
    rating: "TV-14",
    year: "1998",
    cast: ["Natalia Streignard", "Mario Cimarro", "Lorena Meritano"],
    director: "José Antonio Ferrara",
    country: "Venezuela"
  },
  {
    id: "v-heredera",
    title_es: "La Heredera",
    title_en: "La Heredera",
    description_es: "Una rica heredera se enamora de un audaz piloto aviador, desafiando a su ambiciosa familia que busca quedarse con su legado.",
    description_en: "A wealthy heiress falls in love with a bold pilot, defying her ambitious family who seeks to keep her legacy.",
    category: "novelas",
    genre_es: "Novela, Drama, Romance",
    genre_en: "Soap Opera, Drama, Romance",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1600",
    rating: "TV-14",
    year: "2004",
    cast: ["Silvia Navarro", "Sergio Basañez", "Aylín Mújica"],
    director: "Luis Alberto Lamata",
    country: "Mexico"
  },
  {
    id: "v-madrastra",
    title_es: "La Madrastra",
    title_en: "La Madrastra",
    description_es: "María es condenada injustamente por un crimen. Tras salir de prisión, regresa como la madrastra para descubrir al verdadero asesino.",
    description_en: "Maria is unjustly condemned for a crime. After leaving prison, she returns as the stepmother to find the real murderer.",
    category: "novelas",
    genre_es: "Novela, Drama, Misterio",
    genre_en: "Soap Opera, Drama, Mystery",
    duration: "1 Temporada",
    poster_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    backdrop_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600",
    rating: "TV-14",
    year: "2005",
    cast: ["Victoria Ruffo", "César Évora", "Jacqueline Andere"],
    director: "Jorge Edgar Ramírez",
    country: "Mexico"
  }
];

export default function App() {
  // Local/Persistent States
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('canela_lang');
    return (saved === 'en' || saved === 'es') ? (saved as Language) : 'es';
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('canela_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('canela_current_user');
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('canela_videos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading storage:", e);
      }
    }
    return DEFAULT_VIDEOS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('canela_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<UserReview[]>(() => {
    const saved = localStorage.getItem('canela_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: "r1",
        video_id: "v-bunny",
        user_email: "sofia.lopez@canelafan.com",
        rating: 5,
        comment: "¡Excelente reproductor! Se ve increíble la calidad 1080p y los subtítulos cambian al instante. Muy buen clon de Canela.",
         date: "2026-05-23"
      },
      {
        id: "r2",
        video_id: "v-sintel",
        user_email: "mark.stevens@cinefile.org",
        rating: 4,
        comment: "The JWPlayer simulation is spot on. Seamless switching, very snappy on mobile as well.",
        date: "2026-05-24"
      }
    ];
  });

  // UI Selection States
  const [activeVideo, setActiveVideo] = useState<Video>(videos[0]);
  const [selectedVideoForDetails, setSelectedVideoForDetails] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [isHeaderSearchExpanded, setIsHeaderSearchExpanded] = useState<boolean>(false);
  const [activeHeaderMenu, setActiveHeaderMenu] = useState<'club' | 'profile' | null>(null);
  const [activeEpisodeGroupTab, setActiveEpisodeGroupTab] = useState<string>('E1 - E25');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // Reset season and episode group tab on details card transition
  useEffect(() => {
    setSelectedSeason(1);
    setActiveEpisodeGroupTab('E1 - E25');
  }, [selectedVideoForDetails]);

  // Multi-Banner Slider Hero state
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);

  // Club Canela Points State
  const [clubPoints, setClubPoints] = useState<number>(() => {
    const saved = localStorage.getItem('canela_club_points');
    return saved ? parseInt(saved) : 120;
  });

  // Trivia states
  const [triviaStatus, setTriviaStatus] = useState<'unsolved' | 'correct' | 'wrong'>(() => {
    const saved = localStorage.getItem('canela_trivia_solved');
    return saved === 'true' ? 'correct' : 'unsolved';
  });
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<string | null>(null);

  // Loyalty rewards redemption state
  const [toteBagStatus, setToteBagStatus] = useState<'locked' | 'redeemed'>(() => {
    const saved = localStorage.getItem('canela_totebag');
    return saved === 'redeemed' ? 'redeemed' : 'locked';
  });

  // Simulated Live Channel streams states
  const [isLiveStream, setIsLiveStream] = useState<boolean>(false);
  const [activeLiveChannel, setActiveLiveChannel] = useState<string | null>(null);
  const [liveChatMsgs, setLiveChatMsgs] = useState<{user: string; msg: string; time: string}[]>([]);
  const [chatInputMsg, setChatInputMsg] = useState<string>('');

  // Form comments states
  const [commentEmail, setCommentEmail] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');

  // Refs for scrolling
  const playerSectionRef = useRef<HTMLDivElement>(null);
  const trendingCarouselRef = useRef<HTMLDivElement>(null);
  const moviesCarouselRef = useRef<HTMLDivElement>(null);
  const customCarouselRef = useRef<HTMLDivElement>(null);
  const newlyAddedRef = useRef<HTMLDivElement>(null);
  const mostPopularRef = useRef<HTMLDivElement>(null);
  const bestOfCanelaRef = useRef<HTMLDivElement>(null);
  const classicsCarouselRef = useRef<HTMLDivElement>(null);
  const liveChannelsCarouselRef = useRef<HTMLDivElement>(null);
  const recommendedCarouselRef = useRef<HTMLDivElement>(null);

  // Sync club points & trivia to localStorages
  useEffect(() => {
    localStorage.setItem('canela_club_points', clubPoints.toString());
  }, [clubPoints]);

  useEffect(() => {
    localStorage.setItem('canela_trivia_solved', triviaStatus === 'correct' ? 'true' : 'false');
  }, [triviaStatus]);

  useEffect(() => {
    localStorage.setItem('canela_totebag', toteBagStatus);
  }, [toteBagStatus]);

  // Set up slide auto-play for majestic cinematic experience
  useEffect(() => {
    if (searchQuery || selectedVideoForDetails || selectedCategory !== 'all') return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % 3);
    }, 9000);
    return () => clearInterval(interval);
  }, [searchQuery, selectedVideoForDetails, selectedCategory]);

  // Simulate incoming live messages in Canales En Vivo
  useEffect(() => {
    if (!isLiveStream) return;
    
    // Seed initial chats first
    setLiveChatMsgs([
      { user: "ModeradorCanela", msg: "¡Bienvenidos a la transmisión EN VIVO! Chat de fans activo.", time: "11:23 AM" },
      { user: "Ana_Martinez", msg: "¡Qué gran calidad se ve esto! 🎥❤", time: "11:23 AM" },
      { user: "Roberto77", msg: "Hola de Argentina, increíble Canela.tv", time: "11:23 AM" }
    ]);

    const chatInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * MOCK_CHAT_POOL.length);
      const chosenComment = MOCK_CHAT_POOL[idx];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setLiveChatMsgs(prev => {
        // limit to last 25 message nodes for DOM performance
        const list = [...prev, { user: chosenComment.user, msg: chosenComment.msg, time: timeStr }];
        if (list.length > 25) {
          list.shift();
        }
        return list;
      });
    }, 3800);

    return () => clearInterval(chatInterval);
  }, [isLiveStream]);

  // Sync to localStorages
  useEffect(() => {
    localStorage.setItem('canela_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('canela_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('canela_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('canela_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Current translation active map
  const t = TRANSLATIONS[language];

  // Video insertion handler
  const handleAddVideo = (newVideo: Video) => {
    setVideos(prev => [newVideo, ...prev]);
    setActiveVideo(newVideo);
    // Automatically trigger visual display feedback
    setIsAdminOpen(false);
    
    // Smooth scroll up to player
    setTimeout(() => {
      playerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  // Video update handler (for edits or adding episodes)
  const handleUpdateVideo = (modifiedVideo: Video) => {
    setVideos(prev => prev.map(v => v.id === modifiedVideo.id ? modifiedVideo : v));
    
    // Sync current active structures if edited
    if (activeVideo.id === modifiedVideo.id) {
      setActiveVideo(modifiedVideo);
    }
    if (selectedVideoForDetails && selectedVideoForDetails.id === modifiedVideo.id) {
      setSelectedVideoForDetails(modifiedVideo);
    }
  };

  // Video removal handler
  const handleRemoveVideo = (id: string) => {
    if (confirm(language === 'es' ? '¿Estás seguro de eliminar este video subido?' : 'Are you sure you want to delete this uploaded video?')) {
      const nextVideos = videos.filter(v => v.id !== id);
      setVideos(nextVideos);
      
      // If deleted video was active, switch to default
      if (activeVideo.id === id) {
        setActiveVideo(nextVideos[0] || DEFAULT_VIDEOS[0]);
      }
    }
  };

  // Toggle favorite bookmark
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Switch video target smoothly
  const handleSelectVideo = (target: Video) => {
    setActiveVideo(target);
    setSelectedVideoForDetails(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smoothly select classic movie from You may also like carousel
  const handleSelectClassicMovie = (classic: any) => {
    const videoSchema: Video = {
      id: classic.id,
      title_es: classic.title_es,
      title_en: classic.title_en,
      description_es: classic.description_es,
      description_en: classic.description_en,
      category: "movies",
      genre_es: classic.genre_es,
      genre_en: classic.genre_en,
      duration: classic.duration,
      poster_url: classic.poster_url,
      backdrop_url: classic.backdrop_url,
      rating: classic.rating,
      year: classic.year,
      cast: classic.cast,
      director: classic.director,
      country: classic.country,
      streams: [
        { label: "Auto", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
      ]
    };
    setSelectedVideoForDetails(videoSchema);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit reviews
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentEmail || !commentText.trim()) {
      alert(language === 'es' ? 'Por favor completa tu correo y comentario' : 'Please provide email and comment');
      return;
    }

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      video_id: activeVideo.id,
      user_email: commentEmail,
      rating: commentRating,
      comment: commentText,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [newRev, ...prev]);
    setCommentText('');
    setCommentEmail('');
    setCommentRating(5);
  };

  // Filter video collection dynamically
  const filteredVideos = videos.filter(vid => {
    // Category match
    const categoryMatch = selectedCategory === 'all' || vid.category === selectedCategory;
    
    // Query search match
    if (!searchQuery.trim()) return categoryMatch;

    const query = searchQuery.toLowerCase();
    const titleMatch = (vid.title_es.toLowerCase().includes(query) || vid.title_en.toLowerCase().includes(query));
    const descMatch = (vid.description_es.toLowerCase().includes(query) || vid.description_en.toLowerCase().includes(query));
    const genreMatch = (vid.genre_es.toLowerCase().includes(query) || vid.genre_en.toLowerCase().includes(query));
    const castMatch = vid.cast.some(actor => actor.toLowerCase().includes(query));

    return categoryMatch && (titleMatch || descMatch || genreMatch || castMatch);
  });

  // Split into shelves for Netflix-Canela layout look
  const trendingVideos = filteredVideos.slice(0, 3);
  const movieCategoryVideos = filteredVideos.filter(v => v.category === 'movies' || v.category === 'novelas');
  const seriesCategoryVideos = filteredVideos.filter(v => v.category === 'series' || v.category === 'sports');
  const kidsVideos = filteredVideos.filter(v => v.category === 'kids');
  const customUploadedVideos = filteredVideos.filter(v => v.isCustom);

  // Scroll controls for carousels
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmt = direction === 'left' ? -350 : 350;
      ref.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  // Automatically play next video on completion
  const handlePlayNext = () => {
    const currentIndex = videos.findIndex(v => v.id === activeVideo.id);
    if (currentIndex !== -1 && currentIndex + 1 < videos.length) {
      setActiveVideo(videos[currentIndex + 1]);
    } else {
      setActiveVideo(videos[0]);
    }
  };

  // Helper to obtain episodes for any selected Video to guarantee screenshot presentation
  const getEpisodeLimitForVideoAndSeason = (videoId: string, season: number): number => {
    if (videoId === 'v-fazilet') {
      if (season === 1) return 174;
      if (season === 2) return 110;
      if (season === 3) return 45;
    }
    if (season === 1) return 40;
    if (season === 2) return 25;
    if (season === 3) return 12;
    return 40;
  };

  const getEpisodeTabsForCount = (totalEpisodes: number): string[] => {
    const tabs: string[] = [];
    const chunkSize = 25;
    for (let i = 1; i <= totalEpisodes; i += chunkSize) {
      const start = i;
      const end = Math.min(i + chunkSize - 1, totalEpisodes);
      tabs.push(`E${start} - E${end}`);
    }
    return tabs;
  };

  const parseRangeFromTab = (tabStr: string) => {
    const matches = tabStr.match(/\d+/g);
    if (matches && matches.length >= 2) {
      return {
        start: parseInt(matches[0], 10),
        end: parseInt(matches[1], 10)
      };
    }
    return { start: 1, end: 25 };
  };

  const getEpisodesForVideo = (video: Video, season: number = 1, activeTab: string = 'E1 - E25') => {
    const isNovela = video.category === 'novelas' || video.category === 'series';
    
    if (isNovela || video.id === 'v-fazilet') {
      const totalEpisodes = getEpisodeLimitForVideoAndSeason(video.id, season);
      const tabs = getEpisodeTabsForCount(totalEpisodes);
      const resolvedTab = tabs.includes(activeTab) ? activeTab : tabs[0] || 'E1 - E25';
      const { start, end } = parseRangeFromTab(resolvedTab);
      
      const count = end - start + 1;
      
      const getEpisodeTitle = (num: number, isEs: boolean) => {
        if (video.id === 'v-fazilet') {
          const titles_es_pool = [
            "Escapar de la Pobreza", "Amor Secreto", "La Familia Egemen", "Búsqueda de Riqueza", "Choque de Mundos",
            "La Venta de la Mansión", "Dinero Sucio", "Sospecha Familiar", "La Huida", "Viejos Rencores",
            "El Regreso", "Mentiras Piadosas", "Secreto Revelado", "El Testamento", "Confesión Cruel",
            "Caminos Cruzados", "Prueba de Amor", "La Trampa", "Aliados Inesperados", "Falsa Identidad",
            "El Chantaje", "La Búsqueda", "Desenmascarados", "Rivalidad Eterna", "Celos Enfermizos",
            "La Desesperación", "Lágrimas de Sangre", "La Fuga", "Un Nuevo Comienzo", "Bajo Sospecha",
            "La Venganza de Fazilet", "Un Triste Adiós", "Verdades que Duelen", "El Destino Decide", "La Decisión",
            "El Resurgir del Imperio", "Falsa Calma", "El Heredero Perdido", "Desafío Abierto", "Lazos de Sangre",
            "El Regreso Triunfal", "Trampa del Destino", "La Última Oportunidad", "Ojos de Sospecha", "La Huida Final",
            "Secretos de Familia", "La Sentencia", "Pérdida Dolorosa", "Alianzas Oscuras", "Corazón de Piedra",
            "La Tempestad", "El Laberinto", "Sospecha Fatal", "El Trato", "Confesión Íntima",
            "Venganzas Cruzadas", "El Chantaje Final", "Fuego Cruzado", "La Fuerza del Amor", "El Dolor de un Padre",
            "Desenlace Inminente", "La Trampa Final", "Juicio y Sentencia", "La Redención", "Último Aliento",
            "El Mañana Esperado", "El Sacrificio Final", "Destino Cumplido", "La Paz de Fazilet", "Gran Final"
          ];
          
          const titles_en_pool = [
            "Escape from Poverty", "Secret Love", "The Egemen Family", "Search for Wealth", "Clash of Worlds",
            "The Mansion Sale", "Dirty Money", "Family Suspicion", "The Escape", "Old Grudges",
            "The Return", "White Lies", "Revealed Secret", "The Testament", "Cruel Confession",
            "Crossed Paths", "Proof of Love", "The Trap", "Unexpected Allies", "False Identity",
            "The Blackmail", "The Search", "Unmasked", "Eternal Rivalry", "Sick Jealousy",
            "The Despair", "Tears of Blood", "The Escape Attempt", "A New Beginning", "Under Suspicion",
            "Fazilet's Revenge", "A Sad Goodbye", "Hurting Truths", "Destiny Decides", "The Decision",
            "Resurgence of the Empire", "False Calm", "The Lost Heir", "Open Challenge", "Blood Ties",
            "Triumphant Return", "Fate's Trap", "The Last Chance", "Eyes of Suspicion", "The Final Escape",
            "Family Secrets", "The Sentence", "Painful Loss", "Dark Alliances", "Heart of Stone",
            "The Tempest", "The Maze", "Fatal Suspicion", "The Deal", "Intimate Confession",
            "Crossed Revenges", "The Final Blackmail", "Crossfire", "The Strength of Love", "A Father's Pain",
            "Imminent Outcome", "The Final Trap", "Trial and Sentence", "Redemption", "Last Breath",
            "The Awaited Tomorrow", "The Final Sacrifice", "Destiny Fulfilled", "Fazilet's Peace", "Gran Final"
          ];
          
          const idx = (num - 1) % titles_es_pool.length;
          return isEs ? `${titles_es_pool[idx]} (${num})` : `${titles_en_pool[idx]} (${num})`;
        } else {
          // General novelas/series
          const generic_es = ["Comienzo de la Pasión", "Enredos de Familia", "Mentira Piadosa", "Desenmascarado", "Confesión de Amor", "Caminos Cruzados", "Prueba de Fuego", "Aliados del Destino", "La Trampa", "Secreto de Sangre"];
          const generic_en = ["Beginning of Passion", "Family Tangles", "White Lie", "Unmasked", "Love Confession", "Crossways", "Trial by Fire", "Allies of Destiny", "The Trap", "Blood Secret"];
          const idx = (num - 1) % generic_es.length;
          return isEs ? `${generic_es[idx]} - Cap. ${num}` : `${generic_en[idx]} - Ep. ${num}`;
        }
      };

      const durations = ["43min", "45min", "47min", "43min", "44min"];
      const posters = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400"
      ];
      
      return Array.from({ length: count }).map((_, i) => {
        const epNum = start + i;
        const durIdx = epNum % durations.length;
        const postIdx = epNum % posters.length;
        return {
          id: `${video.id}-ep-${season}-${epNum}`,
          episodeNumber: epNum,
          seasonNumber: season,
          title_es: getEpisodeTitle(epNum, true),
          title_en: getEpisodeTitle(epNum, false),
          duration: durations[durIdx],
          release_date: season === 1 ? "26 Mar, 2017" : season === 2 ? "12 Oct, 2018" : "05 Sep, 2019",
          poster_url: video.id === 'v-fazilet' ? posters[postIdx] : (video.poster_url || posters[postIdx]),
          video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        };
      });
    }

    if (video.episodes && video.episodes.length > 0) {
      return video.episodes;
    }
    
    // Auto-generate segments/scenes for normal videos (movies, uploaded) so the screen ALWAYS appears like the requested screenshot
    return [
      {
        id: `${video.id}-ep1`,
        episodeNumber: 1,
        seasonNumber: 1,
        title_es: language === 'es' ? "Introducción y Escena Inicial" : "Introduction and Opening Scene",
        title_en: "Introduction and Opening Scene",
        duration: "10min",
        release_date: video.year,
        poster_url: video.poster_url,
        video_url: video.streams[0]?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
      },
      {
        id: `${video.id}-ep2`,
        episodeNumber: 2,
        seasonNumber: 1,
        title_es: language === 'es' ? "Conflicto y Desarrollo Dramático" : "Rising Conflict & Tension",
        title_en: "Rising Conflict & Tension",
        duration: "15min",
        release_date: video.year,
        poster_url: video.backdrop_url || video.poster_url,
        video_url: video.streams[0]?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
      },
      {
        id: `${video.id}-ep3`,
        episodeNumber: 3,
        seasonNumber: 1,
        title_es: language === 'es' ? "El Clímax y Desenlace" : "Climax and Resolution",
        title_en: "Climax and Resolution",
        duration: "20min",
        release_date: video.year,
        poster_url: video.poster_url,
        video_url: video.streams[0]?.url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
      }
    ];
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white/95 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* BRANDING HEADER NAVIGATION */}
      <header id="main-header" className="sticky top-0 z-50 bg-gradient-to-b from-[#0e0f12] via-[#0e0f12]/95 to-[#0e0f12]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 md:px-8 flex items-center justify-between transition-all select-none">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-14">
          
          {/* Logo styled like Canela.TV in screenshot */}
          <div 
            id="brand-logo"
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedVideoForDetails(null); }}
            className="flex items-center cursor-pointer select-none"
          >
            <span className="text-xl md:text-2xl font-black tracking-tighter text-[#E50914] font-sans">
              CANELA.TV
            </span>
          </div>

          {/* Desktop Categories Filters row exactly matching screenshot */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-5 xl:gap-8 text-xs xl:text-sm font-bold text-gray-300">
            {[
              { id: 'all', label: language === 'es' ? 'Inicio' : 'Home' },
              { id: 'guia', label: language === 'es' ? 'Guía de TV' : 'TV Guide' },
              { id: 'movies', label: language === 'es' ? 'Películas' : 'Movies' },
              { id: 'series', label: language === 'es' ? 'Series' : 'Series' },
              { id: 'novelas', label: language === 'es' ? 'Clásicos' : 'Classics' },
              { id: 'sports', label: language === 'es' ? 'Deportes' : 'Sports' },
              { id: 'musica', label: language === 'es' ? 'Música' : 'Music' },
              { id: 'kids', label: language === 'es' ? 'Kids' : 'Kids' },
              { id: 'noticias', label: language === 'es' ? 'Noticias' : 'News' },
              { id: 'canelitas', label: language === 'es' ? 'Canelitas' : 'Canelitas' },
            ].map(tab => {
              const isSelected = selectedCategory === tab.id || (tab.id === 'all' && selectedCategory === 'all');
              return (
                <button
                  id={`nav-tab-${tab.id}`}
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedVideoForDetails(null);
                    if (tab.id === 'guia' || tab.id === 'musica' || tab.id === 'noticias' || tab.id === 'canelitas') {
                      setSelectedCategory('all'); // fallback nicely
                    } else {
                      setSelectedCategory(tab.id);
                    }
                  }}
                  className={`hover:text-white transition-all cursor-pointer whitespace-nowrap ${
                    isSelected ? 'text-white font-black scale-102 font-sans' : 'text-zinc-300/90 hover:text-white font-semibold font-sans font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Global Toolbar and Controls exactly matching the 3 square actions in screenshot */}
        <div id="header-toolbar" className="flex items-center gap-3 md:gap-4 relative">
          
          {/* Animated Slide-out Search active state text input */}
          {isHeaderSearchExpanded && (
            <div id="header-search-input-container" className="relative animate-fadeIn hidden md:block">
              <input
                id="header-search-textbox"
                type="text"
                placeholder={language === 'es' ? 'Buscar en CANELA.TV...' : 'Search in CANELA.TV...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#121214]/90 border border-white/10 text-xs text-white placeholder:text-gray-500 rounded-lg pl-3 pr-8 py-2 md:py-2.5 w-36 md:w-52 outline-none focus:border-[#E50914] transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsHeaderSearchExpanded(false);
                }}
              />
              {searchQuery && (
                <button 
                  id="clear-header-search-btn"
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* ICON BUTTON 1: Search glass icon inside beautiful glassy rounded square */}
          <button
            id="header-search-toggle-btn"
            type="button"
            onClick={() => {
              setIsHeaderSearchExpanded(!isHeaderSearchExpanded);
              setActiveHeaderMenu(null);
            }}
            className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/[0.12] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title={language === 'es' ? 'Buscar clásicos' : 'Search classics'}
          >
            <Search className="w-5 h-5 text-white" />
          </button>

          {/* ICON BUTTON 2: Loyalty program Star Badge wrapper matching screenshot exactly */}
          <div id="club-canela-menu-wrapper" className="relative">
            <button
              id="header-club-toggle-btn"
              type="button"
              onClick={() => {
                setActiveHeaderMenu(activeHeaderMenu === 'club' ? null : 'club');
              }}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-lg border flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                activeHeaderMenu === 'club' 
                  ? 'bg-white/[0.16] text-[#E50914] border-white/20' 
                  : 'bg-white/[0.06] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.12]'
              }`}
              title="Club Canela"
            >
              <Award className="w-5 h-5 text-white" />
            </button>

            {/* Loyalty club drawer popover */}
            {activeHeaderMenu === 'club' && (
              <div id="club-canela-drawer" className="absolute right-0 top-14 w-80 md:w-96 bg-[#16171b]/98 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-[100] animate-fadeIn font-sans text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-amber-400">Club Canela Premium</span>
                  </div>
                  <button 
                    id="close-club-drawer-btn"
                    type="button" 
                    onClick={() => setActiveHeaderMenu(null)} 
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Points State Display */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/5 rounded-xl p-4 mb-4 text-center">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest">{language === 'es' ? 'Tus Puntos Acumulados' : 'Your Club Points'}</span>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span className="text-3xl font-black text-white font-mono">{clubPoints}</span>
                    <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">PTS</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {language === 'es' ? '¡Sigue acumulando puntos resolviendo la trivia diaria!' : 'Earn points fast by playing the daily classic trivia!'}
                  </p>
                </div>

                {/* Daily Trivia section */}
                <div className="bg-[#121214]/60 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-4 h-4 text-[#E50914] animate-pulse" />
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white">{language === 'es' ? 'Trivia de Oro Diaria' : 'Daily Classics Trivia'}</h4>
                  </div>
                  
                  {triviaStatus === 'correct' ? (
                    <div className="text-center py-4 text-emerald-400 font-bold space-y-1">
                      <Check className="w-8 h-8 mx-auto text-emerald-400 border-2 border-emerald-400 rounded-full p-1 mb-2 animate-bounce flex items-center justify-center" />
                      <p className="text-xs">{language === 'es' ? '¡Trivia completada con éxito hoy!' : 'Trivia successfully completed today!'}</p>
                      <p className="text-[10px] text-gray-400 font-light">{language === 'es' ? 'Vuelve mañana para nuevos clásicos.' : 'Come back tomorrow for new classics.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-gray-300 font-bold leading-relaxed">
                        {language === 'es' 
                          ? '¿Quién interpretó al carismático Pepe el Toro en la mítica película de oro "Nosotros los Pobres"?' 
                          : 'Who played Pepe el Toro in the Mexican golden cinema masterpiece "Nosotros los Pobres"?'
                        }
                      </p>
                      
                      <div className="flex flex-col gap-1.5">
                        {[
                          { key: 'A', label: "Pedro Infante", correct: true },
                          { key: 'B', label: "Jorge Negrete", correct: false },
                          { key: 'C', label: "Cantinflas", correct: false }
                        ].map(opt => (
                          <button
                            id={`trivia-opt-${opt.key}`}
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              if (opt.correct) {
                                setClubPoints(prev => prev + 150);
                                setTriviaStatus('correct');
                              } else {
                                alert(language === 'es' ? 'Incorrecto. ¡Inténtalo de nuevo!' : 'Wrong option. Try again!');
                              }
                            }}
                            className="w-full text-left text-xs px-3 py-2 rounded bg-black/45 hover:bg-white/[0.04] text-gray-300 hover:text-white border border-white/5 transition-all font-medium cursor-pointer"
                          >
                            <span className="font-extrabold text-[#E50914] mr-2">{opt.key}.</span> {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ICON BUTTON 3: User login/avatar profile button inside glassy rounded square matching screenshot */}
          <div id="profile-menu-wrapper" className="relative">
            <button
              id="header-profile-toggle-btn"
              type="button"
              onClick={() => {
                setActiveHeaderMenu(activeHeaderMenu === 'profile' ? null : 'profile');
              }}
              className={`w-10 h-10 md:w-11 md:h-11 rounded-lg border flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                activeHeaderMenu === 'profile' 
                  ? 'bg-white/[0.16] text-[#E50914] border-white/20' 
                  : 'bg-white/[0.06] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.12]'
              }`}
              title={language === 'es' ? 'Ajustes de Perfil' : 'Profile Settings'}
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {/* Profile actions menu dropdown flyout */}
            {activeHeaderMenu === 'profile' && (
              <div id="profile-flyout-menu" className="absolute right-0 top-14 w-64 bg-[#16171b]/98 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-xl z-[100] animate-fadeIn font-sans text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                  <span className="font-extrabold text-xs uppercase tracking-wider text-gray-300">{language === 'es' ? 'Mi Perfil' : 'My Account'}</span>
                  <button 
                    id="close-profile-menu-btn"
                    type="button"
                    onClick={() => setActiveHeaderMenu(null)} 
                    className="text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLoggedIn ? (
                  <div className="space-y-3.5">
                    {/* Logged in User admin card */}
                    <div className="flex items-center gap-2 p-2 bg-neutral-900/60 border border-white/5 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-red-650 flex items-center justify-center font-black text-xs text-white uppercase select-none">
                        {currentUser ? currentUser[0] : 'U'}
                      </div>
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className="text-xs font-black text-white truncate">{currentUser}</p>
                        <p className="text-[9px] text-[#E50914] font-extrabold tracking-widest font-mono uppercase mt-0.5">ADMINISTRADOR</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* Language switcher option */}
                      <button
                        id="profile-lang-switcher-btn"
                        type="button"
                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                        className="w-full text-left text-xs px-3 py-2 rounded bg-[#121214]/40 hover:bg-[#121214]/90 border border-transparent hover:border-white/5 flex items-center justify-between text-gray-300 hover:text-white font-medium transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span>{language === 'es' ? 'Idioma' : 'Language'}</span>
                        </div>
                        <span className="font-extrabold text-[#E50914] uppercase tracking-wider text-[11px] font-mono">{language === 'es' ? 'ES' : 'EN'}</span>
                      </button>

                      {/* Content panel toggle button */}
                      <button
                        id="profile-admin-dashboard-btn"
                        type="button"
                        onClick={() => {
                          setIsAdminOpen(!isAdminOpen);
                          setActiveHeaderMenu(null);
                        }}
                        className="w-full text-left text-xs px-3 py-2 rounded bg-[#121214]/40 hover:bg-[#121214]/90 border border-transparent hover:border-white/5 flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-all cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>{isAdminOpen ? (language === 'es' ? 'Cerrar Gestor' : 'Close Admin Panel') : (language === 'es' ? 'Gestor de Películas' : 'Admin Film Uploads')}</span>
                      </button>
                    </div>

                    <button
                      id="profile-logout-btn"
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setCurrentUser(null);
                        localStorage.removeItem('canela_logged_in');
                        localStorage.removeItem('canela_current_user');
                        setIsAdminOpen(false);
                        setActiveHeaderMenu(null);
                      }}
                      className="w-full text-center py-2 bg-red-650 hover:bg-red-750 text-white font-extrabold text-xs rounded transition-all cursor-pointer"
                    >
                      {language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-center">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {language === 'es' ? 'Inicia sesión como administrador para subir nuevos clásicos o editar comentarios.' : 'Login as administrator to upload classics or manage user reviews.'}
                    </p>

                    <button
                      id="profile-login-btn"
                      type="button"
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setActiveHeaderMenu(null);
                      }}
                      className="w-full text-center py-2.5 bg-[#E50914] hover:bg-red-750 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                    >
                      {language === 'es' ? 'Iniciar Sesión Admin' : 'Admin Login'}
                    </button>

                    <div className="border-t border-white/5 pt-2 flex justify-center">
                      <button
                        id="profile-lang-fallback-btn"
                        type="button"
                        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                        className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-gray-500" />
                        <span>{language === 'es' ? 'Cambiar a Inglés' : 'Switch to English'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <button
            id="mobile-menu-hamburger-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 bg-neutral-900 border border-white/10 rounded-lg text-white icon-cursor cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE MAIN NAVIGATION EXPANSION DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-white/5 px-4 py-4 space-y-4 animate-fadeIn transition-all">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 text-xs text-white placeholder:text-gray-500 rounded-xl pl-9 pr-4 py-2.5 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: 'all', label: t.home },
              { id: 'movies', label: t.movies },
              { id: 'series', label: t.series },
              { id: 'novelas', label: t.novelas },
              { id: 'sports', label: t.sports },
              { id: 'kids', label: t.kids },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-xs py-2 px-4 rounded-xl font-semibold transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-[#18181B] text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ADMIN UPLOAD PANEL HOOD (Fades toggle on button press) */}
      {isAdminOpen && isLoggedIn && (
        <div className="px-4 py-3 bg-neutral-950/80 backdrop-blur border-b border-white/5 animate-fadeIn">
          <UploadDashboard
            language={language}
            translations={t}
            onAddVideo={handleAddVideo}
            customVideos={customUploadedVideos}
            onRemoveVideo={handleRemoveVideo}
            videos={videos}
            onUpdateVideo={handleUpdateVideo}
          />
        </div>
      )}

      {/* INTEGRATED PERSISTENT CINEMATIC MEDIA PLAYER OVERLAY MODAL */}
      {isPlayerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col md:flex-row justify-between animate-fadeIn select-none font-sans overflow-hidden">
          <div className={`flex-1 flex flex-col justify-between ${isLiveStream ? 'md:w-[70%] lg:w-[75%]' : 'w-full'} h-full relative`}>
            <JWPlayer
              video={
                activeEpisode
                  ? {
                      ...activeVideo,
                      streams: [{ label: '1080p', url: activeEpisode.video_url }]
                    }
                  : activeVideo
              }
              language={language}
              isTheater={false}
              onToggleTheater={() => {}}
              onNextVideo={handlePlayNext}
              onUpdateActiveVideo={(nextVideo) => setActiveVideo(nextVideo)}
              onClose={() => {
                setIsPlayerOpen(false);
                setActiveEpisode(null);
                setIsLiveStream(false);
                setActiveLiveChannel(null);
              }}
              activeEpisode={activeEpisode}
              onPlayEpisode={(ep) => setActiveEpisode(ep)}
              isLiveStream={isLiveStream}
            />
          </div>

          {/* Simulated Live Chat Panel */}
          {isLiveStream && (
            <div className="w-full md:w-[320px] lg:w-[360px] h-[320px] md:h-full bg-neutral-950 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between text-white relative z-[1000]">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-900">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-650 bg-red-600 animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#E50914] flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    {language === 'es' ? 'Transmisión En Vivo' : 'Live Stream'}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono font-medium">
                  {activeLiveChannel || "CANELA.TV"}
                </span>
              </div>

              {/* Viewer stats banner */}
              <div className="bg-red-950/20 px-4 py-1.5 border-b border-white/5 flex items-center justify-between text-[11px] text-red-400">
                <span className="font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {language === 'es' ? 'EN DIRECTO' : 'LIVE'}
                </span>
                <span className="font-mono font-bold">● 14,845 {language === 'es' ? 'espectadores' : 'viewers'}</span>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans select-text scrollbar-thin scrollbar-thumb-neutral-800">
                {liveChatMsgs.map((cmt, idx) => (
                  <div key={idx} className="text-xs flex flex-col gap-0.5 leading-relaxed bg-white/[0.02] p-2 rounded-lg border border-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-yellow-500/90 font-mono truncate max-w-[120px]">
                        @{cmt.user}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono">{cmt.time}</span>
                    </div>
                    <p className="text-gray-200 font-medium font-sans">"{cmt.msg}"</p>
                  </div>
                ))}
              </div>

              {/* Quick Preset Inputs */}
              <div className="px-4 py-1.5 bg-neutral-900/60 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0" onClick={e => e.stopPropagation()}>
                {["¡Qué increíble stream! 🔥", "Saludos desde LATAM!", "Me encanta la calidad 📺", "¡Venga ya! 😍"].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setChatInputMsg(preset);
                    }}
                    className="text-[10px] bg-neutral-850 hover:bg-neutral-850 border border-white/5 text-gray-300 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Text Form Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInputMsg.trim()) return;
                  const now = new Date();
                  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  // Add user's custom message
                  const userHandle = currentUser ? currentUser.split('@')[0] : 'Tú';
                  const userMsg = { user: userHandle, msg: chatInputMsg, time: timeStr };
                  setLiveChatMsgs(prev => [...prev, userMsg]);
                  setChatInputMsg('');

                  // Simulate dynamic response after short delay
                  setTimeout(() => {
                    const responses = [
                      "¡Totalmente de acuerdo contigo!",
                      "Siiii Canela TV es lo máximo",
                      "¡Un abrazo grande amigo del chat!",
                      "Me encanta ver interactuar a la comunidad 🤘"
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    setLiveChatMsgs(prev => [...prev, { user: "ModeradorCanela", msg: `@${userMsg.user} ${randomResponse}`, time: timeStr }]);
                  }, 1500);
                }}
                className="p-3 bg-neutral-900 border-t border-white/10 flex items-center gap-2"
                onClick={e => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder={language === 'es' ? 'Escribe tu mensaje en vivo...' : 'Type a live message...'}
                  value={chatInputMsg}
                  onChange={(e) => setChatInputMsg(e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-full py-2 px-4 text-xs text-white outline-none focus:border-[#E50914] transition-all font-sans"
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 
        PREMIUM CINEMATIC SHOW DETAILS BANNER & EPISODES 
        Only visible when a specific card is selected for info/details
      */}
      {/* 
        PREMIUM CINEMATIC SHOW DETAILS BANNER & EPISODES 
        Only visible when a specific card is selected for info/details
      */}
      {searchQuery === '' && selectedVideoForDetails && (
        <section className="relative w-full overflow-hidden bg-[#0A0A0C] animate-fadeIn pb-16">
          
          {/* Main Hero Backdrop block with right-aligned image and sophisticated black-gray gradient blending */}
          <div className="relative min-h-[500px] md:min-h-[620px] w-full flex items-center justify-start overflow-hidden bg-[#0A0A0C] border-b border-white/5">
            
            {/* Blended Backdrop artwork on the right */}
            <div className="absolute top-0 right-0 w-full md:w-3/5 h-full z-0 select-none pointer-events-none">
              <img
                referrerPolicy="no-referrer"
                src={selectedVideoForDetails.backdrop_url || selectedVideoForDetails.poster_url}
                alt={selectedVideoForDetails.title_es}
                className="w-full h-full object-cover object-right md:object-center opacity-75 md:opacity-[0.85] transition-all duration-700"
              />
              {/* Extremely elegant background serif text overlay matching the screenshot */}
              {selectedVideoForDetails.id === 'v-fazilet' && (
                <div className="absolute inset-0 flex items-center justify-end pr-10 md:pr-24 z-10 select-none pointer-events-none">
                  <div className="text-right max-w-lg hidden md:block">
                    <h2 className="font-serif text-5xl lg:text-7xl font-light text-white/5 tracking-wider uppercase leading-none">
                      La Señora Fazilet
                    </h2>
                    <p className="font-serif text-3xl lg:text-4xl font-light text-white/5 tracking-widest uppercase leading-none mt-2">
                      y Sus Hijas
                    </p>
                    <p className="font-serif text-sm lg:text-base font-light text-white/5 tracking-wide leading-none mt-4 italic select-none">
                      Fazilet Hanım ve Kızları
                    </p>
                  </div>
                </div>
              )}
              {/* Refined gradient vignettes overlaying the poster artwork */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent" />
            </div>
            
            {/* Left aligned metadata content container */}
            <div className="relative z-10 max-w-2xl px-6 md:px-16 py-12 space-y-5 md:space-y-6">
              
              {/* Tiny subtle back trigger for mobile accessibility */}
              <button
                onClick={() => setSelectedVideoForDetails(null)}
                className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-400 hover:text-white cursor-pointer bg-black/60 border border-white/10 py-1 px-3 rounded-full transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#E50914]" />
                <span>{language === 'es' ? 'Volver al Inicio' : 'Back to Home'}</span>
              </button>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans leading-none tracking-tight text-white select-text">
                {language === 'es' ? selectedVideoForDetails.title_es : selectedVideoForDetails.title_en}
              </h1>

              {/* Precise Metadata formatting: Rating Badge • Year • Duration • Genre list */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-300">
                <span className="border border-white/25 text-white font-extrabold text-[11px] px-1.5 py-0.5 rounded bg-black/35 font-mono select-none">
                  {selectedVideoForDetails.rating || 'TV-14'}
                </span>
                <span className="font-sans select-all">{selectedVideoForDetails.year || '2017'}</span>
                {selectedVideoForDetails.duration && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span className="font-sans text-[#E2E2E2]">{selectedVideoForDetails.duration}</span>
                  </>
                )}
                <span className="text-gray-500">•</span>
                <span className="font-sans text-[#E2E2E2]">
                  {language === 'es' 
                    ? (selectedVideoForDetails.genre_es || 'Clásico').replace(/,/g, ' •') 
                    : (selectedVideoForDetails.genre_en || 'Classic').replace(/,/g, ' •')
                  }
                </span>
              </div>

              {/* Tagline / Movie Synopsis */}
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans font-medium max-w-xl drop-shadow-md select-text">
                {language === 'es' ? selectedVideoForDetails.description_es : selectedVideoForDetails.description_en}
              </p>

              {/* Actions row: Red Play Button & Circular items underneath */}
              <div className="flex flex-col gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveEpisode(null);
                    setIsPlayerOpen(true);
                  }}
                  className="w-full sm:w-auto self-start bg-[#E50914] text-white py-3 px-10 font-black rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2.5 cursor-pointer text-sm tracking-wide shadow-xl active:scale-95 duration-200"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>{language === 'es' ? 'Ver ahora' : 'Watch Now'}</span>
                </button>

                {/* Favorite & Share buttons underneath the Play Trigger */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(selectedVideoForDetails.id)}
                    className="w-11 h-11 rounded bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
                    title={t.myList}
                  >
                    <Heart className={`w-4.5 h-4.5 ${favorites.includes(selectedVideoForDetails.id) ? 'fill-[#E50914] text-[#E50914]' : 'text-gray-300'}`} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = window.location.href;
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        alert(language === 'es' ? '¡Enlace del video copiado!' : 'Link copied!');
                      });
                    }}
                    className="w-11 h-11 rounded bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer shadow-md"
                    title="Compartir"
                  >
                    <svg className="w-4.5 h-4.5 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC EPISODES BLOCK (Displayed if current selected video is a series with episodes or a telenovela) */}
          {((selectedVideoForDetails.episodes && selectedVideoForDetails.episodes.length > 0) || 
            selectedVideoForDetails.category === 'novelas' || 
            selectedVideoForDetails.category === 'series') && (() => {
              const videoId = selectedVideoForDetails.id;
              
              // Determine current season's total episode count
              const totalEpisodes = getEpisodeLimitForVideoAndSeason(videoId, selectedSeason);
              
              // Generate ranges dynamically in chunks of 25 episodes
              const tabs = getEpisodeTabsForCount(totalEpisodes);
              
              // Fallback to the first available tab if the current active tab is out of range
              const resolvedActiveTab = tabs.includes(activeEpisodeGroupTab) ? activeEpisodeGroupTab : tabs[0] || 'E1 - E25';

              return (
                <div id="episodes-container" className="max-w-7xl mx-auto px-6 md:px-16 py-8 border-b border-white/5 bg-neutral-950/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-3.5 mb-6">
                    
                    {/* Modern Season Selector Pill Controls & Count Indicator Badge */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs uppercase tracking-widest text-[#E50914] font-black">
                        {language === 'es' ? 'Temporada' : 'Season'}:
                      </span>
                      <div className="flex bg-neutral-900/80 p-0.5 rounded border border-white/10 shadow-inner">
                        {[1, 2, 3].map((season) => {
                          const isSelected = selectedSeason === season;
                          return (
                            <button
                              key={season}
                              onClick={() => {
                                setSelectedSeason(season);
                                setActiveEpisodeGroupTab('E1 - E25');
                              }}
                              className={`px-3.5 py-1 rounded text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#E50914] text-white shadow-md scale-105'
                                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                              }`}
                            >
                              {language === 'es' ? `T${season}` : `S${season}`}
                            </button>
                          );
                        })}
                      </div>

                      {/* Dynamic badge displaying the number of uploaded / available episodes for this season */}
                      <span className="text-[10px] sm:text-[11px] font-mono bg-neutral-900/80 border border-[#E50914]/20 px-2.5 py-1 rounded text-red-500 uppercase tracking-widest font-black flex items-center gap-1.5 select-none shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block"></span>
                        <span>{totalEpisodes} {language === 'es' ? 'Disponibles' : 'Available'}</span>
                      </span>
                    </div>

                    {/* Episode range tabs */}
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-none pr-4">
                      <div className="flex items-center gap-5 text-xs sm:text-sm font-bold tracking-wide">
                        {tabs.map(tab => {
                          const isActive = resolvedActiveTab === tab;
                          return (
                            <button
                              key={tab}
                              onClick={() => setActiveEpisodeGroupTab(tab)}
                              className={`pb-2 whitespace-nowrap transition-colors cursor-pointer relative ${
                                isActive ? 'text-white font-extrabold font-sans' : 'text-gray-400 hover:text-white font-medium'
                              }`}
                            >
                              <span>{tab}</span>
                              {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E50914] rounded-full animate-pulse" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {totalEpisodes > 25 && (
                        <button 
                          onClick={() => alert(language === 'es' ? 'Cargando más episodios...' : 'Loading more chapters...')}
                          className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                        >
                          <span>{language === 'es' ? 'Ver Más' : 'See More'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 justify-start scrollbar-none scroll-smooth">
                    {getEpisodesForVideo(selectedVideoForDetails, selectedSeason, resolvedActiveTab).map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => {
                          setActiveEpisode(ep);
                          setIsPlayerOpen(true);
                        }}
                        className="w-[180px] sm:w-[220px] md:w-[250px] shrink-0 group cursor-pointer transition-all duration-300"
                      >
                        <div className="aspect-video relative rounded-md overflow-hidden bg-neutral-900 border border-white/5 mb-3 group-hover:border-white/20 transition-all shadow-md">
                          <img
                            referrerPolicy="no-referrer"
                            src={ep.poster_url}
                            alt={ep.title_es}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-black/40 group-hover:bg-[#E50914]/90 backdrop-blur flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-white/10 shadow-inner">
                              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-0.5 px-0.5">
                          <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                            {language === 'es' ? ep.title_es : ep.title_en}
                          </h4>
                          <p className="text-[10px] text-gray-500 font-sans font-semibold">
                            S{ep.seasonNumber}E{ep.episodeNumber} • {ep.release_date} • {ep.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          }

          {/* TAMBIÉN TE PUEDE GUSTAR (You May Also Like) CLASSICS SECTION - Match TV Screenshot */}
          <div className="w-full px-6 md:px-16 py-10" id="tambien-te-puede-gustar-section">
            <h3 className="text-xl md:text-2xl font-black text-white mb-6 font-sans tracking-tight">
              {language === 'es' ? 'También te puede gustar' : 'You may also like'}
            </h3>
            
            {/* Horizontal Grid Slider of Retro Golden Era Cinema or Soap Opera Posters */}
            <div className="relative group/carousel w-full">
              {/* Left Arrow Button */}
              <button
                onClick={() => scrollCarousel(recommendedCarouselRef, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-[85%] px-4 bg-black/60 hover:bg-black/95 text-white rounded-r-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center cursor-pointer border-r border-t border-b border-white/10 hover:scale-105 active:scale-95 shadow-md"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div 
                ref={recommendedCarouselRef}
                className="flex gap-4 overflow-x-auto pb-2 pt-1 justify-start no-scrollbar scroll-smooth mask-fade-right w-full"
              >
                {((selectedVideoForDetails.category === 'novelas' || selectedVideoForDetails.category === 'series') ? RECIEN_AGREGADO_NOVELAS : RECIEN_AGREGADO_CLASSICS).map((classic) => {
                  const isSelected = selectedVideoForDetails.id === classic.id;
                  const isNovela = classic.category === 'novelas';
                  return (
                    <div
                      key={classic.id}
                      onClick={() => handleSelectClassicMovie(classic)}
                      className="w-[120px] sm:w-[150px] md:w-[172px] shrink-0 group cursor-pointer transition-all duration-300 select-none"
                      title={language === 'es' ? classic.title_es : classic.title_en}
                    >
                      <div className="aspect-[2/3] relative rounded-[4px] overflow-hidden bg-neutral-900 border-[3.5px] border-[#eae6ce] group-hover:border-white transition-all duration-300 shadow-xl group-hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)]">
                        <img
                          referrerPolicy="no-referrer"
                          src={classic.poster_url}
                          alt={classic.title_es}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        {/* Dark gradient vignette over poster card */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5">
                          <span className="text-[9px] uppercase tracking-wider text-[#E50914] font-black mb-0.5">
                            {isNovela ? (language === 'es' ? 'Novela' : 'Novela') : (language === 'es' ? 'Cine de Oro' : 'Classic Cinema')}
                          </span>
                          <h4 className="text-[10px] sm:text-xs font-black text-white leading-tight mb-1 truncate">
                            {language === 'es' ? classic.title_es : classic.title_en}
                          </h4>
                          <p className="text-[8px] sm:text-[9px] text-gray-300 font-sans leading-relaxed line-clamp-3">
                            {language === 'es' ? classic.description_es : classic.description_en}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              <button
                onClick={() => scrollCarousel(recommendedCarouselRef, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-[85%] px-4 bg-black/60 hover:bg-black/95 text-white rounded-l-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center cursor-pointer border-l border-t border-b border-white/10 hover:scale-105 active:scale-95 shadow-md"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* MÁS DETALLES (More Details Column Grid Layout) */}
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 border-t border-white/5 font-sans">
            <h3 className="text-xl md:text-2xl font-black text-white mb-8 tracking-tight font-sans uppercase">
              {language === 'es' ? 'Más Detalles' : 'More Details'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 select-text">
              
              {/* Left Column (Géneros, Clasificación, País de Origen) */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest uppercase mb-1.5 font-sans select-none">
                    {language === 'es' ? 'GÉNEROS' : 'GENRES'}
                  </h5>
                  <p className="text-sm md:text-base text-gray-200 font-bold font-sans">
                    {language === 'es' ? selectedVideoForDetails.genre_es : selectedVideoForDetails.genre_en}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest uppercase mb-1.5 font-sans select-none">
                    {language === 'es' ? 'CLASIFICACIÓN' : 'CLASSIFICATION'}
                  </h5>
                  <div className="pt-0.5">
                    <span className="inline-block border border-white/20 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded bg-white/[0.08] font-mono tracking-wider select-none">
                      {selectedVideoForDetails.rating || 'TV-PG'}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest uppercase mb-1.5 font-sans select-none">
                    {language === 'es' ? 'PAÍS DE ORIGEN' : 'COUNTRY OF ORIGIN'}
                  </h5>
                  <p className="text-sm md:text-base text-gray-200 font-bold font-sans">
                    {selectedVideoForDetails.country || (language === 'es' ? 'México' : 'Mexico')}
                  </p>
                </div>
              </div>

              {/* Right Column (Protagonistas, Director) */}
              <div className="space-y-6">
                <div>
                  <h5 className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest uppercase mb-1.5 font-sans select-none">
                    {language === 'es' ? 'PROTAGONISTAS' : 'CAST'}
                  </h5>
                  <p className="text-sm md:text-base text-gray-200 font-bold leading-normal font-sans">
                    {selectedVideoForDetails.cast && selectedVideoForDetails.cast.length > 0 
                      ? selectedVideoForDetails.cast.join(', ') 
                      : 'María Antonieta Pons, Armando Calvo, José Piñeiro, Queta Lavat'}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] md:text-xs font-bold text-gray-500 tracking-widest uppercase mb-1.5 font-sans select-none">
                    {language === 'es' ? 'DIRECTOR' : 'DIRECTOR'}
                  </h5>
                  <p className="text-sm md:text-base text-gray-200 font-bold font-sans">
                    {selectedVideoForDetails.director || 'Miguel Zacarías'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACCORDION COMMENTS & RATINGS SECTION (Collapsed by default, styled beautifully) */}
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-4 mt-4">
            <details className="group bg-[#111112]/50 border border-white/5 rounded-xl p-4 cursor-pointer outline-none transition-colors hover:border-white/10">
              <summary className="text-xs md:text-sm font-bold text-gray-400 flex items-center justify-between list-none select-none">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#E50914]" />
                  <span>{language === 'es' ? 'Comentarios de Fans & Reseñas' : 'Fan Reviews & Feedback'}</span>
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-white/5 mt-4 cursor-default" onClick={e => e.stopPropagation()}>
                
                {/* Details note */}
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
                    {language === 'es' 
                      ? 'Únete a la conversación. Deja tu reseña con estrellas sobre esta transmisión clásica y comparte tu opinión con otros amantes de las películas retro.' 
                      : 'Join the conversation. Leave your star review on this classic stream and share your feedback with other retro movie lovers.'
                    }
                  </p>
                  <div className="bg-[#1C1C1E]/40 border border-white/5 p-3 rounded text-[11px] text-gray-400 font-sans">
                    <strong>{language === 'es' ? 'Señal de Transmisión:' : 'Broadcast Signal:'}</strong> Cine de Oro Clásicos • 1080p Standby
                  </div>
                </div>

                {/* Submit review */}
                <div className="space-y-4 bg-black/40 border border-white/5 p-4 rounded-xl">
                  <h5 className="text-xs font-bold text-white uppercase tracking-widest">
                    <span>{language === 'es' ? 'Escribe una Reseña' : 'Write a Review'}</span>
                  </h5>

                  <form onSubmit={handleSubmitReview} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        placeholder="user@example.com"
                        value={commentEmail}
                        onChange={(e) => setCommentEmail(e.target.value)}
                        className="bg-black border border-white/5 rounded px-2 py-1.5 text-xs outline-none text-white focus:border-[#E50914] font-sans"
                      />
                      <select
                        value={commentRating}
                        onChange={(e) => setCommentRating(parseInt(e.target.value))}
                        className="bg-black border border-white/5 rounded px-1 py-1.5 text-xs outline-none text-white focus:border-[#E50914] font-sans font-semibold text-yellow-500"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐</option>
                        <option value={4}>⭐⭐⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={1}>⭐</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder={language === 'es' ? '¿Qué te pareció este stream?' : 'What did you think?'}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-black border border-white/5 rounded px-2.5 py-1.5 text-xs outline-none text-white resize-none focus:border-[#E50914] font-sans"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#E50914] text-white py-2 rounded text-xs font-bold transition-all hover:bg-red-700 cursor-pointer"
                    >
                      {language === 'es' ? 'Enviar Comentario' : 'Submit'}
                    </button>
                  </form>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {reviews.filter(r => r.video_id === selectedVideoForDetails.id).length === 0 ? (
                      <p className="text-[10px] text-gray-500 italic text-center py-2">
                        {language === 'es' ? 'No hay comentarios aún.' : 'No reviews yet.'}
                      </p>
                    ) : (
                      reviews.filter(r => r.video_id === selectedVideoForDetails.id).map(rev => (
                        <div key={rev.id} className="bg-black/50 p-2 rounded text-[11px] space-y-1">
                          <div className="flex justify-between items-center text-gray-400 font-sans">
                            <strong className="truncate max-w-[120px] font-bold text-gray-200">{rev.user_email}</strong>
                            <span className="text-[9px]">{rev.date}</span>
                          </div>
                          <p className="text-gray-300 font-medium font-sans">"{rev.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </details>
          </div>

        </section>
      )}

      {/* 
        PREMIUM CINEMATIC MULTI-SLIDESHOW HERO CAROUSEL 
        Only visible when no specific details video is selected
      */}
      {searchQuery === '' && !selectedVideoForDetails && selectedCategory === 'all' && (() => {
        const premiumSlides = [
          {
            id: "v-ruptura",
            title_es: "La Ruptura de la Fe",
            title_en: "The Broken Faith",
            description_es: "Julian Gil explora la ruptura entre la selección y sus fans.",
            description_en: "Julian Gil explores the rift between the national team and its fans.",
            image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600",
            rating: "TV-PG",
            year: "2026",
            tag_es: "Deportes • Fútbol",
            tag_en: "Sports • Soccer",
            brandBadge: (
              <div className="absolute right-6 md:right-16 bottom-20 md:bottom-28 hidden lg:flex flex-col items-end gap-1 pointer-events-none select-none text-right">
                <span className="bg-[#E50914] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded">
                  Canela Original
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight italic mt-2 leading-none drop-shadow">
                  EL QUINTO <span className="text-[#E50914]">PARTIDO</span>
                </h2>
                <p className="text-xs text-gray-300 font-mono font-medium drop-shadow-sm">by Julian Gil</p>
                <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-4 bg-black/45 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm shadow-xl">
                  <span>Presentado por</span>
                  <span className="text-gray-200 font-extrabold tracking-wider">HYUNDAI</span>
                </div>
              </div>
            )
          },
          {
            id: "v-hercai",
            title_es: "Hercai, Amor y Venganza",
            title_en: "Hercai, Love & Vengeance",
            description_es: "Miran quiere vengar la muerte de sus padres, pero su plan se complica cuando en el camino se enamora de Reyyan en un torbellino de romance turco.",
            description_en: "Miran seeks parental vengeance but falls head-over-heels for Reyyan in an intense Turkish romance in Cappadocia.",
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600",
            rating: "TV-14",
            year: "2019",
            tag_es: "Novelas • Drama • Romance",
            tag_en: "Soap Operas • Drama • Romance",
            brandBadge: (
              <div className="absolute right-6 md:right-16 bottom-20 md:bottom-28 hidden lg:flex flex-col items-end gap-1 pointer-events-none select-none text-right">
                <span className="bg-amber-500 text-black text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-lg">
                  Tendencia Global
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-2 leading-none drop-shadow font-serif">
                  HERCAI <span className="text-amber-400 font-normal italic font-sans">Amor</span>
                </h2>
                <p className="text-xs text-gray-300 font-mono font-medium drop-shadow-sm">Miran & Reyyan</p>
                <div className="flex items-center gap-1.5 text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-4 bg-black/45 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm shadow-xl">
                  <span>Sección</span>
                  <span className="text-white font-extrabold tracking-wider">PASIÓN TURCA</span>
                </div>
              </div>
            )
          },
          {
            id: "v-fazilet",
            title_es: "La Señora Fazilet y Sus Hijas",
            title_en: "La Señora Fazilet y Sus Hijas",
            description_es: "Una madre obsesionada con ascender socialmente empuja a sus hijas a un mundo de lujo y poder, donde el amor, la rivalidad y los secretos familiares lo cambian todo.",
            description_en: "A mother obsessed with social climbing pushes her daughters into a world of luxury and power, where love, rivalry, and family secrets change everything.",
            image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1600",
            rating: "TV-14",
            year: "2017",
            tag_es: "Novela • Drama • Pasión",
            tag_en: "Soap Opera • Drama • Passion",
            brandBadge: (
              <div className="absolute right-6 md:right-16 bottom-20 md:bottom-28 hidden lg:flex flex-col items-end gap-1 pointer-events-none select-none text-right">
                <span className="bg-[#E50914] text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-lg animate-pulse">
                  Estreno Exclusivo
                </span>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-2 leading-none drop-shadow font-serif">
                  LA SEÑORA <span className="text-red-400 font-normal italic font-sans">Fazilet</span>
                </h2>
                <p className="text-xs text-gray-300 font-mono font-medium drop-shadow-sm">Fazilet Hanım ve Kızları</p>
                <div className="flex items-center gap-1.5 text-[9px] text-red-500 font-bold uppercase tracking-widest mt-4 bg-black/45 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm shadow-xl">
                  <span>Sección</span>
                  <span className="text-white font-extrabold tracking-wider">PASIÓN TURCA</span>
                </div>
              </div>
            )
          },
          {
            id: "v-secretos",
            title_es: "Secretos de Villanas",
            title_en: "Secrets of Villains",
            description_es: "Las villanas más icónicas de las telenovelas se reúnen en unas vacaciones explosivas llenas de lujo, drama y verdades reveladas.",
            description_en: "The most legendary soap opera villain actors unite under a single roof on a tropical resort vacation to trigger explosive drama.",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600",
            rating: "TV-14",
            year: "2022",
            tag_es: "Series • Reality Show • Drama",
            tag_en: "Series • Reality Show • Drama",
            brandBadge: (
              <div className="absolute right-6 md:right-16 bottom-20 md:bottom-28 hidden lg:flex flex-col items-end gap-1 pointer-events-none select-none text-right">
                <span className="bg-indigo-600 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded shadow-lg">
                  Reality Exclusivo
                </span>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-2 leading-none drop-shadow">
                  SECRETOS DE <span className="text-yellow-400">VILLANAS</span>
                </h2>
                <p className="text-xs text-gray-300 font-mono font-medium drop-shadow-sm font-sans">Laura Zapata, Gaby Spanic & Elenco</p>
                <div className="flex items-center gap-1.5 text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-4 bg-black/45 px-3 py-1.5 rounded border border-white/10 backdrop-blur-sm shadow-xl font-sans">
                  <span>¡VACACIONES AL EXTREMO!</span>
                </div>
              </div>
            )
          }
        ];

        const activeSlide = premiumSlides[currentHeroIndex];

        return (
          <section className="relative w-full overflow-hidden bg-[#0A0A0B] animate-fadeIn">
            <div className="relative h-[65vh] md:h-[82vh] w-full flex items-center justify-start overflow-hidden bg-[#0A0A0B]">
              <div className="absolute inset-0 z-0">
                <img
                  referrerPolicy="no-referrer"
                  src={activeSlide.image}
                  alt={activeSlide.title_es}
                  className="w-full h-full object-cover opacity-60 object-center transition-all duration-1000 transform scale-100 hover:scale-105"
                />
                {/* Soft cinematic gradient shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent" />
              </div>

              {/* Floating graphics from the active slide */}
              {activeSlide.brandBadge}

              {/* Slide switcher Chevron Left */}
              <button
                type="button"
                onClick={() => {
                  setCurrentHeroIndex(prev => (prev - 1 + premiumSlides.length) % premiumSlides.length);
                }}
                className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 hover:bg-neutral-900/80 flex items-center justify-center text-white cursor-pointer transition-all hover:scale-115 active:scale-95 group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#E50914] transition-colors" />
              </button>

              {/* Slide switcher Chevron Right */}
              <button
                type="button"
                onClick={() => {
                  setCurrentHeroIndex(prev => (prev + 1) % premiumSlides.length);
                }}
                className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 border border-white/10 hover:bg-neutral-900/80 flex items-center justify-center text-white cursor-pointer transition-all hover:scale-115 active:scale-95 group"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#E50914] transition-colors" />
              </button>

              {/* Left Content aligned perfectly to tv screenshots */}
              <div className="relative z-10 max-w-4xl px-8 md:px-16 space-y-4 md:space-y-5 pt-12">
                
                {/* Dynamic premium label */}
                <div className="flex items-center gap-2">
                  <span className="bg-[#E50914] text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-sm shadow select-none animate-pulse">
                    ★ CANELA ORIGINAL SPECIAL
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans leading-none tracking-tight text-white uppercase transition-all duration-700">
                  {language === 'es' ? activeSlide.title_es : activeSlide.title_en}
                </h1>

                {/* Metadata items */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-300">
                  <span className="border border-white/20 text-white font-extrabold text-[11px] px-1.5 py-0.5 rounded bg-black/25 font-mono">
                    {activeSlide.rating}
                  </span>
                  <span>{activeSlide.year}</span>
                  <span>•</span>
                  <span>{language === 'es' ? activeSlide.tag_es : activeSlide.tag_en}</span>
                  <span>•</span>
                  <span className="text-yellow-400 flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span>Free UltraHD Stream</span>
                  </span>
                </div>

                <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-xl font-sans drop-shadow transition-all duration-500">
                  {language === 'es' ? activeSlide.description_es : activeSlide.description_en}
                </p>

                {/* Slider Buttons and custom slide lines row */}
                <div className="flex flex-col gap-6 pt-3">
                  
                  {/* Watch Button */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const targetVid = videos.find(v => v.id === activeSlide.id) || videos[0];
                        setActiveVideo(targetVid);
                        setActiveEpisode(null);
                        setIsPlayerOpen(true);
                      }}
                      className="bg-[#E50914] text-white py-3 px-8 font-extrabold rounded-md hover:bg-red-700 transition-all flex items-center justify-center gap-2.5 cursor-pointer text-sm tracking-wide shadow-xl active:scale-95"
                    >
                      <Play className="w-4.5 h-4.5 fill-white text-white" />
                      <span>{language === 'es' ? 'Ver ahora' : 'Watch Now'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const targetVid = videos.find(v => v.id === activeSlide.id) || videos[0];
                        handleSelectVideo(targetVid);
                      }}
                      className="bg-neutral-900/90 hover:bg-neutral-800 text-white py-3 px-6 font-bold rounded-md transition-all border border-white/10 flex items-center gap-1.5 text-xs tracking-wide cursor-pointer"
                    >
                      <span>{language === 'es' ? 'Ficha Técnica' : 'Movie Specs'}</span>
                    </button>
                  </div>

                  {/* Flat custom dash horizontal indicators representing active slide */}
                  <div className="flex items-center gap-1.5 select-none pt-2">
                    {premiumSlides.map((dot, dIdx) => (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => setCurrentHeroIndex(dIdx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentHeroIndex === dIdx ? 'w-10 bg-white' : 'w-2.5 bg-white/25 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${dIdx + 1}`}
                      />
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </section>
        );
      })()}

      {/* FILTER SEARCH INFORMATION BADGE */}
      {searchQuery && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <p className="text-sm text-gray-400 font-sans">
            {language === 'es' ? 'Resultados para la búsqueda:' : 'Search results for:'}{" "}
            <span className="text-yellow-400 font-extrabold italic">"{searchQuery}"</span>
          </p>
        </div>
      )}

      {/* FAVORITES BOOKMARKS ROW */}
      {favorites.length > 0 && selectedCategory === 'all' && searchQuery === '' && !selectedVideoForDetails && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
          <h3 className="text-base md:text-lg font-black mb-4 tracking-tight flex items-center gap-2 text-white">
            <Heart className="w-4 h-4 text-rose-500 fill-current" />
            <span>{t.myList}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {videos
              .filter(v => favorites.includes(v.id))
              .map(vid => (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className="bg-neutral-900 border border-white/5 hover:border-[#E50914]/40 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-md relative"
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-neutral-950">
                    <img
                      referrerPolicy="no-referrer"
                      src={vid.poster_url}
                      alt={language === 'es' ? vid.title_es : vid.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <div className="p-1 bg-[#E50914] text-white rounded-full shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-[11px] font-bold text-white truncate">
                      {language === 'es' ? vid.title_es : vid.title_en}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                      {vid.year} • {vid.duration}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* MAIN SHELVES DISPLAY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        
        {/* VIEWPORTS ROUTER FOR SPECIFIC CATEGORY TABS OR SEARCH */}
        {(selectedCategory !== 'all' || searchQuery !== '') && (
          <section className="space-y-6 animate-fadeIn pb-12">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>
                  {searchQuery 
                    ? (language === 'es' ? 'Búsqueda' : 'Search Results')
                    : (language === 'es' ? `${selectedCategory}` : `${selectedCategory}`)
                  }
                </span>
                <span className="text-[11px] text-gray-500 font-mono font-normal">
                  ({filteredVideos.length} {language === 'es' ? 'títulos' : 'videos'})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredVideos.map(vid => (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className="bg-neutral-900 border border-white/5 hover:border-[#E50914]/40 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-md relative"
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-neutral-950">
                    <img
                      referrerPolicy="no-referrer"
                      src={vid.poster_url}
                      alt={language === 'es' ? vid.title_es : vid.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="p-1.5 bg-[#E50914] text-white rounded-full shadow-lg">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold text-white truncate">
                      {language === 'es' ? vid.title_es : vid.title_en}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      {vid.year} • {vid.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 
          DEFAULT CAROUSEL LANDING HOMEPAGE (ONLY RENDERS WHEN IN 'all' CAT & NO DETAILS VIEW IS SELECTED)
        */}
        {selectedCategory === 'all' && searchQuery === '' && !selectedVideoForDetails && (
          <>
            {/* ROW 1: RECIEN AGREGADO (EXACT SCREENSHOT ROW 1) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2 font-sans">
                  <span>{language === 'es' ? 'Recién Agregado' : 'Newly Added'}</span>
                  <button 
                    onClick={() => alert(language === 'es' ? 'Explorando Recién Agregado...' : 'Viewing all newly added...')}
                    className="text-xs font-bold text-gray-400 hover:text-[#E50914] transition-colors cursor-pointer"
                  >
                    Más &gt;
                  </button>
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollCarousel(newlyAddedRef, 'left')}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollCarousel(newlyAddedRef, 'right')}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                ref={newlyAddedRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 justify-start scrollbar-none scroll-smooth"
              >
                {/* Custom explicit exact ordered cards row 1 */}
                {['v-ruptura', 'v-pinamadura', 'v-venganzasalvaje', 'v-undivorcio', 'v-glorias', 'v-unamigo', 'v-pobrespero', 'v-desolado', 'v-designacion']
                  .map(id => videos.find(v => v.id === id))
                  .filter(Boolean)
                  .map(vid => (
                    <div
                      key={vid!.id}
                      onClick={() => handleSelectVideo(vid!)}
                      className="w-[140px] sm:w-[170px] shrink-0 bg-neutral-900 border border-white/5 hover:border-[#E50914]/30 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-md relative"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden bg-neutral-950">
                        <img
                          referrerPolicy="no-referrer"
                          src={vid!.poster_url}
                          alt={language === 'es' ? vid!.title_es : vid!.title_en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <div className="p-1 bg-[#E50914] text-white rounded-full shadow-lg">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5">
                        <h4 className="text-[11px] font-bold text-white truncate max-w-full group-hover:text-[#E50914] transition-colors">
                          {language === 'es' ? vid!.title_es : vid!.title_en}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                          {vid!.year} • {vid!.duration}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* ROW 2: SERIES MAS POPULARES (EXACT SCREENSHOT ROW 2) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2 font-sans">
                  <span>{language === 'es' ? 'Series Más Populares' : 'Most Popular Series'}</span>
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollCarousel(mostPopularRef, 'left')}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollCarousel(mostPopularRef, 'right')}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                ref={mostPopularRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 justify-start scrollbar-none scroll-smooth"
              >
                {/* Custom explicit exact ordered cards row 2 */}
                {['v-safir', 'v-corazon', 'v-mayday', 'v-hercai', 'v-esclava', 'v-secretos', 'v-capo', 'v-sintetas', 'v-promesa']
                  .map(id => videos.find(v => v.id === id))
                  .filter(Boolean)
                  .map(vid => (
                    <div
                      key={vid!.id}
                      onClick={() => handleSelectVideo(vid!)}
                      className="w-[140px] sm:w-[170px] shrink-0 bg-neutral-900 border border-white/5 hover:border-[#E50914]/30 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-md relative"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden bg-neutral-950">
                        <img
                          referrerPolicy="no-referrer"
                          src={vid!.poster_url}
                          alt={language === 'es' ? vid!.title_es : vid!.title_en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <div className="p-1 bg-[#E50914] text-white rounded-full shadow-lg">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5">
                        <h4 className="text-[11px] font-bold text-white truncate max-w-full group-hover:text-[#E50914] transition-colors">
                          {language === 'es' ? vid!.title_es : vid!.title_en}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                          {vid!.year} • {vid!.duration}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* ROW 3: LO MEJOR DE CANELA */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2 font-sans">
                  <span>{language === 'es' ? 'Lo Mejor de Canela' : 'The Best of Canela'}</span>
                  <button 
                    onClick={() => alert(language === 'es' ? 'Explorando Lo Mejor de Canela...' : 'Viewing Best of Canela...')}
                    className="text-xs font-bold text-gray-400 hover:text-[#E50914] transition-colors cursor-pointer"
                  >
                    Más &gt;
                  </button>
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollCarousel(bestOfCanelaRef, 'left')}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => scrollCarousel(bestOfCanelaRef, 'right')}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-gray-300 rounded-full transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                ref={bestOfCanelaRef}
                className="flex gap-4 overflow-x-auto pb-4 pt-1 justify-start scrollbar-none scroll-smooth"
              >
                {/* Mixed selection */}
                {['v-pinamadura', 'v-secretos', 'v-undivorcio', 'v-glorias', 'v-unamigo', 'v-desolado', 'v-designacion']
                  .map(id => videos.find(v => v.id === id))
                  .filter(Boolean)
                  .map(vid => (
                    <div
                      key={vid!.id}
                      onClick={() => handleSelectVideo(vid!)}
                      className="w-[140px] sm:w-[170px] shrink-0 bg-neutral-900 border border-white/5 hover:border-[#E50914]/30 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-md relative"
                    >
                      <div className="aspect-[2/3] relative overflow-hidden bg-neutral-950">
                        <img
                          referrerPolicy="no-referrer"
                          src={vid!.poster_url}
                          alt={language === 'es' ? vid!.title_es : vid!.title_en}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                          <div className="p-1 bg-[#E50914] text-white rounded-full shadow-lg">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5">
                        <h4 className="text-[11px] font-bold text-white truncate max-w-full group-hover:text-[#E50914] transition-colors">
                          {language === 'es' ? vid!.title_es : vid!.title_en}
                        </h4>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                          {vid!.year} • {vid!.duration}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </>
        )}

        {/* SECTION: USER UPLOADED LOCAL STREAMS (Always visible under carousels if exists) */}
        {customUploadedVideos.length > 0 && selectedCategory === 'all' && searchQuery === '' && !selectedVideoForDetails && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-sm font-black text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-purple-400" />
                <span>{t.customUploads}</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {customUploadedVideos.map(vid => (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className="bg-neutral-900 border border-white/5 hover:border-[#E50914]/30 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 shadow-md relative"
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-neutral-950">
                    <img
                      referrerPolicy="no-referrer"
                      src={vid.poster_url}
                      alt={language === 'es' ? vid.title_es : vid.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full shadow">
                      Local
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                      <div className="p-1 px-1.5 bg-[#E50914] text-white rounded-full shadow">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5">
                    <h4 className="text-[11.5px] font-bold text-white truncate">
                      {language === 'es' ? vid.title_es : vid.title_en}
                    </h4>
                    <p className="text-[9.5px] text-gray-400 font-mono mt-0.5">
                      {vid.year} • {vid.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NO SEARCH RESULTS DISPLAY */}
        {filteredVideos.length === 0 && (selectedCategory !== 'all' || searchQuery !== '') && (
          <div className="text-center py-24 bg-neutral-950 rounded-2xl border border-white/5 p-8 max-w-lg mx-auto select-none pointer-events-none">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
            <p className="text-white text-base font-bold mb-1">{t.noResults}</p>
            <p className="text-gray-500 text-xs text-center font-sans">
              {language === 'es' ? 'Prueba escribiendo otros términos o sube un video.' : 'Try typing other terms or upload a video.'}
            </p>
          </div>
        )}
      </main>

      {/* SCREENSHOT ACCURATE PREMIUM FOOTER SECTION */}
      <footer className="bg-[#0B0C0E] border-t border-white/5 px-6 md:px-16 py-12 mt-16 font-sans select-none text-gray-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Block (Logo, Copyright, General Corporate Links, Social Icons) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black tracking-tight text-[#E50914] font-sans">
                CANELA.TV
              </span>
              <p className="text-[11px] text-gray-400 font-sans tracking-tight">
                © 2026 Canela.TV es una división de Canela Media. Todos los derechos reservados.
              </p>
            </div>

            {/* Links Block matching the screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs font-semibold text-gray-300">
              <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Política de Privacidad'); }} className="hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <a href="#faq" onClick={(e) => { e.preventDefault(); alert('Preguntas Frecuentes'); }} className="hover:text-white transition-colors">
                Preguntas Frecuentes
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Contáctanos'); }} className="hover:text-white transition-colors">
                Contáctanos
              </a>
              <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Términos del Servicio'); }} className="hover:text-white transition-colors">
                Términos del Servicio
              </a>
              <a href="#about" onClick={(e) => { e.preventDefault(); alert('Acerca de'); }} className="hover:text-white transition-colors">
                Acerca de
              </a>
              <a href="#cookies" onClick={(e) => { e.preventDefault(); alert('Cookies'); }} className="hover:text-white transition-colors">
                Cookies
              </a>
              <a href="#club-terms" onClick={(e) => { e.preventDefault(); alert('Términos del Servicio de Club Canela'); }} className="hover:text-white transition-colors col-span-2 sm:col-span-3">
                Términos del Servicio de Club Canela
              </a>
            </div>

            {/* Social Connect List with accurate labels and clean social SVGs */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                Conecta con nosotros
              </span>
              <div className="flex items-center gap-4 text-gray-300">
                <a href="#facebook" onClick={(e) => { e.preventDefault(); alert('Facebook'); }} className="hover:text-white transition-all transform hover:scale-115">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z" />
                  </svg>
                </a>
                <a href="#instagram" onClick={(e) => { e.preventDefault(); alert('Instagram'); }} className="hover:text-white transition-all transform hover:scale-115">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="#twitter" onClick={(e) => { e.preventDefault(); alert('X (Twitter)'); }} className="hover:text-white transition-all transform hover:scale-115">
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#youtube" onClick={(e) => { e.preventDefault(); alert('YouTube'); }} className="hover:text-white transition-all transform hover:scale-115">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="#tiktok" onClick={(e) => { e.preventDefault(); alert('TikTok'); }} className="hover:text-white transition-all transform hover:scale-115">
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.54-4.06-1.42-.45-.34-.85-.73-1.21-1.16v6.84c.03 3.19-1.92 6.14-4.95 7.18-3.03 1.04-6.49.19-8.62-2.12-2.13-2.31-2.61-5.77-1.18-8.63 1.43-2.86 4.71-4.48 7.89-3.99v4.11a5.044 5.044 0 00-3.61 1.83c-1.14 1.4-1.27 3.47-.31 5.0 1.05 1.67 3.15 2.45 5.05 1.91 1.9-1.34 2.21-3.69 2.15-5.69V.02z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Block (Mira en cualquier lugar 24/7 + Badges + Device SVG Row) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Mira en cualquier lugar 24/7
              </span>
              
              {/* App store download badges - Screenshot Accurate */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Google Play badge design */}
                <a href="#googleplay" onClick={(e) => { e.preventDefault(); alert('Google Play Store App Download Link'); }} className="bg-black hover:bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 w-[140px] shadow-md transition-all">
                  <svg className="w-5 h-5 text-green-400 fill-current" viewBox="0 0 24 24">
                    <path d="M5.25 2.25L13.84 10.84L5.25 19.43V2.25ZM6.59 2.25H17.41L13.84 5.82L6.59 2.25ZM15.18 12.18L18.75 8.6L20.09 9.94C20.61 10.46 20.61 11.3 20.09 11.82L15.18 16.73V12.18ZM13.84 13.52L17.41 17.09H6.59L13.84 13.52Z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] text-gray-500 uppercase font-black leading-none">GET IT ON</span>
                    <span className="text-[11px] text-white font-extrabold tracking-tight leading-tight">Google Play</span>
                  </div>
                </a>

                {/* App Store badge design */}
                <a href="#appstore" onClick={(e) => { e.preventDefault(); alert('Apple App Store App Download Link'); }} className="bg-black hover:bg-neutral-900 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2 w-[140px] shadow-md transition-all">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.87-1.01 2.97 1.12.09 2.27-.58 2.94-1.4" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] text-gray-400 leading-none">Download on the</span>
                    <span className="text-[11px] text-white font-extrabold tracking-tight leading-tight">App Store</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Smart Devices Row matching TV icons exactly */}
            <div className="flex items-center gap-5 pt-3 text-gray-400 select-none">
              <span className="font-semibold text-xs text-white tracking-widest uppercase">Roku</span>
              <span className="font-semibold text-xs text-white tracking-widest uppercase flex items-center gap-0.5">
                <svg className="w-3.5 h-3.5 inline-block fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v2H9v-2H7v-2h2v-2H7v-2h2V8h2v2h2V8h2v2h-2v2h2v2h-2v2z" />
                </svg>
                Apple TV
              </span>
              <span className="font-semibold text-xs text-stone-300 italic">fire tv</span>
              <svg className="w-5 h-5 text-gray-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M6 21h12M12 17v4" />
                <path d="M17 7l-5 5-5-5" />
              </svg>
            </div>
            
            <div className="pt-2 text-[10px] text-stone-500 font-medium uppercase tracking-widest flex items-center gap-1.5 justify-start">
              <span>Cloud Sandbox Standby Playback</span>
              <span>•</span>
              <span>Dev Session: May 2026</span>
            </div>
          </div>

        </div>
      </footer>

      {/* RENDER THE CANELA BRANDED LOGIN MODAL FOR ADMINISTRATIVE PRIVILEGES */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        language={language}
        onLoginSuccess={(email) => {
          setIsLoggedIn(true);
          setCurrentUser(email);
          localStorage.setItem('canela_logged_in', 'true');
          localStorage.setItem('canela_current_user', email);
          setIsAdminOpen(true); // Automatically open the console on login for Frictionless user journey!
        }}
      />
    </div>
  );
}
