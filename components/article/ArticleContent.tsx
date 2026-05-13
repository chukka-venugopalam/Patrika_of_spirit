"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Heart, Zap, BookOpen, Lightbulb, Globe } from "lucide-react";
import type { PostWithCategory } from "@/types/database";

interface ArticleContentProps {
  post: PostWithCategory;
}

interface ContentSectionProps {
  icon: React.ElementType;
  title: string;
  content: string | null;
  color: string;
  delay: number;
  highlight?: boolean;
}

function ContentSection({ icon: Icon, title, content, color, delay, highlight }: ContentSectionProps) {
  if (!content) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl p-6 sm:p-8 mb-8 border ${
        highlight ? "border-opacity-30" : "border-white/[0.06]"
      }`}
      style={{
        background: highlight
          ? `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        borderColor: highlight ? color + "40" : undefined,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
        style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
      />

      <div className="pl-4">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}30` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <h2
            className="font-display font-bold text-xl sm:text-2xl text-white"
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
          {content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-white/60 leading-relaxed mb-4 last:mb-0">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ArticleContent({ post }: ArticleContentProps) {
  const categoryColor = post.categories?.color ?? "#00f5ff";

  const SECTIONS = [
    {
      icon: BookOpen,
      title: "The Problem",
      content: post.problem_explanation,
      color: "#00f5ff",
      delay: 0,
      highlight: false,
    },
    {
      icon: Heart,
      title: "Why This Matters",
      content: post.why_it_matters,
      color: "#ff6b6b",
      delay: 0.1,
      highlight: true,
    },
    {
      icon: AlertTriangle,
      title: "The Consequences",
      content: post.consequences,
      color: "#ff6b00",
      delay: 0.15,
      highlight: false,
    },
    {
      icon: Globe,
      title: "Real-World Examples",
      content: post.real_examples,
      color: categoryColor,
      delay: 0.2,
      highlight: false,
    },
    {
      icon: Lightbulb,
      title: "What Can Be Done",
      content: post.solutions,
      color: "#00ff88",
      delay: 0.25,
      highlight: true,
    },
  ];

  return (
    <div className="space-y-2">
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-mono text-white/40 border border-white/10 bg-white/5"
            >
              #{tag}
            </span>
          ))}
        </motion.div>
      )}

      {/* Content sections */}
      {SECTIONS.map((section) => (
        <ContentSection key={section.title} {...section} />
      ))}
    </div>
  );
}
