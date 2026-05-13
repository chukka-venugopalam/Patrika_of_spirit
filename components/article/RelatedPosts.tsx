"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import type { PostWithCategory } from "@/types/database";

export function RelatedPosts({ posts }: { posts: PostWithCategory[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mt-20 pt-12 border-t border-white/[0.06]"
    >
      <h2 className="font-display font-bold text-2xl text-white mb-8">
        More Issues to Explore
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={`/awareness/${post.slug}`} className="block group">
              <div className="awareness-card">
                <div className="relative h-40 rounded-t-2xl overflow-hidden">
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
                      style={{ background: `linear-gradient(135deg, ${post.categories?.color}33, transparent)` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-void-950/80 to-transparent" />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display font-bold text-white text-sm leading-snug group-hover:text-neon-cyan transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between">
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
    </motion.div>
  );
}
