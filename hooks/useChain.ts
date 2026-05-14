"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseChainOptions {
  postId: string;
  postSlug: string;
  userId?: string;
}

export function useChain({ postId, postSlug, userId }: UseChainOptions) {
  const [chainLink, setChainLink] = useState<string | null>(null);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const generateChain = useCallback(async (parentChainId?: string) => {
    if (!userId) {
      toast({ title: "Sign in to create a chain link", variant: "destructive" });
      return null;
    }

    setLoading(true);

    let depth = 1;
    if (parentChainId) {
      const { data: parent } = await supabase
        .from("awareness_chains")
        .select("depth")
        .eq("id", parentChainId)
        .single();
      if (parent) depth = parent.depth + 1;
    }

    const { data, error } = await supabase
      .from("awareness_chains")
      .insert({
        post_id: postId,
        root_user_id: userId,
        parent_chain_id: parentChainId ?? null,
        depth,
      })
      .select("share_code, id")
      .single();

    setLoading(false);

    if (error) {
      toast({ title: "Failed to generate chain link", variant: "destructive" });
      return null;
    }

    const link = `${window.location.origin}/awareness/${postSlug}?chain=${data.share_code}`;
    setChainLink(link);
    setShareCode(data.share_code);
    toast({ title: "Chain link created!", description: "Share it to grow your awareness chain." });

    return { link, shareCode: data.share_code, chainId: data.id };
  }, [postId, postSlug, userId, supabase, toast]);

  const copyToClipboard = useCallback(async () => {
    const url = chainLink ?? `${window.location.origin}/awareness/${postSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard!" });
  }, [chainLink, postSlug, toast]);

  const recordShare = useCallback(async (platform: string, chainId?: string) => {
    await supabase.from("shares").insert({
      post_id: postId,
      user_id: userId ?? null,
      chain_id: chainId ?? null,
      platform,
    });
  }, [postId, userId, supabase]);

  return {
    chainLink,
    shareCode,
    loading,
    copied,
    generateChain,
    copyToClipboard,
    recordShare,
  };
}
