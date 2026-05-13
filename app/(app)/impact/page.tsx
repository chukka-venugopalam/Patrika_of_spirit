import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ImpactDashboardClient } from "@/components/impact/ImpactDashboardClient";

export const metadata: Metadata = { title: "Impact Dashboard" };

export default async function ImpactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: chains } = await supabase
    .from("awareness_chains")
    .select("*, awareness_posts(title, slug, categories(name, color))")
    .eq("root_user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: shares } = await supabase
    .from("shares")
    .select("platform, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", user.id);

  return (
    <ImpactDashboardClient
      profile={profile}
      chains={chains ?? []}
      shares={shares ?? []}
      userBadges={userBadges ?? []}
    />
  );
}
