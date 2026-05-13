"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, Link2, Zap, Award, ChevronRight } from "lucide-react";
import type { User } from "@/types/database";

interface DashboardStatsProps {
  profile: User | null;
}

export function DashboardStats({ profile }: DashboardStatsProps) {
  if (!profile) return null;

  const stats = [
    { label: "Impact Score", value: profile.impact_score, icon: Zap, color: "#00f5ff" },
    { label: "Chains Created", value: profile.chains_created, icon: Link2, color: "#b400ff" },
    { label: "Total Reach", value: profile.total_reach, icon: TrendingUp, color: "#00ff88" },
  ];

  return (
    <div className="space-y-4 sticky top-24">
      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-4"
      >
        <h3 className="font-display font-semibold text-white/60 text-xs uppercase tracking-wider font-mono">
          Your Impact
        </h3>

        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg leading-none">
                {stat.value >= 1000 ? (stat.value / 1000).toFixed(1) + "K" : stat.value}
              </div>
              <div className="text-white/30 text-xs font-mono">{stat.label}</div>
            </div>
          </div>
        ))}

        <Link
          href="/impact"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
        >
          <span className="text-white/60 text-xs font-mono">View full dashboard</span>
          <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-neon-cyan transition-colors" />
        </Link>
      </motion.div>

      {/* Badges preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card rounded-2xl p-5 border border-white/[0.06]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-white/60 text-xs uppercase tracking-wider font-mono">
            Badges
          </h3>
          <Award className="w-4 h-4 text-neon-cyan" />
        </div>

        {/* Placeholder badges */}
        <div className="grid grid-cols-4 gap-2">
          {["✨", "🔗", "📡", "🌐"].map((icon, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl glass border border-white/10 flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer"
            >
              {icon}
            </div>
          ))}
          <div className="col-span-4 mt-2">
            <div className="h-px bg-white/[0.06]" />
            <Link
              href={`/profile/${profile.username ?? profile.id}`}
              className="flex items-center justify-between mt-2 px-1 group"
            >
              <span className="text-white/30 text-xs font-mono">See all badges</span>
              <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-neon-cyan transition-colors" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-2"
      >
        <h3 className="font-display font-semibold text-white/60 text-xs uppercase tracking-wider font-mono mb-3">
          Quick Actions
        </h3>
        <Link
          href="/explore"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass border border-white/10 hover:border-neon-cyan/20 text-white/70 hover:text-white text-sm transition-all duration-200 group"
        >
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          Explore Issues
        </Link>
        <Link
          href="/categories"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass border border-white/10 hover:border-neon-purple/20 text-white/70 hover:text-white text-sm transition-all duration-200"
        >
          <Zap className="w-4 h-4 text-neon-purple" />
          Browse Categories
        </Link>
      </motion.div>
    </div>
  );
}
