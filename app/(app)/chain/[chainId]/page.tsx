import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ChainVisualizerClient } from "@/components/chain/ChainVisualizerClient";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Chain Visualization" };

interface ChainPageProps {
  params: Promise<{ chainId: string }>;
}

export default async function ChainPage({ params }: ChainPageProps) {
  const { chainId } = await params;
  const supabase = await createClient();

  const { data: chainData } = await supabase
    .from("awareness_chains")
    .select("*, awareness_posts(title, slug, categories(name, color))")
    .eq("id", chainId)
    .single();

  const chain = chainData as any;

  if (!chain) notFound();

  // Get the full chain tree
  const { data: treeNodes } = await (supabase as any).rpc("get_chain_tree", {
    root_chain_id: chainId,
  });

  return (
    <div className="min-h-screen bg-void-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            Chain Visualization
          </h1>
          <p className="text-white/40">
            Tracking awareness spread for:{" "}
            <span className="text-neon-cyan">
              {(chain.awareness_posts as { title: string } | null)?.title}
            </span>
          </p>
        </div>
        <ChainVisualizerClient chain={chain} treeNodes={treeNodes ?? []} />
      </div>
    </div>
  );
}
