"use client";

import React, { useState, useEffect } from "react";
import { 
  Tv, Sparkles, AlertTriangle, Monitor, Download, Play, Plus, Check, Star, 
  Trash2, Filter, Languages, RefreshCw, Film, Clock, HelpCircle, HardDrive, 
  ExternalLink, ListChecks, CheckCircle2, ChevronRight, PlayCircle, Pause,
  ListVideo
} from "lucide-react";
import Navbar from "./components/Navbar";
import VideoPlayer from "./components/VideoPlayer";
import { Movie, DownloadTask, LanguageCode, TRANSLATIONS } from "./types";

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>("hi");
  const [tab, setTab] = useState<"home" | "library" | "downloads">("home");
  const [downloadSubTab, setDownloadSubTab] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [geminiActive, setGeminiActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // Curated categories
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [bollywoodMovies, setBollywoodMovies] = useState<Movie[]>([]);
  const [scifiMovies, setScifiMovies] = useState<Movie[]>([]);
  
  // Player state
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  
  // Hydration state
  const [isClient, setIsClient] = useState(false);
  
  // Watchlist (persisted in localStorage)
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Downloads (persisted in localStorage)
  const [downloadTasks, setDownloadTasks] = useState<DownloadTask[]>([]);

  // Quality selecting modal/state
  const [selectingQualityMovie, setSelectingQualityMovie] = useState<Movie | null>(null);
  const [selectedQualityOption, setSelectedQualityOption] = useState<any>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const t = TRANSLATIONS[language];

  // Initialize and load state safe on Client Side
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const savedWatch = localStorage.getItem("cinestream_watchlist");
      if (savedWatch) {
        setWatchlist(JSON.parse(savedWatch));
      } else {
        setWatchlist(["stellar-voyage", "valley-quest"]);
      }

      const savedTasks = localStorage.getItem("cinestream_download_tasks");
      if (savedTasks) {
        setDownloadTasks(JSON.parse(savedTasks));
      } else {
        setDownloadTasks([
          {
            id: "dl-offline-1",
            movieId: "stellar-voyage",
            movieTitle: "The Stellar Voyage: Infinite Horizon",
            posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            progress: 100,
            status: "completed",
            quality: "1080p (Full HD)",
            size: "135 MB",
            speed: "12.4 MB/s",
            downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
          }
        ]);
      }
    }
  }, []);

  // Sync Watchlist & Downloads to localStorage only when loaded
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cinestream_watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cinestream_download_tasks", JSON.stringify(downloadTasks));
    }
  }, [downloadTasks, isClient]);


  // Load catalog on startup
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setIsSearching(true);
      const res = await fetch("/api/movies");
      if (res.ok) {
        const data: Movie[] = await res.json();
        setTrendingMovies(data);
        if (data.length > 0) {
          setFeaturedMovie(data[0]);
        }
        // Group movies by criteria
        setBollywoodMovies(data.filter(m => {
          const syncHindi = m.id.includes("gadar") || m.title.toLowerCase().includes("gadar") || (m.synopsisHindi && m.synopsisHindi.length > 0);
          return syncHindi;
        }));
        setScifiMovies(data.filter(m => 
          m.genre.some(g => g.toLowerCase().includes("sci") || g.toLowerCase().includes("fant") || g.toLowerCase().includes("anim"))
        ));
        setGeminiActive(true); // Connected server context
      }
    } catch (err) {
      console.error("Failed loading curated movie catalog:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Trigger search payload
  const handleSearch = async (query: string) => {
    if (!query || query.trim() === "") {
      setResults([]);
      setTab("home");
      return;
    }

    try {
      setIsSearching(true);
      setTab("library");
      const res = await fetch(`/api/movies?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Error searching titles:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Show short user notification
  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Toggle watchlist state
  const toggleWatchlist = (id: string, name: string) => {
    if (watchlist.includes(id)) {
      setWatchlist(prev => prev.filter(item => item !== id));
      showToast(language === "hi" ? `${name} को पसंदीदा सूची से हटाया गया` : `${name} removed from Watchlist`, "info");
    } else {
      setWatchlist(prev => [...prev, id]);
      showToast(language === "hi" ? `${name} को पसंदीदा सूची में जोड़ा गया!` : `${name} added to Watchlist!`, "success");
    }
  };

  // Centralized download simulator tick loop
  useEffect(() => {
    const activeTasks = downloadTasks.filter(t => t.status === "downloading");
    if (activeTasks.length === 0) return;

    const timer = setTimeout(() => {
      setDownloadTasks(prevTasks => {
        let changed = false;
        const updated = prevTasks.map(task => {
          if (task.status !== "downloading") return task;

          changed = true;
          const currentProgress = task.progress;
          // Increment progress elegantly
          const increment = Math.floor(Math.random() * 8) + 4;
          const nextProgress = Math.min(100, currentProgress + increment);

          if (nextProgress === 100) {
            // Trigger side effect for completion toast
            setTimeout(() => {
              showToast(
                language === "hi"
                  ? `${task.movieTitle} (${task.quality}) डाउनलोड पूरा हुआ!`
                  : `${task.movieTitle} (${task.quality}) downloaded successfully!`,
                "success"
              );
            }, 10);

            return {
              ...task,
              progress: 100,
              status: "completed" as const,
              speed: "Finished"
            };
          } else {
            // Speeds fluctuating based on realistic profiles
            let speedMbps = (Math.random() * 8 + 8);
            if (task.quality.includes("2160p")) {
              speedMbps += 12; // Extra premium speed representation for 4K paths
            }
            const speed = `${speedMbps.toFixed(1)} MB/s`;

            return {
              ...task,
              progress: nextProgress,
              speed
            };
          }
        });

        return changed ? updated : prevTasks;
      });
    }, 850);

    return () => clearTimeout(timer);
  }, [downloadTasks, language]);

  // Gracefully pause lingering "downloading" tasks on launch to avoid visual freezes
  useEffect(() => {
    setDownloadTasks(prev => {
      const hasDownloading = prev.some(t => t.status === "downloading");
      if (!hasDownloading) return prev;
      return prev.map(t => 
        t.status === "downloading" ? { ...t, status: "paused" as const, speed: "Paused" } : t
      );
    });
  }, []);

  // New start download sequence
  const startDownload = (movie: Movie, option: any) => {
    const taskExists = downloadTasks.find(t => t.movieId === movie.id && t.quality === option.resolution);
    if (taskExists && taskExists.status === "completed") {
      showToast(
        language === "hi" 
          ? "ये क्वालिटी पहले से डाउनलोड है!" 
          : "This quality is already downloaded!", 
        "info"
      );
      setSelectingQualityMovie(null);
      return;
    }

    if (taskExists && (taskExists.status === "paused" || taskExists.status === "downloading")) {
      showToast(
        language === "hi" 
          ? "यह डाउनलोड पहले से ही सक्रिय है।" 
          : "This download task is already in queue.", 
        "info"
      );
      setSelectingQualityMovie(null);
      setTab("downloads");
      return;
    }

    // Insert task directly to active downloading state
    const taskId = `dl-${Date.now()}`;
    const newTask: DownloadTask = {
      id: taskId,
      movieId: movie.id,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      progress: 0,
      status: "downloading" as const,
      quality: option.resolution,
      size: option.size,
      speed: "Connecting...",
      downloadUrl: option.fileUrl
    };

    setDownloadTasks(prev => [newTask, ...prev]);
    setSelectingQualityMovie(null);
    setTab("downloads");

    showToast(
      language === "hi" 
        ? `${movie.title} (${option.resolution}) डाउनलोड शुरू!` 
        : `Started downloading ${movie.title} (${option.resolution})!`,
      "success"
    );
  };

  const pauseDownload = (id: string, name: string) => {
    setDownloadTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: "paused" as const, speed: "Paused" } : t
    ));
    showToast(
      language === "hi" 
        ? `${name} रोक दी गई` 
        : `Paused ${name} download`, 
      "info"
    );
  };

  const resumeDownload = (id: string, name: string) => {
    setDownloadTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: "downloading" as const, speed: "Connecting..." } : t
    ));
    showToast(
      language === "hi" 
        ? `${name} पुनः प्रारंभ किया गया` 
        : `Resumed ${name} download`, 
      "success"
    );
  };

  // Trigger immediate external prompt download (satisfying "kisi bhi local video player me play kar sake")
  const triggerNativeDownload = (movieName: string, resolution: string, url: string) => {
    const cleanMovieName = movieName.replace(/\s+/g, "_");
    const downloadLink = `/api/download?url=${encodeURIComponent(url)}&fileName=${encodeURIComponent(cleanMovieName)}&quality=${encodeURIComponent(resolution)}`;
    
    // Create physical clicking element to bypass sandbox limits
    const anchor = document.createElement("a");
    anchor.href = downloadLink;
    anchor.setAttribute("download", `${cleanMovieName}_${resolution}.mp4`);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    showToast(
      language === "hi" 
        ? "लोकल प्लेयर के लिए डाउनलोड शुरू हुआ! फ़ाइल VLC या MX Player में चलेगी।" 
        : "Downloading file context! File is ready to play inside local players.",
      "success"
    );
  };

  const removeDownload = (id: string) => {
    setDownloadTasks(prev => prev.filter(t => t.id !== id));
    showToast(language === "hi" ? "डाउनलोड फ़ाइल हटाई गई" : "Download path removed", "info");
  };

  return (
    <div className="bg-[#0A0A0A] text-gray-100 font-sans min-h-screen flex flex-col selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* Toast Alert Header Block */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] max-w-sm w-full bg-neutral-900 border-l-4 border-red-600 text-white p-4 rounded shadow-2xl flex items-center gap-3 animate-fade-in-down">
          <Sparkles className="w-5 h-5 text-red-500 shrink-0" />
          <div className="text-xs md:text-sm font-semibold">{toast.message}</div>
        </div>
      )}

      {/* Embedded Navigation Bar */}
      <Navbar 
        language={language}
        setLanguage={setLanguage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        offlineMode={offlineMode}
        setOfflineMode={setOfflineMode}
        geminiActive={geminiActive}
        onSearchSubmit={handleSearch}
        tab={tab}
        setTab={setTab}
        downloadCount={downloadTasks.filter(t => t.status === "downloading").length}
      />

      {/* Main Container Stage */}
      <main className="flex-1 flex flex-col pb-16">

        {/* Streaming Video Theater Section */}
        {activeMovie && (
          <section className="bg-black/80 py-8 px-4 md:px-12 border-b border-white/5 shadow-inner" id="movie-player-dock">
            <div className="max-w-5xl mx-auto flex flex-col gap-4">
              <VideoPlayer 
                movie={activeMovie} 
                language={language} 
                onClose={() => setActiveMovie(null)} 
              />
              
              {/* Context Details Below Active Live Player */}
              <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-900 flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight text-white">{activeMovie.title}</h2>
                    <span className="text-sm text-neutral-400 font-mono">({activeMovie.year})</span>
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {activeMovie.rating}
                    </span>
                    <span className="text-xs border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                      {activeMovie.duration}
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
                    {language === "hi" ? activeMovie.synopsisHindi : activeMovie.synopsis}
                  </p>

                  <div className="text-xs text-neutral-400 space-y-1 pt-1">
                    <div><span className="font-semibold text-white">{t.director}:</span> {activeMovie.director}</div>
                    <div><span className="font-semibold text-white">{t.cast}:</span> {activeMovie.cast.join(", ")}</div>
                  </div>
                </div>

                {/* Direct High Resolution Local Download Option panel */}
                <div className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800 w-full md:w-80 flex flex-col gap-3">
                  <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5 text-red-500" />
                    <span>Download Multi-Quality</span>
                  </div>
                  <div className="space-y-2">
                    {activeMovie.qualityOptions?.map((opt, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-neutral-950 p-2 rounded border border-neutral-900 hover:border-red-600/50 transition">
                        <div>
                          <span className="text-white font-semibold">{opt.resolution}</span>
                          <span className="text-neutral-500 block text-[10px]">{opt.size} • Safe .mp4</span>
                        </div>
                        <button
                          onClick={() => triggerNativeDownload(activeMovie.title, opt.resolution, opt.fileUrl)}
                          className="bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 1: Home View with Premium Slideshow Poster */}
        {tab === "home" && !offlineMode && (
          <div className="animate-fade-in flex flex-col gap-10">
            {/* Elegant Large Banner Hero */}
            {featuredMovie && (
              <section className="relative min-h-[460px] w-full flex flex-col justify-end bg-neutral-950 overflow-hidden" id="hero-banner">
                {/* Visual dark layouts */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
                <div 
                  className="absolute top-0 right-0 w-full md:w-3/5 h-full bg-cover bg-center opacity-85 transition-opacity duration-300" 
                  style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}
                />

                {/* Left Absolute Content Block */}
                <div className="relative z-20 px-6 md:px-16 pb-12 pt-28 max-w-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-600 text-[10px] font-black rounded uppercase tracking-widest animate-pulse">
                      {t.trending}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium font-mono">
                      {featuredMovie.genre.join(" • ")} • {featuredMovie.year}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-none text-white drop-shadow-lg">
                    {featuredMovie.title.split(":")[0]}
                    {featuredMovie.title.includes(":") && (
                      <span className="text-red-500 block text-2xl md:text-4xl mt-1">
                        {featuredMovie.title.split(":")[1]}
                      </span>
                    )}
                  </h1>

                  <p className="text-neutral-300 text-sm md:text-base leading-relaxed drop-shadow">
                    {language === "hi" ? featuredMovie.synopsisHindi : featuredMovie.synopsis}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button 
                      onClick={() => {
                        setActiveMovie(featuredMovie);
                        const player = document.getElementById("movie-player-dock");
                        if (player) player.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-full text-sm flex items-center gap-2 shadow-lg hover:shadow-red-900/30 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{t.playBtn}</span>
                    </button>

                    <button 
                      onClick={() => setSelectingQualityMovie(featuredMovie)}
                      className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-extrabold px-6 py-3 rounded-full text-sm flex items-center gap-2 transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.downloadBtn}</span>
                    </button>

                    <button
                      onClick={() => toggleWatchlist(featuredMovie.id, featuredMovie.title)}
                      className="p-3 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white transition"
                      title="Watchlist"
                    >
                      {watchlist.includes(featuredMovie.id) ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Bottom Embedded Storage Control Widget */}
                <div className="hidden lg:block absolute right-16 bottom-12 z-20 bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-xl w-72">
                  <div className="text-xs text-neutral-400 uppercase tracking-widest mb-3 flex items-center justify-between font-bold">
                    <span>Direct Local Stream</span>
                    <span className="text-[10px] text-green-500">MPEG-4 Ready</span>
                  </div>
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between items-center text-neutral-300">
                      <span>Standard Audio Dub</span>
                      <span className="font-mono text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded">Hindi / En</span>
                    </div>
                    <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-red-600"></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>External Player Fit</span>
                      <span>100% Mobile Safe</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Curated Categories Lists */}
            <div className="px-4 md:px-12 flex flex-col gap-10">
              
              {/* Category 1: Trending Row */}
              <section className="flex flex-col gap-4">
                <h2 className="text-lg md:text-xl font-bold text-neutral-200 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-red-600 rounded"></span>
                  <span>{t.trending}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {trendingMovies.map((movie) => {
                    const isInWatchlist = watchlist.includes(movie.id);
                    return (
                      <div 
                        key={movie.id} 
                        className="group relative rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950/60 hover:border-red-600/40 transition duration-300 flex flex-col text-left"
                      >
                        {/* Poster space */}
                        <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                            <button
                              onClick={() => {
                                setActiveMovie(movie);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>{t.playBtn}</span>
                            </button>
                            <button
                              onClick={() => setSelectingQualityMovie(movie)}
                              className="w-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs py-1.5 rounded border border-neutral-800 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                          
                          {/* Rating badge */}
                          <div className="absolute top-2 left-2 bg-black/80 border border-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-yellow-400 font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-yellow-400" />
                            {movie.rating}
                          </div>
                        </div>

                        {/* Description Footer content */}
                        <div className="p-3 flex flex-col flex-1 gap-1">
                          <h4 className="text-xs md:text-sm font-bold text-white truncate">{movie.title}</h4>
                          <div className="flex items-center justify-between text-[10px] text-neutral-400">
                            <span>{movie.year} • {movie.duration}</span>
                            <button 
                              onClick={() => toggleWatchlist(movie.id, movie.title)}
                              className="text-neutral-500 hover:text-red-500"
                            >
                              {isInWatchlist ? <Check className="text-green-500 w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Category 2: Bollywood Blockbusters */}
              <section className="flex flex-col gap-4">
                <h2 className="text-lg md:text-xl font-bold text-neutral-200 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-red-600 rounded"></span>
                  <span>{t.bollywoodHits}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {bollywoodMovies.length > 0 ? (
                    bollywoodMovies.map((movie) => (
                      <div 
                        key={movie.id} 
                        className="group relative rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950/60 hover:border-red-600/40 transition duration-300 flex flex-col text-left font-sans"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                            <button
                              onClick={() => {
                                setActiveMovie(movie);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              <span>{t.playBtn}</span>
                            </button>
                            <button
                              onClick={() => setSelectingQualityMovie(movie)}
                              className="w-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs py-1.5 rounded border border-neutral-800 flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                          
                          <div className="absolute top-2 left-2 bg-black/80 border border-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-yellow-400 font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-yellow-400" />
                            {movie.rating}
                          </div>
                        </div>
                        <div className="p-3 flex flex-col flex-1 gap-1">
                          <h4 className="text-xs md:text-sm font-bold text-white truncate">{movie.title}</h4>
                          <span className="text-[10px] text-neutral-400">{movie.year} • {movie.duration}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center text-neutral-500 text-sm">
                      No matching titles in Bollywood. Try searching above!
                    </div>
                  )}
                </div>
              </section>

              {/* Category 3: Sci-Fi & Fantasy Universe */}
              <section className="flex flex-col gap-4">
                <h2 className="text-lg md:text-xl font-bold text-neutral-200 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-red-600 rounded"></span>
                  <span>{t.sciFiFantasy}</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {scifiMovies.map((movie) => (
                    <div 
                      key={movie.id} 
                      className="group relative rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950/60 hover:border-red-600/40 transition duration-300 flex flex-col text-left"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                          <button
                            onClick={() => {
                              setActiveMovie(movie);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>{t.playBtn}</span>
                          </button>
                          <button
                            onClick={() => setSelectingQualityMovie(movie)}
                            className="w-full bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs py-1.5 rounded border border-neutral-800 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>
                        </div>
                        
                        <div className="absolute top-2 left-2 bg-black/80 border border-neutral-800 px-1.5 py-0.5 rounded text-[10px] text-yellow-400 font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-yellow-400" />
                          {movie.rating}
                        </div>
                      </div>
                      <div className="p-3 flex flex-col flex-1 gap-1">
                        <h4 className="text-xs md:text-sm font-bold text-white truncate">{movie.title}</h4>
                        <span className="text-[10px] text-neutral-400">{movie.year} • {movie.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Option 4: User Watchlist segment */}
              {watchlist.length > 0 && (
                <section className="flex flex-col gap-4 border-t border-neutral-900 pt-8">
                  <h2 className="text-lg md:text-xl font-bold text-neutral-200 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-red-600 rounded"></span>
                    <span>{t.watchlist} ({watchlist.length})</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {trendingMovies
                      .filter(m => watchlist.includes(m.id))
                      .map((movie) => (
                        <div 
                          key={movie.id} 
                          className="group relative rounded-xl overflow-hidden border border-neutral-900 bg-neutral-950/60 flex flex-col text-left"
                        >
                          <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center p-4 gap-2">
                              <button
                                onClick={() => {
                                  setActiveMovie(movie);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="w-full bg-red-600 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Play</span>
                              </button>
                              <button
                                onClick={() => toggleWatchlist(movie.id, movie.title)}
                                className="w-full bg-neutral-800 text-red-500 text-xs py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        )}

        {/* Tab 2: Movie Library / Active Search Grid */}
        {tab === "library" && (
          <div className="px-4 md:px-16 py-8 flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-4">
              <div>
                <span className="text-xs text-red-500 font-extrabold uppercase tracking-widest block">Explore catalog</span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  {searchQuery ? `${t.searchResults} for "${searchQuery}"` : t.movies}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
                  Found {results.length || trendingMovies.length} movies total
                </span>
                <button
                  onClick={() => { setResults([]); setSearchQuery(""); loadCatalog(); }}
                  className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 p-2 rounded text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Refresh catalog list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Movie Library Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {(results.length > 0 ? results : trendingMovies).map((movie) => (
                <div 
                  key={movie.id} 
                  className="group bg-neutral-950 rounded-xl overflow-hidden border border-neutral-900 hover:border-red-600/35 transition-all text-left flex flex-col"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-neutral-900">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    
                    {/* Floating rating overlay */}
                    <div className="absolute top-2.5 left-2.5 bg-black/85 border border-white/5 py-0.5 px-2 rounded-md text-[10px] text-yellow-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400" />
                      {movie.rating}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                      <button
                        onClick={() => {
                          setActiveMovie(movie);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full bg-red-600 text-white text-xs py-1.5 rounded font-extrabold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Stream Now</span>
                      </button>
                      <button
                        onClick={() => setSelectingQualityMovie(movie)}
                        className="w-full bg-neutral-800 text-white text-xs py-1.5 rounded flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col gap-1.5 flex-1">
                    <h3 className="font-bold text-white text-xs md:text-sm line-clamp-1">{movie.title}</h3>
                    <div className="flex justify-between items-center text-[10px] text-neutral-400">
                      <span>{movie.year} • {movie.duration}</span>
                      <span className="font-semibold text-neutral-500 uppercase">{movie.genre[0]}</span>
                    </div>
                    {movie.synopsisHindi && (
                      <p className="text-[10px] text-neutral-500 line-clamp-2 mt-1 border-t border-white/5 pt-1">
                        {movie.synopsisHindi}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {results.length === 0 && searchQuery && (
              <div className="py-16 text-center text-neutral-500 flex flex-col items-center gap-4">
                <HelpCircle className="w-12 h-12 text-red-700 animate-bounce" />
                <p className="text-base text-neutral-400 max-w-sm">
                  {t.noResults}
                </p>
                <button
                  onClick={() => { setSearchQuery(""); handleSearch(""); }}
                  className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  Clear search filters & view all movies
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Downloads & Offline Hub */}
        {tab === "downloads" && (
          <div className="px-4 md:px-16 py-8 flex flex-col gap-6 animate-fade-in">
            <div className="border-b border-neutral-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs text-amber-500 font-extrabold uppercase tracking-widest block">Offline storage manager</span>
                <h2 className="text-2xl md:text-3xl font-black text-white">{t.offlineDownloads}</h2>
              </div>
              <div className="text-neutral-400 text-xs bg-neutral-900/60 p-3 rounded-xl border border-neutral-800 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-red-500" />
                <span className="font-sans">
                  Total Downloaded: <strong className="text-white">{downloadTasks.length} Profiles</strong> (Safe for VLC player/local storage)
                </span>
              </div>
            </div>

            {/* Offline Catalog content */}
            {downloadTasks.length === 0 ? (
              <div className="bg-neutral-950/40 border border-neutral-905 py-20 rounded-2xl text-center px-4 max-w-2xl mx-auto flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-red-650/10 flex items-center justify-center border border-red-900/25">
                  <Download className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-white font-bold text-lg">No downloaded movies yet!</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {t.noOfflineMovies}
                </p>
                <button
                  onClick={() => setTab("home")}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-full cursor-pointer transition shadow-md"
                >
                  Browse Streaming Movies List
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloadTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-neutral-950 rounded-xl border border-neutral-900 overflow-hidden flex transition hover:border-red-600/35 relative group"
                  >
                    {/* Left Poster block */}
                    <div className="w-28 relative bg-neutral-900 shrink-0">
                      <img src={task.posterUrl} alt={task.movieTitle} className="w-full h-full object-cover" />
                      {task.status === "completed" && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => {
                              // Find local movie profile info
                              const found = trendingMovies.find(m => m.id === task.movieId);
                              if (found) {
                                setActiveMovie({
                                  ...found,
                                  videoUrl: task.downloadUrl
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            className="bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-500 transition"
                            title="Play Offline copy inside Web Player"
                          >
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right Meta details */}
                    <div className="p-4 flex-1 flex flex-col justify-between text-left gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{task.movieTitle}</h4>
                        <div className="flex gap-2 items-center text-[10px] mt-1">
                          <span className="bg-red-600/25 text-red-400 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                            {task.quality}
                          </span>
                          <span className="text-neutral-500 font-mono text-[10px]">{task.size}</span>
                        </div>
                      </div>

                      {/* Download Status Representation */}
                      {task.status === "downloading" ? (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                            <span className="text-amber-500 font-semibold flex items-center gap-1">
                              <RefreshCw className="w-3 h-3 animate-spin" /> {t.downloading}
                            </span>
                            <span>{task.progress}% @ {task.speed}</span>
                          </div>
                          <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${task.progress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2">
                          <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>VLC Ready</span>
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Native external support download prompt */}
                            <button
                              onClick={() => triggerNativeDownload(task.movieTitle, task.quality, task.downloadUrl)}
                              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-200 px-2.5 py-1 rounded-sm font-semibold flex items-center gap-1 cursor-pointer"
                              title="Download MP4 to play offline in local player"
                            >
                              <ExternalLink className="w-3 h-3 text-red-500" />
                              <span>Play in Local VLC</span>
                            </button>
                            
                            <button
                              onClick={() => removeDownload(task.id)}
                              className="text-neutral-500 hover:text-red-500 transition p-1"
                              title="Delete metadata"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Select Quality Frame Modal */}
      {selectingQualityMovie && (
        <div className="fixed inset-0 bg-black/85 z-[90] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-805 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative animate-scale-in flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-red-500 text-[10px] font-black uppercase tracking-wider block">Video Resolution Options</span>
                <h3 className="text-lg font-black text-white">{selectingQualityMovie.title}</h3>
              </div>
              <button 
                onClick={() => setSelectingQualityMovie(null)}
                className="bg-neutral-900 p-1.5 rounded-full text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Informational Warning label */}
            <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg text-[11px] text-amber-500 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                You can stream directly or download files which contain actual H.264 video streams compatible with MX Player, VLC, and standard Android/Windows video players.
              </div>
            </div>

            {/* Option resolution fields lists */}
            <div className="flex flex-col gap-2.5">
              {selectingQualityMovie.qualityOptions?.map((opt, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center p-3 rounded-lg bg-neutral-900 hover:bg-neutral-900/80 border border-neutral-800 hover:border-red-600/35 transition"
                >
                  <div>
                    <span className="font-bold text-xs block text-white">{opt.resolution}</span>
                    <span className="text-[10px] text-neutral-400">File size: {opt.size} • Safe Stream wrapper</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerNativeDownload(selectingQualityMovie.title, opt.resolution, opt.fileUrl)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-[10px] text-white px-2.5 py-1.5 rounded font-bold flex items-center gap-1 cursor-pointer"
                      title="Play in local media player external offline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>VLC Save</span>
                    </button>
                    <button
                      onClick={() => startDownload(selectingQualityMovie, opt)}
                      className="bg-red-600 hover:bg-red-700 text-[10px] text-white px-2.5 py-1.5 rounded font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Hub</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono border-t border-neutral-900 pt-3">
              <span>H.264 Container: .mp4</span>
              <span>Fast server pipeline</span>
            </div>
          </div>
        </div>
      )}

      {/* Styled Elegant Footer alignment */}
      <footer className="mt-auto bg-black/60 border-t border-white/5 py-4 px-6 md:px-16 text-[10px] text-neutral-500 font-mono flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3 uppercase tracking-widest text-[9px]">
          <span>© 2026 CineStream Inc.</span>
          <span className="text-neutral-700">|</span>
          <span>Dual Track Audio Support: Enabled</span>
          <span className="text-neutral-700">|</span>
          <span>Offline Player Compatibility: VLC, MX Player, Windows Media Player</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Hindi / English Audio Active</span>
        </div>
      </footer>

    </div>
  );
}
