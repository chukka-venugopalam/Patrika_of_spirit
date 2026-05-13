import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryPageClient } from "@/components/categories/CategoryPageClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} Awareness Issues`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: posts } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  return <CategoryPageClient category={category} posts={posts ?? []} />;
}
