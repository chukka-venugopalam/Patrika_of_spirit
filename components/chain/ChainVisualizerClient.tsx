"use client";

import { useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { TrendingUp, Users, Link2 } from "lucide-react";

interface TreeNode {
  id: string;
  parent_chain_id: string | null;
  root_user_id: string;
  depth: number;
  total_reach: number;
  share_code: string;
  created_at: string;
}

interface ChainVisualizerClientProps {
  chain: {
    id: string;
    depth: number;
    total_reach: number;
    share_code: string;
  };
  treeNodes: TreeNode[];
}

// Custom chain node
function ChainNode({ data }: { data: { depth: number; reach: number; isRoot: boolean; date: string } }) {
  return (
    <div
      className="rounded-full flex flex-col items-center justify-center cursor-pointer"
      style={{
        width: data.isRoot ? 80 : 60,
        height: data.isRoot ? 80 : 60,
        background: data.isRoot
          ? "radial-gradient(circle, rgba(0,245,255,0.3), rgba(0,245,255,0.1))"
          : "radial-gradient(circle, rgba(180,0,255,0.25), rgba(180,0,255,0.08))",
        border: data.isRoot ? "2px solid rgba(0,245,255,0.6)" : "1px solid rgba(180,0,255,0.4)",
        boxShadow: data.isRoot
          ? "0 0 30px rgba(0,245,255,0.4)"
          : "0 0 15px rgba(180,0,255,0.3)",
      }}
    >
      <span className="text-[9px] font-mono text-white/80">
        {data.isRoot ? "ROOT" : `L${data.depth}`}
      </span>
      {data.reach > 0 && (
        <span className="text-[8px] font-mono text-neon-cyan">{data.reach}</span>
      )}
    </div>
  );
}

const nodeTypes: NodeTypes = { chainNode: ChainNode };

function buildFlowGraph(nodes: TreeNode[]) {
  if (nodes.length === 0) return { flowNodes: [], flowEdges: [] };

  // Position nodes by depth using a simple tree layout
  const byDepth: Record<number, TreeNode[]> = {};
  nodes.forEach((n) => {
    if (!byDepth[n.depth]) byDepth[n.depth] = [];
    byDepth[n.depth].push(n);
  });

  const SPACING_X = 120;
  const SPACING_Y = 140;

  const flowNodes: Node[] = nodes.map((n) => {
    const depthNodes = byDepth[n.depth];
    const indexInDepth = depthNodes.indexOf(n);
    const totalAtDepth = depthNodes.length;
    const x = (indexInDepth - (totalAtDepth - 1) / 2) * SPACING_X;
    const y = (n.depth - 1) * SPACING_Y;

    return {
      id: n.id,
      type: "chainNode",
      position: { x, y },
      data: {
        depth: n.depth,
        reach: n.total_reach,
        isRoot: !n.parent_chain_id,
        date: n.created_at,
      },
    };
  });

  const flowEdges: Edge[] = nodes
    .filter((n) => n.parent_chain_id)
    .map((n) => ({
      id: `e-${n.parent_chain_id}-${n.id}`,
      source: n.parent_chain_id!,
      target: n.id,
      animated: true,
      style: { stroke: "rgba(180,0,255,0.4)", strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(180,0,255,0.6)" },
    }));

  return { flowNodes, flowEdges };
}

export function ChainVisualizerClient({ chain, treeNodes }: ChainVisualizerClientProps) {
  const { flowNodes, flowEdges } = useMemo(() => buildFlowGraph(treeNodes), [treeNodes]);

  const maxDepth = Math.max(...treeNodes.map((n) => n.depth), 1);
  const totalReach = treeNodes.reduce((sum, n) => sum + n.total_reach, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Chain Depth", value: maxDepth, icon: TrendingUp, color: "#00f5ff" },
          { label: "Total Nodes", value: treeNodes.length, icon: Link2, color: "#b400ff" },
          { label: "Total Reach", value: totalReach, icon: Users, color: "#00ff88" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5 border border-white/[0.06] flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <div className="font-display font-bold text-2xl text-white">{stat.value}</div>
              <div className="text-white/30 text-xs font-mono">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* React Flow visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="h-[600px] rounded-2xl overflow-hidden glass-card border border-white/[0.06]"
      >
        {treeNodes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20">
            <Link2 className="w-12 h-12 mb-4" />
            <p className="font-mono text-sm">No chain branches yet.</p>
            <p className="text-xs mt-1">Share the chain link to grow this tree.</p>
          </div>
        ) : (
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(0,245,255,0.06)"
            />
            <Controls showInteractive={false} />
          </ReactFlow>
        )}
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs font-mono text-white/40">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: "rgba(0,245,255,0.3)", border: "2px solid rgba(0,245,255,0.6)" }} />
          Root node (you)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ background: "rgba(180,0,255,0.25)", border: "1px solid rgba(180,0,255,0.4)" }} />
          Chain branches
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px" style={{ background: "rgba(180,0,255,0.4)" }} />
          Propagation path
        </div>
      </div>
    </div>
  );
}
