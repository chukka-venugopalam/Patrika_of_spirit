"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Eye, TrendingUp, Flame, Calendar } from "lucide-react";
import Link from "next/link";
import type { PostWithCategory } from "@/types/database";

interface ArticleHeroProps {
  post: PostWithCategory;
}

const URGENCY_LABELS: Record<string, { label: string; className: string }> = {
  critical: { label: "CRITICAL", className: "badge-urgency-critical" },
  high: { label: "HIGH", className: "badge-urgency-high" },
  medium: { label: "MEDIUM", className: "badge-urgency-medium" },
  low: {
    label: "LOW",
    className:
      "bg-white/10 text-white/40 border border-white/10 text-xs font-mono px-2 py-0.5 rounded-full",
  },
};

export function ArticleHero({ post }: ArticleHeroProps) {
  const urgency = URGENCY_LABELS[post.urgency] ?? URGENCY_LABELS.medium;
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="relative h-[70vh] min-h-[500px] flex items-end overflow-hidden">
      {/* Hero image */}
      {post.hero_image ? (
        <Image
          src={post.hero_image}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${post.categories?.color ?? "#bcecff"}22 0%, rgba(11, 19, 36, 0.98) 100%)`,
          }}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/60 to-void-950/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-void-950/40 via-transparent to-transparent" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl space-y-5"
        >
          {/* Breadcrumb + badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/explore"
              className="text-white/40 text-xs font-mono hover:text-white/70 transition-colors"
            >
              Explore
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <Link
              href={`/category/${post.categories?.slug}`}
              className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold text-void-950 hover:opacity-80 transition-opacity"
              style={{ background: post.categories?.color ?? "#00f5ff" }}
            >
              {post.categories?.name}
            </Link>
            <span className={urgency.className}>{urgency.label}</span>
            {post.urgency === "critical" && (
              <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            )}
          </div>

          {/* Title */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-6xl text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          {post.subtitle && (
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed max-w-2xl">
              {post.subtitle}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm font-mono">
            {publishedDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {publishedDate}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {post.view_count >= 1000
                ? (post.view_count / 1000).toFixed(0) + "K"
                : post.view_count}{" "}
              views
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-neon-cyan">{post.chain_count} chains</span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
