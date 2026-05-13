"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PostWithCategory } from "@/types/database";

export function ChainCTA({ post, userId }: { post: PostWithCategory; userId?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mt-12 rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-neon-cyan/20"
      style={{
        background: "linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(180,0,255,0.05) 100%)",
      }}
    >
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-neon-cyan/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-cyan/20 text-neon-cyan text-sm font-mono">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          You now know. Now spread it.
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Be the next link in the chain.
        </h2>

        <p className="text-white/50 max-w-md mx-auto text-sm leading-relaxed">
          Awareness multiplies when shared. Your unique chain link tracks every person you reach —
          turning one reader into hundreds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {userId ? (
            <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold glow-cyan hover:opacity-90 transition-opacity">
              <Zap className="w-4 h-4" fill="currentColor" />
              Generate My Chain Link
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <Link
              href={`/signup?redirect=/awareness/${post.slug}`}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold glow-cyan hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              Sign Up to Create a Chain
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <p className="text-white/20 text-xs font-mono">
          {post.chain_count} chains already started on this issue
        </p>
      </div>
    </motion.div>
  );
}
