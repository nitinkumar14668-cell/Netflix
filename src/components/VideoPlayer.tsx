import React, { useRef, useState, useEffect } from "react";
import { 
  Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, 
  RotateCw, Subtitles, Settings, Eye, HelpCircle, X, Sparkles
} from "lucide-react";
import { Movie, LanguageCode, TRANSLATIONS } from "../types";

interface VideoPlayerProps {
  movie: Movie;
  language: LanguageCode;
  onClose: () => void;
}

// Interactive Synchronized Subtitles Mock data based on timeline
const DIALOGUES = {
  en: [
    { start: 0, end: 4, text: "🍿 Welcome to CineStream Premium Player!" },
    { start: 4, end: 8, text: "⚡ Enjoying custom full-resolution streaming with dual audio tracks." },
    { start: 8, end: 12, text: "💾 Tip: Use the 'Download Video' panel below to play this video inside VLC / MX Player offline!" },
    { start: 12, end: 18, text: "🎬 Direct streaming is served from high-capacity CDN servers." },
    { start: 18, end: 999, text: "🎥 CineStream - Your Personal Non-stop Cinema Hub." }
  ],
  hi: [
    { start: 0, end: 4, text: "🍿 सिनेस्ट्रीम प्रीमियम प्लेयर में आपका स्वागत है!" },
    { start: 4, end: 8, text: "⚡ ड्यूल ऑडियो और पूर्ण रिज़ॉल्यूशन स्ट्रीमिंग का आनंद लें।" },
    { start: 8, end: 12, text: "💾 टिप: वीडियो को VLC या MX Player में ऑफ़लाइन चलाने के लिए नीचे दिए गए 'डाउनलोड' पैनल का उपयोग करें!" },
    { start: 12, end: 18, text: "🎬 सीधी स्ट्रीमिंग उच्च क्षमता वाले क्लाउड सीडीएन सर्वर से संचालित है।" },
    { start: 18, end: 999, text: "🎥 सिनेस्ट्रीम - आपका अपना नॉन-स्टॉप सिनेमा थियेटर।" }
  ]
};

