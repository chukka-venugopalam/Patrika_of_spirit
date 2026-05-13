import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const CreateChainSchema = z.object({
  post_id: z.string().uuid(),
  parent_chain_id: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");
  const chainId = searchParams.get("chain_id");

  const supabase = await createClient();

  if (chainId) {
    // Get full chain tree using the recursive function
    const { data, error } = await supabase.rpc("get_chain_tree", { root_chain_id: chainId });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (postId) {
    const { data, error } = await supabase
      .from("awareness_chains")
      .select("*, users(id, username, avatar_url, full_name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  return NextResponse.json({ error: "post_id or chain_id required" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const parsed = CreateChainSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { post_id, parent_chain_id } = parsed.data;

    let depth = 1;
    if (parent_chain_id) {
      const { data: parent } = await supabase
        .from("awareness_chains")
        .select("depth")
        .eq("id", parent_chain_id)
        .single();
      if (parent) depth = parent.depth + 1;
    }

    const { data, error } = await supabase
      .from("awareness_chains")
      .insert({ post_id, root_user_id: user.id, parent_chain_id: parent_chain_id ?? null, depth })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/awareness/${post_id}?chain=${data.share_code}`;

    return NextResponse.json({ data: { ...data, share_url: shareUrl } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
