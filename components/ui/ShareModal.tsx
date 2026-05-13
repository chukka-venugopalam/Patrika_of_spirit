"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Twitter,
  Facebook,
  Linkedin,
  Send,
  Link2,
  Copy,
  Check,
  Zap,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  post: {
    id: string;
    slug: string;
    title: string;
    chain_count: number;
  };
  userId?: string;
}

const SOCIAL_PLATFORMS = [
  { id: "twitter", icon: Twitter, label: "Twitter / X", color: "#1da1f2" },
  { id: "facebook", icon: Facebook, label: "Facebook", color: "#1877f2" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn", color: "#0a66c2" },
  { id: "telegram", icon: Send, label: "Telegram", color: "#26a5e4" },
];

export function ShareModal({ open, onClose, post, userId }: ShareModalProps) {
  const [chainLink, setChainLink] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const pageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/awareness/${post.slug}`
    : `/awareness/${post.slug}`;

  const shareUrl = chainLink ?? pageUrl;

  const generateChain = async () => {
    if (!userId) {
      toast({ title: "Sign in to create a chain link", variant: "destructive" });
      return;
    }
    setGenerating(true);
    const { data, error } = await supabase
      .from("awareness_chains")
      .insert({ post_id: post.id, root_user_id: userId })
      .select("share_code")
      .single();

    if (!error && data) {
      const link = `${window.location.origin}/awareness/${post.slug}?chain=${data.share_code}`;
      setChainLink(link);
      toast({ title: "Chain link generated!", description: "Share it to track your awareness reach." });
    } else {
      toast({ title: "Failed to generate chain", variant: "destructive" });
    }
    setGenerating(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied!", description: "Paste it anywhere to spread awareness." });

    // Record copy share
    await supabase.from("shares").insert({
      post_id: post.id,
      user_id: userId ?? null,
      platform: "copy",
    });
  };

  const shareToSocial = async (platform: string) => {
    const text = `🔗 "${post.title}" — Spread awareness: `;
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer,width=600,height=500");

    await supabase.from("shares").insert({
      post_id: post.id,
      user_id: userId ?? null,
      platform,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-cyan" />
            Spread Awareness
          </DialogTitle>
          <DialogDescription>
            Share this issue and start a chain reaction. Every share multiplies the reach.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Chain generator */}
          <div
            className="rounded-xl p-4 border space-y-3"
            style={{ background: "rgba(0,245,255,0.05)", borderColor: "rgba(0,245,255,0.2)" }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-white text-sm font-semibold">Chain Link</span>
              {chainLink && (
                <span className="ml-auto text-neon-green text-xs font-mono flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active
                </span>
              )}
            </div>

            {!chainLink ? (
              <>
                <p className="text-white/40 text-xs leading-relaxed">
                  Generate a unique chain link to track everyone who reads this through your share.
                </p>
                <button
                  onClick={generateChain}
                  disabled={generating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {generating ? (
                    <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Generate My Chain Link
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs font-mono text-white/50 flex-1 truncate">{chainLink}</span>
                <button
                  onClick={copyLink}
                  className="text-white/40 hover:text-neon-cyan transition-colors flex-shrink-0 p-1"
                >
                  {copied ? <Check className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Copy plain link */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-mono text-white/40 flex-1 truncate">{pageUrl}</span>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3 h-3 text-neon-green" /> : <Copy className="w-3 h-3" />}
              Copy
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/20 text-xs font-mono">Share to</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-2">
            {SOCIAL_PLATFORMS.map(({ id, icon: Icon, label, color }) => (
              <button
                key={id}
                onClick={() => shareToSocial(id)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm transition-all duration-200 group"
              >
                <Icon className="w-4 h-4" style={{ color }} />
                {label}
              </button>
            ))}
          </div>

          {/* Chain count */}
          <p className="text-center text-white/20 text-xs font-mono">
            {post.chain_count} chains already started on this issue
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
