"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, Flame, ArrowUpRight } from "lucide-react";
import type { PostWithCategory } from "@/types/database";

interface DashboardFeedProps {
  featuredPost: PostWithCategory | null;
  trendingPosts: PostWithCategory[];
}

const URGENCY_CONFIG = {
  critical: { label: "CRITICAL", className: "badge-urgency-critical" },
  high: { label: "HIGH", className: "badge-urgency-high" },
  medium: { label: "MEDIUM", className: "badge-urgency-medium" },
  low: { label: "LOW", className: "text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/40 border border-white/10" },
};

function PostCard({ post, index }: { post: PostWithCategory; index: number }) {
  const urgency = URGENCY_CONFIG[post.urgency] ?? URGENCY_CONFIG.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link href={`/awareness/${post.slug}`} className="block group">
        <div className="awareness-card">
          {/* Thumbnail */}
          <div className="relative h-44 rounded-t-2xl overflow-hidden">
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
                style={{ background: `linear-gradient(135deg, ${post.categories?.color}33, ${post.categories?.color}11)` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-transparent" />

            <div className="absolute top-3 left-3">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-void-950"
                style={{ background: post.categories?.color ?? "#00f5ff" }}
              >
                {post.categories?.name?.toUpperCase()}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-[10px] font-mono text-white/70">
              <TrendingUp className="w-3 h-3 text-neon-cyan" />
              {post.chain_count >= 1000 ? (post.chain_count / 1000).toFixed(1) + "K" : post.chain_count} chains
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className={urgency.className}>{urgency.label}</span>
              {post.urgency === "critical" && <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />}
            </div>

            <h3 className="font-display font-bold text-white text-sm leading-snug group-hover:text-neon-cyan transition-colors duration-300 line-clamp-2">
              {post.title}
            </h3>

            {post.subtitle && (
              <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{post.subtitle}</p>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
              <div className="flex items-center gap-1 text-white/30 text-xs font-mono">
                <Clock className="w-3 h-3" />
                {post.reading_time} min
              </div>
              <div className="flex items-center gap-1 text-neon-cyan text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function DashboardFeed({ featuredPost, trendingPosts }: DashboardFeedProps) {
  return (
    <div className="space-y-8">
      {/* Featured Post */}
      {featuredPost && (
        <div>
          <h2 className="font-display font-semibold text-white/60 text-sm uppercase tracking-wider mb-4 font-mono">
            Featured Today
          </h2>
          <Link href={`/awareness/${featuredPost.slug}`} className="block group">
            <div className="awareness-card md:flex">
              <div className="relative md:w-2/5 h-56 md:h-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden flex-shrink-0">
                {featuredPost.hero_image && (
                  <Image
                    src={featuredPost.hero_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="40vw"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-void-950/60" />
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-semibold text-void-950"
                    style={{ background: featuredPost.categories?.color }}
                  >
                    {featuredPost.categories?.name?.toUpperCase()}
                  </span>
                  <span className={URGENCY_CONFIG[featuredPost.urgency]?.className}>
                    {URGENCY_CONFIG[featuredPost.urgency]?.label}
                  </span>
                </div>
                <h2 className="font-display font-bold text-white text-xl md:text-2xl leading-tight group-hover:text-neon-cyan transition-colors">
                  {featuredPost.title}
                </h2>
                {featuredPost.subtitle && (
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-3">{featuredPost.subtitle}</p>
                )}
                <div className="flex items-center gap-4 text-white/30 text-xs font-mono mt-auto pt-3 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredPost.reading_time} min</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-neon-cyan" />{featuredPost.chain_count} chains</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Trending Grid */}
      <div>
        <h2 className="font-display font-semibold text-white/60 text-sm uppercase tracking-wider mb-4 font-mono">
          Trending Issues
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingPosts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
