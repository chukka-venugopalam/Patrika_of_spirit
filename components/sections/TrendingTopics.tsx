"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowUpRight, Flame, TrendingUp } from "lucide-react";
import Image from "next/image";

const URGENCY_CONFIG = {
  critical: { label: "CRITICAL", className: "badge-urgency-critical" },
  high: { label: "HIGH", className: "badge-urgency-high" },
  medium: { label: "MEDIUM", className: "badge-urgency-medium" },
};

const TRENDING_POSTS = [
  {
    id: "1",
    slug: "silent-ocean-death",
    title: "The Silent Death of Our Oceans",
    subtitle: "90% of large fish populations have vanished in 50 years. Here's what we're not being told.",
    heroImage: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80",
    category: { name: "Environment", slug: "environment", color: "#00ff88" },
    urgency: "critical" as const,
    readingTime: 7,
    chainCount: 12400,
    viewCount: 284000,
  },
  {
    id: "2",
    slug: "ai-job-displacement-2025",
    title: "AI Will Replace 300M Jobs. Are We Ready?",
    subtitle: "The automation wave is already here. Governments are silent. Workers are unprepared.",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    category: { name: "AI & Future", slug: "ai-future", color: "#b400ff" },
    urgency: "high" as const,
    readingTime: 9,
    chainCount: 8700,
    viewCount: 196000,
  },
  {
    id: "3",
    slug: "mental-health-crisis-youth",
    title: "Youth Mental Health: The Hidden Pandemic",
    subtitle: "1 in 5 young people face severe mental illness. The system is overwhelmed.",
    heroImage: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&q=80",
    category: { name: "Health", slug: "health", color: "#ff6b6b" },
    urgency: "critical" as const,
    readingTime: 6,
    chainCount: 19200,
    viewCount: 412000,
  },
  {
    id: "4",
    slug: "data-privacy-surveillance",
    title: "Your Data Is Being Sold Right Now",
    subtitle: "Every click, every search, every location ping — corporations know you better than you know yourself.",
    heroImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    category: { name: "Cybersecurity", slug: "cybersecurity", color: "#00f5ff" },
    urgency: "high" as const,
    readingTime: 5,
    chainCount: 6300,
    viewCount: 134000,
  },
  {
    id: "5",
    slug: "food-insecurity-hidden",
    title: "800M People Go to Bed Hungry Tonight",
    subtitle: "We produce enough food to feed 10 billion. So why is famine still spreading?",
    heroImage: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
    category: { name: "Society", slug: "society", color: "#ffd700" },
    urgency: "critical" as const,
    readingTime: 8,
    chainCount: 22100,
    viewCount: 578000,
  },
  {
    id: "6",
    slug: "education-inequality",
    title: "260 Million Children Have No School",
    subtitle: "Education is humanity's greatest equalizer — and the one we're failing to deliver.",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    category: { name: "Education", slug: "education", color: "#ffd700" },
    urgency: "medium" as const,
    readingTime: 6,
    chainCount: 4800,
    viewCount: 98000,
  },
];

interface AwarenessCardProps {
  post: (typeof TRENDING_POSTS)[0];
  index: number;
  featured?: boolean;
}

function AwarenessCard({ post, index, featured = false }: AwarenessCardProps) {
  const urgency = URGENCY_CONFIG[post.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/awareness/${post.slug}`} className="block group">
        <div
          className={`awareness-card ${
            featured ? "md:grid md:grid-cols-2 md:gap-0" : ""
          }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              featured ? "md:rounded-l-2xl md:rounded-r-none rounded-t-2xl md:rounded-t-2xl" : "rounded-t-2xl"
            } ${featured ? "h-64 md:h-full" : "h-48"}`}
          >
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "33vw"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 via-transparent to-transparent" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold text-void-950"
                style={{ background: post.category.color }}
              >
                {post.category.name.toUpperCase()}
              </span>
            </div>

            {/* Chain count */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-[10px] font-mono text-white/70">
              <TrendingUp className="w-3 h-3 text-neon-cyan" />
              {post.chainCount >= 1000 ? (post.chainCount / 1000).toFixed(1) + "K" : post.chainCount} chains
            </div>
          </div>

          {/* Content */}
          <div className={`p-5 flex flex-col gap-3 ${featured ? "md:p-7" : ""}`}>
            {/* Urgency badge */}
            <div className="flex items-center gap-2">
              <span className={urgency.className}>{urgency.label}</span>
              {post.urgency === "critical" && (
                <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              )}
            </div>

            {/* Title */}
            <h3
              className={`font-display font-bold text-white leading-tight group-hover:gradient-text-cyan transition-all duration-300 ${
                featured ? "text-xl md:text-2xl" : "text-base"
              }`}
            >
              {post.title}
            </h3>

            {/* Subtitle */}
            {featured && (
              <p className="text-white/40 text-sm leading-relaxed line-clamp-3">{post.subtitle}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/[0.06]">
              <div className="flex items-center gap-1 text-white/30 text-xs font-mono">
                <Clock className="w-3 h-3" />
                {post.readingTime} min read
              </div>
              <div className="flex items-center gap-1 text-neon-cyan text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingTopics() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 mb-3">
              TRENDING NOW
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              What the World
              <span className="gradient-text"> Needs to Know</span>
            </h2>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-2 text-neon-cyan text-sm font-mono hover:gap-3 transition-all duration-200 whitespace-nowrap"
          >
            Explore all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Featured + Grid */}
        <div className="space-y-6">
          {/* Featured post */}
          <AwarenessCard post={TRENDING_POSTS[0]} index={0} featured />

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRENDING_POSTS.slice(1).map((post, i) => (
              <AwarenessCard key={post.id} post={post} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
