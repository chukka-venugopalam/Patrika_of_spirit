import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileClient } from "@/components/profile/ProfileClient";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = (await supabase
    .from("users")
    .select("full_name, bio")
    .eq("username", username)
    .single()) as any;
  if (!profile) return { title: "User Not Found" };
  return {
    title: profile.full_name ?? username,
    description: profile.bio ?? `${username}'s awareness profile on AwareNet`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = (await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single()) as any;

  if (!profile) notFound();

  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const { data: interests } = (await supabase
    .from("user_interests")
    .select("*, categories(*)")
    .eq("user_id", profile.id)) as any;

  const { data: userBadges } = (await supabase
    .from("user_badges")
    .select("*, badges(*)")
    .eq("user_id", profile.id)) as any;

  const { data: recentChains } = (await supabase
    .from("awareness_chains")
    .select("*, awareness_posts(title, slug)")
    .eq("root_user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(5)) as any;

  return (
    <ProfileClient
      profile={profile}
      isOwner={currentUser?.id === profile.id}
      interests={interests ?? []}
      userBadges={userBadges ?? []}
      recentChains={recentChains ?? []}
    />
  );
}
