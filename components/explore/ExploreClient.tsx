"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp, Flame, ArrowUpRight } from "lucide-react";
import type { PostWithCategory, Category } from "@/types/database";

interface ExploreClientProps {
  posts: PostWithCategory[];
  categories: Category[];
  initialParams: { category?: string; urgency?: string; q?: string };
}

const URGENCY_OPTIONS = [
  { value: "critical", label: "Critical", color: "#ef4444" },
  { value: "high", label: "High", color: "#f97316" },
  { value: "medium", label: "Medium", color: "#eab308" },
  { value: "low", label: "Low", color: "#6b7280" },
];

const URGENCY_CONFIG = {
  critical: "badge-urgency-critical",
  high: "badge-urgency-high",
  medium: "badge-urgency-medium",
  low: "text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/40 border border-white/10",
};

export function ExploreClient({ posts, categories, initialParams }: ExploreClientProps) {
  const [search, setSearch] = useState(initialParams.q ?? "");
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category ?? "");
  const [selectedUrgency, setSelectedUrgency] = useState(initialParams.urgency ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.subtitle?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || post.categories?.slug === selectedCategory;
      const matchesUrgency = !selectedUrgency || post.urgency === selectedUrgency;
      return matchesSearch && matchesCategory && matchesUrgency;
    });
  }, [posts, search, selectedCategory, selectedUrgency]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedUrgency("");
  };

  const hasFilters = search || selectedCategory || selectedUrgency;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-3">
          Explore <span className="gradient-text">Issues</span>
        </h1>
        <p className="text-white/40">
          {posts.length} awareness issues tracked globally.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues, topics, keywords..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters
                ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan"
                : "glass border-white/10 text-white/60 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:block">Filters</span>
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-3.5 rounded-xl glass border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-5"
          >
            {/* Categories */}
            <div>
              <label className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    !selectedCategory ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30" : "glass border border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={
                      selectedCategory === cat.slug
                        ? { background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}40` }
                        : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
                    }
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="text-xs font-mono text-white/40 uppercase tracking-wider block mb-3">
                Urgency Level
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedUrgency("")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    !selectedUrgency ? "bg-white/10 text-white border border-white/20" : "glass border border-white/10 text-white/40"
                  }`}
                >
                  All
                </button>
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedUrgency(opt.value === selectedUrgency ? "" : opt.value)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                    style={
                      selectedUrgency === opt.value
                        ? { background: `${opt.color}20`, color: opt.color, border: `1px solid ${opt.color}40` }
                        : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-white/30 text-sm font-mono">
          {filtered.length} issue{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/40 text-lg">No issues found matching your criteria.</p>
          <button onClick={clearFilters} className="mt-4 text-neon-cyan text-sm hover:underline font-mono">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
                      <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${post.categories?.color}33, transparent)` }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-void-950" style={{ background: post.categories?.color }}>
                        {post.categories?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={URGENCY_CONFIG[post.urgency]}>{post.urgency.toUpperCase()}</span>
                      {post.urgency === "critical" && <Flame className="w-3 h-3 text-red-400 animate-pulse" />}
                    </div>
                    <h3 className="font-display font-bold text-white text-sm leading-snug group-hover:text-neon-cyan transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <span className="flex items-center gap-1 text-white/30 text-xs font-mono">
                        <Clock className="w-3 h-3" />{post.reading_time} min
                      </span>
                      <span className="flex items-center gap-1 text-white/30 text-xs font-mono">
                        <TrendingUp className="w-3 h-3 text-neon-cyan" />
                        {post.chain_count >= 1000 ? (post.chain_count / 1000).toFixed(1) + "K" : post.chain_count}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
