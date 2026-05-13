"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Award, Link2, TrendingUp, Zap, Edit3, ArrowUpRight } from "lucide-react";
import type { User, UserInterest, Category, UserBadge, Badge, AwarenessChain, AwarenessPost } from "@/types/database";

interface ProfileClientProps {
  profile: User;
  isOwner: boolean;
  interests: Array<UserInterest & { categories: Category }>;
  userBadges: Array<UserBadge & { badges: Badge }>;
  recentChains: Array<AwarenessChain & { awareness_posts: Pick<AwarenessPost, "title" | "slug"> | null }>;
}

export function ProfileClient({ profile, isOwner, interests, userBadges, recentChains }: ProfileClientProps) {
  const initials = profile.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (profile.username ?? "U").slice(0, 2).toUpperCase();

  const STATS = [
    { label: "Impact Score", value: profile.impact_score, icon: Zap, color: "#00f5ff" },
    { label: "Chains", value: profile.chains_created, icon: Link2, color: "#b400ff" },
    { label: "Reach", value: profile.total_reach, icon: TrendingUp, color: "#00ff88" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-3xl p-8 border border-white/[0.06] relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl border-2 border-neon-cyan/30 overflow-hidden glow-cyan">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name ?? ""}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                  <span className="font-display font-bold text-2xl text-neon-cyan">{initials}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-white">
                  {profile.full_name ?? profile.username}
                </h1>
                {profile.username && (
                  <p className="text-neon-cyan text-sm font-mono">@{profile.username}</p>
                )}
              </div>
              {isOwner && (
                <Link
                  href="/settings"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-white/10 text-white/60 hover:text-white text-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </Link>
              )}
            </div>
            {profile.bio && (
              <p className="text-white/50 text-sm leading-relaxed max-w-md">{profile.bio}</p>
            )}
            <p className="text-white/20 text-xs font-mono">
              Member since {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.06]">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl sm:text-3xl" style={{ color: stat.color }}>
                {stat.value >= 1000 ? (stat.value / 1000).toFixed(1) + "K" : stat.value}
              </div>
              <div className="text-white/30 text-xs font-mono mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/[0.06]"
        >
          <h2 className="font-display font-semibold text-white mb-4">Awareness Interests</h2>
          {interests.length === 0 ? (
            <p className="text-white/30 text-sm font-mono">No interests set.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Link
                  key={interest.id}
                  href={`/category/${interest.categories.slug}`}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all hover:scale-105"
                  style={{
                    background: `${interest.categories.color}20`,
                    color: interest.categories.color,
                    border: `1px solid ${interest.categories.color}30`,
                  }}
                >
                  {interest.categories.icon} {interest.categories.name}
                </Link>
              ))}
            </div>
          )}

          {/* Recent chains */}
          {recentChains.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <h3 className="font-display font-semibold text-white/60 text-sm uppercase tracking-wider font-mono mb-4">
                Recent Chains
              </h3>
              <div className="space-y-2">
                {recentChains.map((chain) => (
                  <div key={chain.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/awareness/${chain.awareness_posts?.slug ?? ""}`}
                      className="text-white/70 text-sm hover:text-neon-cyan transition-colors flex items-center gap-2 group"
                    >
                      <Link2 className="w-3.5 h-3.5 text-neon-purple" />
                      <span className="line-clamp-1">{chain.awareness_posts?.title ?? "Unknown"}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-neon-cyan text-xs font-mono flex-shrink-0 ml-3">
                      {chain.total_reach} reach
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border border-white/[0.06]"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-neon-cyan" />
            <h2 className="font-display font-semibold text-white">Badges</h2>
            <span className="text-white/30 text-xs font-mono ml-auto">{userBadges.length}</span>
          </div>
          {userBadges.length === 0 ? (
            <div className="text-center py-8 text-white/20">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs font-mono">No badges yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {userBadges.map((ub) => (
                <div
                  key={ub.id}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl glass border border-white/[0.06] hover:border-white/10 transition-all cursor-default"
                  title={ub.badges.description}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: `${ub.badges.color}20`, border: `1px solid ${ub.badges.color}30` }}
                  >
                    {ub.badges.icon}
                  </div>
                  <div className="text-white/70 text-[9px] font-mono text-center leading-tight">
                    {ub.badges.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
