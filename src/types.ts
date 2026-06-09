export interface ResolutionOption {
  quality: string;
  size: string;
  downloadUrl: string;
}

export interface Movie {
  id: string;
  title: string;
  year: string;
  rating: string;
  genre: string[];
  language: string;
  duration: string;
  director: string;
  cast: string[];
  description: string;
  synopsis?: string;
  synopsisHindi?: string;
  tagline?: string;
  videoUrl: string;
  posterUrl: string;
  resolutionOptions: ResolutionOption[];
  qualityOptions?: { resolution: string; fileUrl: string; size: string }[];
}

export interface DownloadTask {
  id: string;
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  progress: number;
  status: "downloading" | "completed" | "error" | "paused";
  quality: string;
  size: string;
  speed: string;
  downloadUrl: string;
  localBlobUrl?: string; // Cacheable preview
}

export type LanguageCode = "hi" | "en";

export interface Translations {
  home: string;
  movies: string;
  searchPlaceholder: string;
  trending: string;
  bollywoodHits: string;
  sciFiFantasy: string;
  searchResults: string;
  playBtn: string;
  downloadBtn: string;
  watchlist: string;
  addedWatchlist: string;
  rating: string;
  duration: string;
  downloading: string;
  downloadComplete: string;
  directDownload: string;
  offlineDownloads: string;
  noOfflineMovies: string;
  offlineStatus: string;
  speed: string;
  language: string;
  director: string;
  cast: string;
  qualitySelect: string;
  playerTitle: string;
  subtitles: string;
  speedLabel: string;
  qualityLabel: string;
  close: string;
  aiPower: string;
  fallbackInfo: string;
  noResults: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    home: "Home",
    movies: "Movies Library",
    searchPlaceholder: "Search movies (e.g., Sholay, Sci-Fi, Inception)...",
    trending: "Trending Now",
    bollywoodHits: "Bollywood Blockbusters",
    sciFiFantasy: "Sci-Fi & Fantasy Universe",
    searchResults: "AI Search Results",
    playBtn: "Stream Now",
    downloadBtn: "Download Video",
    watchlist: "My Watchlist",
    addedWatchlist: "In Watchlist",
    rating: "Rating",
    duration: "Duration",
    downloading: "Downloading...",
    downloadComplete: "Downloaded successfully!",
    directDownload: "Download File to External Player",
    offlineDownloads: "My Downloads (Offline Hub)",
    noOfflineMovies: "No downloaded movies yet. Select any movie & download with ultra speed!",
    offlineStatus: "Offline Mode",
    speed: "Download Speed",
    language: "Language",
    director: "Director",
    cast: "Cast",
    qualitySelect: "Select Download Quality & Size",
    playerTitle: "OTT Player Live Streaming",
    subtitles: "Subtitles",
    speedLabel: "Playback Speed",
    qualityLabel: "Stream Resolution",
    close: "Close",
    aiPower: "AI-Powered Realtime Movie Database Enabled",
    fallbackInfo: "Showing preset movies library. Connect Gemini API in settings to search everything!",
    noResults: "No movies found matching your request. Try another keyword!"
  },
  hi: {
    home: "मुख्य पृष्ठ",
    movies: "फिल्म लाइब्रेरी",
    searchPlaceholder: "फिल्में खोजें (उदाहरण: शोले, साइंस-फिक्शन, इंसेप्शन)...",
    trending: "आज का ट्रेंडिंग",
    bollywoodHits: "बॉलीवुड ब्लॉकबस्टर",
    sciFiFantasy: "साइंस-फिक्शन और काल्पनिक दुनिया",
    searchResults: "AI खोज के परिणाम",
    playBtn: "अभी देखें (प्ले)",
    downloadBtn: "वीडियो डाउनलोड करें",
    watchlist: "मेरी पसंदीदा सूची",
    addedWatchlist: "पसंदीदा सूची में है",
    rating: "रेटिंग",
    duration: "अवधि",
    downloading: "डाउनलोड हो रहा है...",
    downloadComplete: "डाउनलोड सफलतापूर्वक पूरा हुआ!",
    directDownload: "स्थानीय प्लेयर (VLC/MX) के लिए डाउनलोड करें",
    offlineDownloads: "मेरी डाउनलोड फाइलें (ऑफ़लाइन हब)",
    noOfflineMovies: "अभी तक कोई डाउनलोड की गई फिल्म नहीं है। फिल्म चुनकर सुपर स्पीड में डाउनलोड करें!",
    offlineStatus: "ऑफ़लाइन मोड",
    speed: "डाउनलोड स्पीड",
    language: "भाषा",
    director: "निर्देशक",
    cast: "कलाकार",
    qualitySelect: "डाउनलोड क्वालिटी और साइज चुनें",
    playerTitle: "OTT लाइव वीडियो प्रदाता",
    subtitles: "सबटाइटल्स",
    speedLabel: "प्लेबैक स्पीड",
    qualityLabel: "स्ट्रीम क्वालिटी",
    close: "बंद करें",
    aiPower: "AI-संचालित रीयल-टाइम मूवी डेटाबेस सक्रिय है",
    fallbackInfo: "पूर्व-निर्धारित फिल्में दिख रही हैं। पूरी खोज के लिए सेटिंग्स में Gemini API जोड़ें!",
    noResults: "आपकी खोज के लिए कोई फिल्म नहीं मिली। दूसरा नाम खोजें!"
  }
};
