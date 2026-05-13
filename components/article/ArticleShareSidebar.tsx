"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  Send,
  Share2,
  TrendingUp,
  Heart,
  Check,
  Copy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PostWithCategory } from "@/types/database";

interface ArticleShareSidebarProps {
  post: PostWithCategory;
  userId?: string;
}

export function ArticleShareSidebar({ post, userId }: ArticleShareSidebarProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [chainLink, setChainLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleLike = async () => {
    if (!userId) {
      toast({ title: "Sign in to like posts", variant: "destructive" });
      return;
    }
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      await supabase.from("likes").delete().match({ post_id: post.id, user_id: userId });
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase.from("likes").insert({ post_id: post.id, user_id: userId });
    }
  };

  const generateChainLink = async () => {
    if (!userId) {
      toast({ title: "Sign in to create a chain", variant: "destructive" });
      return;
    }
    setGenerating(true);
    const { data, error } = await supabase
      .from("awareness_chains")
      .insert({ post_id: post.id, root_user_id: userId, depth: 1, total_reach: 0 })
      .select("share_code")
      .single();

    if (error) {
      toast({ title: "Failed to generate chain", variant: "destructive" });
    } else {
      const link = `${window.location.origin}/awareness/${post.slug}?chain=${data.share_code}`;
      setChainLink(link);
    }
    setGenerating(false);
  };

  const copyChainLink = async () => {
    if (!chainLink) return;
    await navigator.clipboard.writeText(chainLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Chain link copied!", description: "Share it to spread awareness." });
  };

  const shareToSocial = async (platform: string) => {
    const url = chainLink ?? window.location.href;
    const text = `🔗 "${post.title}" — Spread awareness: `;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");

    // Record share
    await supabase.from("shares").insert({
      post_id: post.id,
      user_id: userId ?? null,
      platform,
    });
  };

  return (
    <div className="lg:sticky lg:top-28 space-y-4">
      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-4"
      >
        <h3 className="font-display font-semibold text-white/60 text-xs uppercase tracking-wider font-mono">
          Awareness Impact
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Views", value: post.view_count >= 1000 ? (post.view_count / 1000).toFixed(0) + "K" : post.view_count, color: "#00f5ff" },
            { label: "Chains", value: post.chain_count >= 1000 ? (post.chain_count / 1000).toFixed(1) + "K" : post.chain_count, color: "#b400ff" },
            { label: "Shares", value: post.share_count >= 1000 ? (post.share_count / 1000).toFixed(1) + "K" : post.share_count, color: "#00ff88" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 rounded-xl bg-white/5">
              <div className="font-display font-bold text-base" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-white/30 text-[10px] font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Like button */}
        <button
          onClick={handleLike}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 text-sm font-medium ${
            liked
              ? "bg-red-500/20 border-red-500/30 text-red-400"
              : "glass border-white/10 text-white/60 hover:text-white hover:border-white/20"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </button>
      </motion.div>

      {/* Chain generator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card rounded-2xl p-5 border border-neon-cyan/10 space-y-4"
        style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.05), rgba(180,0,255,0.03))" }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-neon-cyan" />
          <h3 className="font-display font-semibold text-white text-sm">Start a Chain</h3>
        </div>
        <p className="text-white/40 text-xs leading-relaxed">
          Generate your unique chain link. Every person who reads through your link adds to your
          awareness reach.
        </p>

        {!chainLink ? (
          <button
            onClick={generateChainLink}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold text-sm glow-cyan hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {generating ? (
              <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Generate Chain Link
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs font-mono text-white/50 flex-1 truncate">{chainLink}</span>
              <button
                onClick={copyChainLink}
                className="text-white/40 hover:text-neon-cyan transition-colors flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-neon-green text-xs font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Chain created! Share the link above.
            </p>
          </div>
        )}
      </motion.div>

      {/* Social share */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card rounded-2xl p-5 border border-white/[0.06] space-y-4"
      >
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-white/40" />
          <h3 className="font-display font-semibold text-white/60 text-xs uppercase tracking-wider font-mono">
            Share
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { platform: "twitter", icon: Twitter, label: "Twitter", color: "#1da1f2" },
            { platform: "facebook", icon: Facebook, label: "Facebook", color: "#1877f2" },
            { platform: "linkedin", icon: Linkedin, label: "LinkedIn", color: "#0a66c2" },
            { platform: "telegram", icon: Send, label: "Telegram", color: "#26a5e4" },
          ].map(({ platform, icon: Icon, label, color }) => (
            <button
              key={platform}
              onClick={() => shareToSocial(platform)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass border border-white/10 text-white/60 hover:text-white transition-all duration-200 text-xs font-medium group"
              style={{ "--hover-color": color } as React.CSSProperties}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
