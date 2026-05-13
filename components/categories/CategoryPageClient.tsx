"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, TrendingUp, ArrowUpRight, Flame } from "lucide-react";
import type { Category, PostWithCategory } from "@/types/database";

interface CategoryPageClientProps {
  category: Category;
  posts: PostWithCategory[];
}

const URGENCY_CONFIG: Record<string, string> = {
  critical: "badge-urgency-critical",
  high: "badge-urgency-high",
  medium: "badge-urgency-medium",
  low: "text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/40 border border-white/10",
};

export function CategoryPageClient({ category, posts }: CategoryPageClientProps) {
  const [search, setSearch] = useState("");

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.subtitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-void-950">
      {/* Category Hero */}
      <div
        className="relative py-28 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category.color}15 0%, rgba(3,5,10,1) 60%)`,
        }}
      >
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${category.color}15 0%, transparent 60%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl space-y-5"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-mono font-semibold text-void-950"
              style={{ background: category.color }}
            >
              {category.icon} {category.name.toUpperCase()}
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white leading-tight">
              {category.name}{" "}
              <span style={{ color: category.color }}>Awareness</span>
            </h1>
            {category.description && (
              <p className="text-white/50 text-lg leading-relaxed">{category.description}</p>
            )}
            <div className="flex items-center gap-3 text-white/30 text-sm font-mono">
              <span>{category.post_count} issues tracked</span>
              <span>·</span>
              <span>{category.follower_count} followers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${category.name} issues...`}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">{category.icon}</div>
            <p className="text-white/40">No issues found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/awareness/${post.slug}`} className="block group">
                  <div className="awareness-card">
                    <div className="relative h-48 rounded-t-2xl overflow-hidden">
                      {post.hero_image ? (
                        <Image
                          src={post.hero_image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="33vw"
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ background: `linear-gradient(135deg, ${category.color}33, transparent)` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-[10px] font-mono text-white/70">
                        <TrendingUp className="w-3 h-3" style={{ color: category.color }} />
                        {post.chain_count >= 1000 ? (post.chain_count / 1000).toFixed(1) + "K" : post.chain_count}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={URGENCY_CONFIG[post.urgency] ?? URGENCY_CONFIG.medium}>
                          {post.urgency.toUpperCase()}
                        </span>
                        {post.urgency === "critical" && <Flame className="w-3 h-3 text-red-400 animate-pulse" />}
                      </div>
                      <h3 className="font-display font-bold text-white text-sm leading-snug group-hover:text-neon-cyan transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.subtitle && (
                        <p className="text-white/40 text-xs line-clamp-2">{post.subtitle}</p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <span className="flex items-center gap-1 text-white/30 text-xs font-mono">
                          <Clock className="w-3 h-3" />{post.reading_time} min
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
