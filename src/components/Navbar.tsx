import React from "react";
import { Search, Tv, Languages, Wifi, WifiOff, Sparkles, Download, ListVideo } from "lucide-react";
import { LanguageCode, TRANSLATIONS } from "../types";

interface NavbarProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  offlineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
  geminiActive: boolean;
  onSearchSubmit: (query: string) => void;
  tab: "home" | "library" | "downloads";
  setTab: (tab: "home" | "library" | "downloads") => void;
  downloadCount: number;
}

export default function Navbar({
  language,
  setLanguage,
  searchQuery,
  setSearchQuery,
  offlineMode,
  setOfflineMode,
  geminiActive,
  onSearchSubmit,
  tab,
  setTab,
  downloadCount
}: NavbarProps) {
  const t = TRANSLATIONS[language];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/95 border-b border-neutral-800 backdrop-blur-md px-4 py-3 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand Logo & Tabs */}
      <div className="flex items-center justify-between w-full md:w-auto gap-6">
        <div 
          onClick={() => { setTab("home"); setSearchQuery(""); onSearchSubmit(""); }}
          className="flex items-center gap-2 cursor-pointer group text-red-600 hover:text-red-500 transition"
          id="brand-logo"
        >
          <Tv className="w-8 h-8 stroke-[2]" />
          <span className="font-sans font-extrabold text-2xl tracking-tighter text-white">
            CINE<span className="text-red-600 group-hover:text-red-500">STREAM</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-4 text-sm font-medium">
          <button
            id="nav-home"
            onClick={() => { setTab("home"); setSearchQuery(""); onSearchSubmit(""); }}
            className={`cursor-pointer transition ${
              tab === "home" ? "text-red-600 font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            {t.home}
          </button>
          <button
            id="nav-downloads"
            onClick={() => setTab("downloads")}
            className={`cursor-pointer flex items-center gap-1.5 transition ${
              tab === "downloads" ? "text-red-600 font-semibold" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{t.offlineDownloads}</span>
            {downloadCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {downloadCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Middle Search Input */}
      {!offlineMode && (
        <div className="relative w-full md:max-w-md" id="search-container">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="movie-search-input"
            type="text"
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 rounded-full py-2 pl-9 pr-24 text-sm font-sans focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); onSearchSubmit(""); }}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white cursor-pointer px-1 py-0.5"
            >
              Clear
            </button>
          )}
          <button
            id="search-btn-trigger"
            onClick={() => onSearchSubmit(searchQuery)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full font-semibold transition cursor-pointer"
          >
            Search
          </button>
        </div>
      )}

      {/* Utility Rails / Toggles */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Gemini Active Badge */}
        {geminiActive ? (
          <div 
            title={t.aiPower}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/40 border border-indigo-900 rounded-full text-indigo-400 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Search Live</span>
          </div>
        ) : (
          <div 
            title={t.fallbackInfo}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-500 text-xs"
          >
            <span>Standard Library</span>
          </div>
        )}

        {/* Offline Mode Switch */}
        <button
          id="offline-toggle"
          onClick={() => setOfflineMode(!offlineMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition ${
            offlineMode 
              ? "bg-amber-950/40 border-amber-800 text-amber-500" 
              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
          }`}
          title="Simulate Offline Stream from Files"
        >
          {offlineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>{t.offlineStatus} (ON)</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Online Mode</span>
            </>
          )}
        </button>

        {/* Language Toggler */}
        <button
          id="language-toggler"
          onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
          className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5 text-neutral-400" />
          <span>{language === "hi" ? "English" : "हिन्दी"}</span>
        </button>
      </div>
    </header>
  );
}
