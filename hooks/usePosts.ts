"use client";

import { useState, useEffect, useCallback } from "react";
import type { PostWithCategory } from "@/types/database";

interface UsePostsOptions {
  category?: string;
  urgency?: string;
  q?: string;
  sort?: "latest" | "trending" | "chains";
  limit?: number;
}

interface UsePostsResult {
  posts: PostWithCategory[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function usePosts(options: UsePostsOptions = {}): UsePostsResult {
  const { category, urgency, q, sort = "latest", limit = 20 } = options;
  const [posts, setPosts] = useState<PostWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (currentOffset: number, append = false) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (urgency) params.set("urgency", urgency);
    if (q) params.set("q", q);
    params.set("sort", sort);
    params.set("limit", limit.toString());
    params.set("offset", currentOffset.toString());

    try {
      const res = await fetch(`/api/posts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const json = await res.json();
      const newPosts: PostWithCategory[] = json.data ?? [];

      setPosts((prev) => append ? [...prev, ...newPosts] : newPosts);
      setHasMore(newPosts.length === limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [category, urgency, q, sort, limit]);

  useEffect(() => {
    setOffset(0);
    fetchPosts(0, false);
  }, [fetchPosts]);

  const loadMore = useCallback(() => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchPosts(nextOffset, true);
  }, [offset, limit, fetchPosts]);

  const refresh = useCallback(() => {
    setOffset(0);
    fetchPosts(0, false);
  }, [fetchPosts]);

  return { posts, loading, error, hasMore, loadMore, refresh };
}
