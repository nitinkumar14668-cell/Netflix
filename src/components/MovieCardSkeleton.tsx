import React from "react";
import { Star } from "lucide-react";

interface MovieCardSkeletonProps {
  variant?: "home" | "library";
}

export default function MovieCardSkeleton({ variant = "home" }: MovieCardSkeletonProps) {
  return (
    <div 
      className="group relative rounded-xl overflow-hidden border border-neutral-900/60 bg-neutral-950/40 flex flex-col text-left select-none animate-shimmer-fade"
    >
      {/* Poster area placeholder */}
      <div className="relative aspect-[2/3] bg-neutral-900 overflow-hidden shrink-0">
        {/* Shimmer light sweep overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
        
        {/* Floating rating badge skeleton spacer */}
        <div className="absolute top-2.5 left-2.5 bg-neutral-800/80 border border-neutral-700/20 py-0.5 px-2 rounded-md flex items-center gap-1 w-12 h-5">
          <Star className="w-2.5 h-2.5 text-neutral-700 fill-neutral-700 shrink-0" />
          <div className="h-2 bg-neutral-700/60 rounded w-4" />
        </div>
      </div>

      {/* Description Meta structure */}
      <div className={`${variant === "library" ? "p-3.5 gap-2" : "p-3 gap-1 px-3 py-3"} flex flex-col flex-1 justify-between`}>
        <div className="space-y-2">
          {/* Title bar */}
          <div className="relative overflow-hidden bg-neutral-800/80 h-4 rounded w-4/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
          </div>

          {/* Subtitle metrics bar */}
          <div className="flex justify-between items-center text-[10px]">
            <div className="relative overflow-hidden bg-neutral-800/60 h-3 rounded w-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
            </div>
            
            {variant === "library" ? (
              <div className="relative overflow-hidden bg-neutral-800/60 h-3 rounded w-12">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-shimmer" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded bg-neutral-800/60 shrink-0" />
            )}
          </div>
        </div>

        {/* Extra snippet text mock only for Detailed Catalog / Library variation */}
        {variant === "library" && (
          <div className="border-t border-white/5 pt-2 mt-1 space-y-1.5">
            <div className="relative overflow-hidden bg-neutral-800/40 h-2.5 rounded w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-shimmer" />
            </div>
            <div className="relative overflow-hidden bg-neutral-800/40 h-2.5 rounded w-2/3">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-shimmer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
