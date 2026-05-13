"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Globe, Users, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const HERO_STATS = [
  { icon: Globe, value: 2400000, suffix: "+", label: "Issues Tracked", color: "text-neon-cyan" },
  { icon: Users, value: 186000, suffix: "+", label: "Aware Users", color: "text-neon-purple" },
  { icon: TrendingUp, value: 94, suffix: "%", label: "Chain Rate", color: "text-neon-green" },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* Radial glow backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-neon-cyan/5 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-neon-green/5 blur-[80px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-sm font-mono mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          LIVE AWARENESS NETWORK
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6"
        >
          <span className="block text-white">Awareness</span>
          <span className="block gradient-text">Spreads Like</span>
          <span className="block text-white">Wildfire.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed mb-12 font-body"
        >
          Join a chain reaction of consciousness. Every share multiplies. Every voice amplifies.
          Every connection ignites change across the globe.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link
            href="/signup"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold text-base glow-cyan hover:opacity-90 transition-all duration-300"
          >
            Start Spreading Awareness
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/explore"
            className="flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 text-white/80 hover:text-white hover:border-white/20 font-medium text-base transition-all duration-300"
          >
            <Zap className="w-4 h-4 text-neon-cyan" />
            Explore Issues
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {HERO_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl px-6 py-5 flex flex-col items-center gap-2 border border-white/[0.06]"
            >
              <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
              <div className={`font-display font-bold text-3xl ${stat.color}`}>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} delay={0.8 + i * 0.1} />
              </div>
              <p className="text-white/40 text-sm font-mono">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-xs font-mono tracking-widest uppercase">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-neon-cyan/40 to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
}
