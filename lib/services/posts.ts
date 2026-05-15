import { createClient } from "@/lib/supabase/server";
import type { PostWithCategory } from "@/types/database";

export async function incrementViewCount(postId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("increment_view_count", { post_id: postId });
}

export async function getPublishedPosts(limit = 20, offset = 0): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);
  return data ?? [];
}

export async function getFeaturedPost(): Promise<PostWithCategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function getPostBySlug(slug: string): Promise<PostWithCategory | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function getTrendingPosts(limit = 6): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .order("chain_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getPersonalizedPosts(userId: string, limit = 9): Promise<PostWithCategory[]> {
  const supabase = await createClient();

  // Get user's category interests
  const { data: interests } = await supabase
    .from("user_interests")
    .select("category_id")
    .eq("user_id", userId);

  if (!interests || interests.length === 0) {
    return getTrendingPosts(limit);
  }

  const categoryIds = interests.map((i) => i.category_id);
  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .in("category_id", categoryIds)
    .order("published_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
