"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CallToAction() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Massive glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-neon-cyan/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-neon-purple/8 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            JOIN THE MOVEMENT
          </div>

          {/* Headline */}
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight">
            <span className="text-white">Be the</span>
            <br />
            <span className="gradient-text">spark that</span>
            <br />
            <span className="text-white">starts the fire.</span>
          </h2>

          <p className="text-white/40 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Every great movement started with one person who knew. Join AwareNet and become the
            first link in a chain that changes minds, changes policies, changes the world.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="group flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold text-lg glow-cyan hover:opacity-90 transition-all duration-300"
            >
              <Zap className="w-5 h-5" fill="currentColor" />
              Start Your Chain
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/explore"
              className="px-10 py-5 rounded-xl glass border border-white/10 text-white/80 hover:text-white hover:border-white/20 font-display font-semibold text-lg transition-all duration-300"
            >
              Explore First
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-white/20 text-sm font-mono">
            186,000+ people are already spreading awareness. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
