import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ExploreClient } from "@/components/explore/ExploreClient";

export const metadata: Metadata = {
  title: "Explore Awareness Issues",
  description: "Discover and explore global awareness issues on AwareNet.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; urgency?: string; q?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(24);

  if (params.category) query = query.eq("categories.slug", params.category);
  if (params.urgency) query = query.eq("urgency", params.urgency);

  const { data: posts } = await query;
  const { data: categories } = await supabase.from("categories").select("*").order("name");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ExploreClient posts={posts ?? []} categories={categories ?? []} initialParams={params} />
    </div>
  );
}
