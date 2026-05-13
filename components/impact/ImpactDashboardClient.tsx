"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Link2, Zap, Award, Share2, Eye } from "lucide-react";
import type { User, UserBadge, Badge } from "@/types/database";

interface ImpactDashboardClientProps {
  profile: User | null;
  chains: Array<{
    id: string;
    depth: number;
    total_reach: number;
    created_at: string;
    awareness_posts: { title: string; slug: string; categories: { name: string; color: string } | null } | null;
  }>;
  shares: Array<{ platform: string; created_at: string }>;
  userBadges: Array<UserBadge & { badges: Badge }>;
}

// Generate last 30 days chain data
function buildChainTimeline(chains: ImpactDashboardClientProps["chains"]) {
  const days: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days[d.toISOString().split("T")[0]] = 0;
  }
  chains.forEach((c) => {
    const day = c.created_at.split("T")[0];
    if (days[day] !== undefined) days[day]++;
  });
  return Object.entries(days).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    chains: count,
  }));
}

function buildSharePlatforms(shares: ImpactDashboardClientProps["shares"]) {
  const counts: Record<string, number> = {};
  shares.forEach((s) => {
    counts[s.platform] = (counts[s.platform] ?? 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

const PIE_COLORS = ["#00f5ff", "#b400ff", "#00ff88", "#ff6b00", "#ffd700"];

const CUSTOM_TOOLTIP_STYLE = {
  background: "rgba(6, 12, 24, 0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "12px",
  fontFamily: "JetBrains Mono, monospace",
};

export function ImpactDashboardClient({
  profile,
  chains,
  shares,
  userBadges,
}: ImpactDashboardClientProps) {
  const chainTimeline = buildChainTimeline(chains);
  const sharePlatforms = buildSharePlatforms(shares);

  const STAT_CARDS = [
    { label: "Impact Score", value: profile?.impact_score ?? 0, icon: Zap, color: "#00f5ff", suffix: " pts" },
    { label: "Chains Created", value: profile?.chains_created ?? 0, icon: Link2, color: "#b400ff", suffix: "" },
    { label: "Total Reach", value: profile?.total_reach ?? 0, icon: TrendingUp, color: "#00ff88", suffix: "" },
    { label: "Total Shares", value: shares.length, icon: Share2, color: "#ff6b00", suffix: "" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-4xl text-white mb-2">
          Your <span className="gradient-text">Impact</span>
        </h1>
        <p className="text-white/40">Track how far your awareness has spread across the network.</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="font-display font-bold text-3xl text-white">
                {stat.value >= 1000 ? (stat.value / 1000).toFixed(1) + "K" : stat.value}
                <span className="text-sm font-mono text-white/30">{stat.suffix}</span>
              </div>
              <div className="text-white/40 text-sm font-mono">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chain timeline - 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/[0.06]"
        >
          <h3 className="font-display font-semibold text-white mb-6">
            Chain Activity — Last 30 Days
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chainTimeline} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <defs>
                <linearGradient id="chainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "JetBrains Mono" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} cursor={{ stroke: "rgba(0,245,255,0.2)" }} />
              <Area
                type="monotone"
                dataKey="chains"
                stroke="#00f5ff"
                strokeWidth={2}
                fill="url(#chainGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform breakdown - 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-2xl p-6 border border-white/[0.06]"
        >
          <h3 className="font-display font-semibold text-white mb-6">
            Share Platforms
          </h3>
          {sharePlatforms.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={sharePlatforms}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sharePlatforms.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {sharePlatforms.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-white/60 text-xs font-mono capitalize">{p.name}</span>
                    </div>
                    <span className="text-white/40 text-xs font-mono">{p.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-white/20">
              <Share2 className="w-8 h-8 mb-2" />
              <p className="text-sm font-mono">No shares yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent chains table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card rounded-2xl border border-white/[0.06] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="font-display font-semibold text-white">Recent Chains</h3>
        </div>
        {chains.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/20">
            <Link2 className="w-10 h-10 mb-3" />
            <p className="font-mono text-sm">No chains created yet.</p>
            <a href="/explore" className="mt-3 text-neon-cyan text-sm hover:underline font-mono">
              Explore issues to chain →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Issue", "Category", "Depth", "Reach", "Created"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-mono text-white/30 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chains.map((chain, i) => (
                  <tr key={chain.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-white text-sm font-medium line-clamp-1">
                        {chain.awareness_posts?.title ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {chain.awareness_posts?.categories && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono text-void-950"
                          style={{ background: chain.awareness_posts.categories.color }}
                        >
                          {chain.awareness_posts.categories.name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-neon-purple text-sm font-mono">{chain.depth}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-neon-cyan text-sm font-mono">{chain.total_reach}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/30 text-xs font-mono">
                        {new Date(chain.created_at).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card rounded-2xl p-6 border border-white/[0.06]"
      >
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-neon-cyan" />
          <h3 className="font-display font-semibold text-white">Earned Badges</h3>
        </div>
        {userBadges.length === 0 ? (
          <div className="text-center py-10 text-white/20">
            <Award className="w-10 h-10 mx-auto mb-3" />
            <p className="font-mono text-sm">Start creating chains to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {userBadges.map((ub) => (
              <div
                key={ub.id}
                className="flex flex-col items-center gap-2 p-4 rounded-xl glass border border-white/[0.06] hover:border-white/10 transition-all cursor-default group"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ background: `${ub.badges.color}20`, border: `1px solid ${ub.badges.color}40` }}
                >
                  {ub.badges.icon}
                </div>
                <div className="text-center">
                  <div className="text-white text-xs font-display font-semibold">{ub.badges.name}</div>
                  <div className="text-white/30 text-[10px] font-mono mt-0.5">{ub.badges.rarity}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
