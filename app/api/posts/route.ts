import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const QuerySchema = z.object({
  category: z.string().optional(),
  urgency: z.enum(["critical", "high", "medium", "low"]).optional(),
  q: z.string().max(200).optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
  sort: z.enum(["latest", "trending", "chains"]).default("latest"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { category, urgency, q, limit, offset, sort } = parsed.data;
    const supabase = await createClient();

    let query = supabase
      .from("awareness_posts")
      .select("*, categories!inner(*), users(id, username, avatar_url, full_name)")
      .eq("status", "published");

    if (category) query = query.eq("categories.slug", category);
    if (urgency) query = query.eq("urgency", urgency);
    if (q) {
      query = query.or(`title.ilike.%${q}%,subtitle.ilike.%${q}%`);
    }

    switch (sort) {
      case "trending": query = query.order("view_count", { ascending: false }); break;
      case "chains":   query = query.order("chain_count", { ascending: false }); break;
      default:         query = query.order("published_at", { ascending: false });
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, count, limit, offset }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
