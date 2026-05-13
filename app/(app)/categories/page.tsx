import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryGrid } from "@/components/categories/CategoryGrid";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all awareness categories on AwareNet.",
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("post_count", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-3">
          Explore <span className="gradient-text">Categories</span>
        </h1>
        <p className="text-white/40 text-lg">
          10 awareness domains. Hundreds of issues. One mission.
        </p>
      </div>
      <CategoryGrid categories={categories ?? []} />
    </div>
  );
}