export default function VideoPlayer({ movie, language, onClose }: VideoPlayerProps) {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [streamQuality, setStreamQuality] = useState("1080p Stream");
  const [currentDialogue, setCurrentDialogue] = useState("");
  const [theaterMode, setTheaterMode] = useState(false);

  // Sync subtitle block
  useEffect(() => {
    const list = DIALOGUES[language];
    const match = list.find(d => currentTime >= d.start && currentTime < d.end);
    setCurrentDialogue(match ? match.text : "");
  }, [currentTime, language]);

  // Autoplay on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [movie]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 600); // fallback is 10 min
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newState = !isMuted;
    setIsMuted(newState);
    videoRef.current.muted = newState;
    if (!newState && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      let target = videoRef.current.currentTime + amount;
      if (target < 0) target = 0;
      if (target > duration) target = duration;
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullScreen = () => {
    const container = document.getElementById("player-wrapper-container");
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      className={`relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-black border border-neutral-800 ${
        theaterMode ? "ring-4 ring-red-900/35" : ""
      }`} 
      id="player-wrapper-container"
    >
      {/* Player Header Info */}
      <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-extrabold tracking-widest animate-pulse">
            LIVE STREAM
          </span>
          <h3 className="text-white font-sans font-bold text-sm md:text-base drop-shadow-md truncate max-w-xs md:max-w-md">
            {movie.title} ({movie.year})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheaterMode(!theaterMode)}
            className={`px-2 py-1 rounded text-xs transition cursor-pointer font-semibold ${
              theaterMode ? "bg-amber-600 text-white" : "bg-neutral-900/80 text-neutral-300 hover:text-white"
            }`}
            title="Toggle Theater Ambient Lighting"
          >
            {theaterMode ? "💡 Ambient Enabled" : "🔆 Ambient Off"}
          </button>
          
          <button
            onClick={onClose}
            className="bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white p-1.5 rounded-full transition cursor-pointer"
            id="close-player-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video flex items-center justify-center bg-neutral-950 group">
        <video
          id="main-html5-video"
          ref={videoRef}
          src={movie.videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
          preload="auto"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Ambient Glow overlay in theater mode */}
        {theaterMode && (
          <div className="absolute inset-0 pointer-events-none border-[12px] border-amber-500/10 mix-blend-overlay animate-pulse" />
        )}

        {/* Dynamic Subtitles Overlay */}
        {subtitlesEnabled && currentDialogue && (
          <div 
            className="absolute bottom-16 inset-x-4 flex justify-center pointer-events-none z-10"
            id="subtitles-overlay text"
          >
            <div className="bg-black/85 text-yellow-400 font-sans font-bold text-sm md:text-lg px-4 py-2 rounded-lg border border-neutral-700 max-w-xl text-center shadow-md leading-relaxed animate-fade-in">
              {currentDialogue}
            </div>
          </div>
        )}

        {/* Center Play/Pause Quick HUD Toggle */}
        <div 
          onClick={togglePlay}
          className="absolute inset-0 bg-neutral-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
        >
          <div className="bg-black/75 hover:bg-red-600 border border-neutral-700 text-white rounded-full p-4 transition-all scale-95 group-hover:scale-100 duration-300 shadow-xl">
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-white" />
            ) : (
              <Play className="w-8 h-8 fill-white ml-0.5" />
            )}
          </div>
        </div>
      </div>

      {/* Custom Controls Panel */}
      <div className="bg-neutral-950 p-4 border-t border-neutral-900 flex flex-col gap-3 font-sans">
        {/* Timeline Slider and Durations */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            id="player-timeline"
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="flex-1 accent-red-600 h-1 bg-neutral-800 rounded-lg cursor-pointer transition focus:outline-none"
          />
          <span className="text-xs text-neutral-400 font-mono w-10 text-left">
            {formatTime(duration)}
          </span>
        </div>

        {/* Bottom Control buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              id="player-play-toggle"
              onClick={togglePlay}
              className="text-white hover:text-red-500 transition cursor-pointer p-1"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip Backward 10s */}
            <button
              id="player-skip-backward"
              onClick={() => skipTime(-10)}
              className="text-neutral-400 hover:text-white transition cursor-pointer p-1"
              title="Rewind 10s"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>

            {/* Skip Forward 10s */}
            <button
              id="player-skip-forward"
              onClick={() => skipTime(10)}
              className="text-neutral-400 hover:text-white transition cursor-pointer p-1"
              title="Fast Forward 10s"
            >
              <RotateCw className="w-4.5 h-4.5" />
            </button>

            {/* Volume controls */}
            <div className="flex items-center gap-1.5 ml-2 group/volume">
              <button
                id="player-mute-toggle"
                onClick={toggleMute}
                className="text-neutral-400 hover:text-white transition cursor-pointer p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                id="player-volume-slider"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 accent-white h-1 bg-neutral-800 rounded-lg cursor-pointer opacity-70 group-hover/volume:opacity-100 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-400">
            {/* Resolution indicator switch simulation */}
            <div className="relative">
              <button
                id="player-quality-toggle"
                className="hover:text-white transition cursor-pointer flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded border border-neutral-800"
                onClick={() => {
                  const qualities = ["480p SD", "720p HD", "1080p Full HD", "4K Ultra HD"];
                  const idx = qualities.indexOf(streamQuality);
                  const nextQuality = qualities[(idx + 1) % qualities.length];
                  setStreamQuality(nextQuality);
                }}
              >
                <span>{streamQuality}</span>
              </button>
            </div>

            {/* Subtitle toggle switcher */}
            <button
              id="player-subtitle-toggle"
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`transition cursor-pointer flex items-center gap-1 px-2 py-1 rounded border ${
                subtitlesEnabled 
                  ? "bg-red-950/40 border-red-800 text-white" 
                  : "bg-neutral-900 border-neutral-800 text-neutral-500"
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span>{t.subtitles} ({subtitlesEnabled ? "Hi/En" : "OFF"})</span>
            </button>

            {/* Playback speed trigger */}
            <div className="relative">
              <button
                id="player-speed-toggle"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="hover:text-white transition cursor-pointer flex items-center gap-1 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800"
              >
                <span>{playbackSpeed}x</span>
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-neutral-900 border border-neutral-800 rounded shadow-xl py-1 flex flex-col w-20 z-20">
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`text-left px-3 py-1 text-xs hover:bg-neutral-800 cursor-pointer ${
                        playbackSpeed === s ? "text-red-500 font-bold" : "text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              id="player-fullscreen"
              onClick={toggleFullScreen}
              className="hover:text-white transition cursor-pointer p-1"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5 text-neutral-400 hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Feature Highlights banner */}
      <div className="bg-zinc-950 px-4 py-2 text-[10px] text-zinc-500 flex justify-between items-center border-t border-neutral-900">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Seamless Streaming Source: H.264 MP4 Container
        </span>
        <span>Keyboard seek: Click Player space & use standard arrow keys</span>
      </div>
    </div>
  );
}
