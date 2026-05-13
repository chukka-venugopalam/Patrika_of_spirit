import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const userId = searchParams.get("id");

  const supabase = await createClient();

  let query = supabase
    .from("users")
    .select("id, username, full_name, avatar_url, bio, impact_score, chains_created, total_reach, created_at");

  if (username) {
    query = query.eq("username", username);
  } else if (userId) {
    query = query.eq("id", userId);
  } else {
    return NextResponse.json({ error: "username or id required" }, { status: 400 });
  }

  const { data, error } = await query.single();
  if (error) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ data }, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = ["username", "full_name", "bio", "avatar_url"];
  const update: Record<string, string> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
