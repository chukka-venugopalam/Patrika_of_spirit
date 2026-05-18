"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-neon-cyan/5 blur-[120px]" />
      </div>
      <div className="relative z-10 space-y-6">
        <div className="font-display font-extrabold text-[120px] sm:text-[180px] text-white/5 leading-none select-none">
          404
        </div>
        <div className="-mt-8 space-y-3">
          <h1 className="font-display font-bold text-3xl text-white">
            This awareness got lost
          </h1>
          <p className="text-white/40 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold glow-cyan hover:opacity-90 transition-opacity"
          >
            <Zap className="w-4 h-4" fill="currentColor" />
            Go Home
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white/70 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Issues
          </Link>
        </div>
      </div>
    </div>
  );
}
