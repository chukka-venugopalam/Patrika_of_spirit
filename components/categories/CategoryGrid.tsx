"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/types/database";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href={`/category/${cat.slug}`} className="block group">
            <div
              className="relative rounded-2xl p-6 border transition-all duration-500 overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${cat.color}12 0%, ${cat.color}05 100%)`,
                borderColor: `${cat.color}25`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 20% 20%, ${cat.color}15 0%, transparent 60%)`,
                  boxShadow: `inset 0 0 30px ${cat.color}10`,
                }}
              />

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 rounded-full"
                style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
              />

              <div className="relative z-10 space-y-4">
                <div className="text-4xl">{cat.icon}</div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg mb-1 group-hover:text-neon-cyan transition-colors duration-300">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono" style={{ color: cat.color }}>
                    {cat.post_count} issues
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-white/20 group-hover:text-neon-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
