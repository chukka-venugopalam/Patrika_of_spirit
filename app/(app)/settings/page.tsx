import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()) as any;

  const { data: categories } = (await supabase
    .from("categories")
    .select("*")
    .order("name")) as any;

  const { data: interests } = (await supabase
    .from("user_interests")
    .select("category_id")
    .eq("user_id", user.id)) as any;

  return (
    <SettingsClient
      profile={profile}
      categories={categories ?? []}
      currentInterests={interests?.map((i: any) => i.category_id) ?? []}
    />
  );
}
