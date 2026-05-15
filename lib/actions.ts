"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const CreateChainSchema = z.object({
  postId: z.string().uuid(),
  parentChainId: z.string().uuid().optional(),
});

const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),
  full_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
});

const CreateCommentSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(2000),
  parentId: z.string().uuid().optional(),
});

// ─── Chain Actions ────────────────────────────────────────────────────────────

export async function createChain(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const parsed = CreateChainSchema.safeParse({
    postId: formData.get("postId"),
    parentChainId: formData.get("parentChainId") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { postId, parentChainId } = parsed.data;

  // Calculate depth
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
      root_user_id: user.id,
      parent_chain_id: parentChainId ?? null,
      depth,
    })
    .select("share_code")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/awareness`);
  return { data: { shareCode: data.share_code } };
}

export async function recordShare(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const postId = formData.get("postId") as string;
  const platform = formData.get("platform") as string;
  const chainId = formData.get("chainId") as string | null;

  if (!postId || !platform) return { error: "Missing required fields" };

  const { error } = await supabase.from("shares").insert({
    post_id: postId,
    user_id: user?.id ?? null,
    chain_id: chainId ?? null,
    platform,
  });

  if (error) return { error: error.message };
  return { data: { success: true } };
}

// ─── Profile Actions ──────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const parsed = UpdateProfileSchema.safeParse({
    username: formData.get("username") ?? undefined,
    full_name: formData.get("full_name") ?? undefined,
    bio: formData.get("bio") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Check username uniqueness
  if (parsed.data.username) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("username", parsed.data.username)
      .neq("id", user.id)
      .single();
    if (existing) return { error: "Username already taken" };
  }

  const { error } = await supabase
    .from("users")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  return { data: { success: true } };
}

// ─── Like Actions ─────────────────────────────────────────────────────────────

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .match({ post_id: postId, user_id: user.id })
    .single();

  if (existing) {
    await supabase.from("likes").delete().match({ post_id: postId, user_id: user.id });
    return { data: { liked: false } };
  } else {
    await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
    return { data: { liked: true } };
  }
}

// ─── Comment Actions ──────────────────────────────────────────────────────────

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const parsed = CreateCommentSchema.safeParse({
    postId: formData.get("postId"),
    content: formData.get("content"),
    parentId: formData.get("parentId") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { error } = await supabase.from("comments").insert({
    post_id: parsed.data.postId,
    user_id: user.id,
    content: parsed.data.content,
    parent_id: parsed.data.parentId ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/awareness`);
  return { data: { success: true } };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  const { error } = await supabase
    .from("comments")
    .update({ is_deleted: true })
    .match({ id: commentId, user_id: user.id });

  if (error) return { error: error.message };
  return { data: { success: true } };
}

// ─── User Interests Actions ───────────────────────────────────────────────────

export async function updateInterests(categoryIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };

  // Delete existing
  await supabase.from("user_interests").delete().eq("user_id", user.id);

  if (categoryIds.length > 0) {
    const { error } = await supabase.from("user_interests").insert(
      categoryIds.map((id) => ({ user_id: user.id, category_id: id }))
    );
    if (error) return { error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { data: { success: true } };
}
