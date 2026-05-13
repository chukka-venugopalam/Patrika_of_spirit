import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DashboardFeed } from "@/components/dashboard/DashboardFeed";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: featuredPost } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  const { data: trendingPosts } = await supabase
    .from("awareness_posts")
    .select("*, categories(*), users(id, username, avatar_url, full_name)")
    .eq("status", "published")
    .order("view_count", { ascending: false })
    .limit(9);

  return (
    <div className="min-h-screen bg-void-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome header */}
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">
            Welcome back,{" "}
            <span className="gradient-text-cyan">
              {profile?.full_name?.split(" ")[0] ?? "Awareness Seeker"}
            </span>
          </h1>
          <p className="text-white/40">Here&apos;s what the world needs to know today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main feed */}
          <div className="lg:col-span-3">
            <DashboardFeed
              featuredPost={featuredPost}
              trendingPosts={trendingPosts ?? []}
            />
          </div>

          {/* Sidebar stats */}
          <div className="lg:col-span-1">
            <DashboardStats profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
}
