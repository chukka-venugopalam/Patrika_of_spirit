import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleHero } from "@/components/article/ArticleHero";
import { ArticleContent } from "@/components/article/ArticleContent";
import { ArticleShareSidebar } from "@/components/article/ArticleShareSidebar";
import { ReadingProgressBar } from "@/components/article/ReadingProgressBar";
import { RelatedPosts } from "@/components/article/RelatedPosts";
import { ChainCTA } from "@/components/article/ChainCTA";
import { incrementViewCount } from "@/lib/services/posts";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const post = data as any;

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.subtitle ?? post.problem_explanation?.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.subtitle ?? undefined,
      images: post.hero_image ? [{ url: post.hero_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle ?? undefined,
      images: post.hero_image ? [post.hero_image] : [],
    },
  };
}

export default async function AwarenessArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const post = data as any;

  if (!post) notFound();

  // Increment view count (fire and forget)
  incrementViewCount(post.id).catch(console.error);

  // Fetch related posts in same category
  const { data: related } = await supabase
    .from("awareness_posts")
    .select("*, categories(*)")
    .eq("category_id", post.category_id)
    .eq("status", "published")
    .neq("id", post.id)
    .order("view_count", { ascending: false })
    .limit(3);

  // Fetch active user for chain system
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <ReadingProgressBar />

      <article className="min-h-screen bg-void-950">
        {/* Hero */}
        <ArticleHero post={post} />

        {/* Main content + sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Article body */}
            <div className="lg:col-span-8">
              <ArticleContent post={post} />
              <ChainCTA post={post} userId={user?.id} />
            </div>

            {/* Sticky share sidebar */}
            <div className="lg:col-span-4">
              <ArticleShareSidebar post={post} userId={user?.id} />
            </div>
          </div>

          {/* Related posts */}
          {related && related.length > 0 && (
            <RelatedPosts posts={related} />
          )}
        </div>
      </article>
    </>
  );
}
