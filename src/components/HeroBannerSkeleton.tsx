import React from "react";

export default function HeroBannerSkeleton() {
  return (
    <section className="relative min-h-[460px] w-full flex flex-col justify-end bg-[#0c0c0c] overflow-hidden select-none animate-shimmer-fade">
      {/* Background radial/linear dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#0c0c0c]/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
      
      {/* Visual background placeholder with a radial premium glow */}
      <div className="absolute inset-0 bg-radial-gradient from-neutral-900/30 via-[#0A0A0A] to-[#0A0A0A] scale-110" />

      {/* Hero content placeholder */}
      <div className="relative z-20 px-6 md:px-16 pb-12 pt-28 max-w-2xl flex flex-col gap-5 text-left">
        {/* Genre / Tag taglines skeleton row */}
        <div className="flex items-center gap-3">
          <div className="relative overflow-hidden bg-neutral-800 h-5 w-16 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-neutral-800/60 h-4 w-40 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>

        {/* Big Heading placeholder bars */}
        <div className="space-y-3">
          <div className="relative overflow-hidden bg-neutral-800 h-10 md:h-12 w-4/5 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-neutral-800/80 h-7 md:h-8 w-2/3 rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>

        {/* Synopsis text placeholder */}
        <div className="space-y-2 mt-1">
          <div className="relative overflow-hidden bg-neutral-800/50 h-3.5 w-full rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-neutral-800/50 h-3.5 w-11/12 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-neutral-800/50 h-3.5 w-3/4 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>

        {/* Buttons placeholders */}
        <div className="flex items-center gap-3 pt-3">
          <div className="relative overflow-hidden bg-neutral-800 h-12 w-32 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-neutral-800/70 h-12 w-32 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-neutral-800/50 h-10 w-10 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Right side embedded storage widget mockup */}
      <div className="hidden lg:block absolute right-16 bottom-12 z-20 bg-black/40 backdrop-blur-xl border border-neutral-900/40 p-5 rounded-xl w-72">
        <div className="relative overflow-hidden bg-neutral-800/40 h-3 w-1/3 rounded mb-3">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
        </div>
        <div className="space-y-3">
          <div className="relative overflow-hidden bg-neutral-800/30 h-2.5 w-1/2 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
          </div>
          <div className="h-1.5 bg-neutral-900/60 rounded-full" />
          <div className="relative overflow-hidden bg-neutral-800/20 h-2.5 w-3/4 rounded">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
      </div>
    </section>
  );
}
