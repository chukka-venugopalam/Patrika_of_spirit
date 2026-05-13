"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node component
function AwarenessNode({ data }: { data: { label: string; category: string; color: string; reach: number } }) {
  return (
    <div
      className="rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        width: 80,
        height: 80,
        background: `radial-gradient(circle at 30% 30%, ${data.color}33, ${data.color}11)`,
        border: `1px solid ${data.color}66`,
        boxShadow: `0 0 20px ${data.color}44`,
      }}
    >
      <span className="text-[9px] font-mono text-white/80 text-center px-1 leading-tight">
        {data.label}
      </span>
      <span className="text-[8px] font-mono mt-0.5" style={{ color: data.color }}>
        {data.reach >= 1000 ? (data.reach / 1000).toFixed(0) + "K" : data.reach}
      </span>
    </div>
  );
}

const nodeTypes: NodeTypes = { awarenessNode: AwarenessNode };

const INITIAL_NODES: Node[] = [
  {
    id: "1",
    type: "awarenessNode",
    position: { x: 400, y: 200 },
    data: { label: "Climate Crisis", category: "Environment", color: "#00ff88", reach: 2400000 },
  },
  {
    id: "2",
    type: "awarenessNode",
    position: { x: 150, y: 80 },
    data: { label: "AI Ethics", category: "Technology", color: "#b400ff", reach: 980000 },
  },
  {
    id: "3",
    type: "awarenessNode",
    position: { x: 650, y: 80 },
    data: { label: "Mental Health", category: "Health", color: "#ff6b6b", reach: 1200000 },
  },
  {
    id: "4",
    type: "awarenessNode",
    position: { x: 100, y: 320 },
    data: { label: "Digital Rights", category: "Technology", color: "#00f5ff", reach: 450000 },
  },
  {
    id: "5",
    type: "awarenessNode",
    position: { x: 700, y: 320 },
    data: { label: "Food Security", category: "Society", color: "#ffd700", reach: 780000 },
  },
  {
    id: "6",
    type: "awarenessNode",
    position: { x: 250, y: 420 },
    data: { label: "Deforestation", category: "Environment", color: "#00ff88", reach: 620000 },
  },
  {
    id: "7",
    type: "awarenessNode",
    position: { x: 550, y: 420 },
    data: { label: "Cybersecurity", category: "Tech", color: "#00f5ff", reach: 340000 },
  },
  {
    id: "8",
    type: "awarenessNode",
    position: { x: 400, y: 480 },
    data: { label: "Education Gap", category: "Education", color: "#ffd700", reach: 890000 },
  },
];

const INITIAL_EDGES: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#00f5ff44", strokeWidth: 1.5 } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#00f5ff44", strokeWidth: 1.5 } },
  { id: "e1-4", source: "1", target: "4", animated: true, style: { stroke: "#00f5ff33", strokeWidth: 1 } },
  { id: "e1-5", source: "1", target: "5", animated: true, style: { stroke: "#00f5ff33", strokeWidth: 1 } },
  { id: "e2-4", source: "2", target: "4", animated: false, style: { stroke: "#b400ff33", strokeWidth: 1 } },
  { id: "e1-6", source: "1", target: "6", animated: true, style: { stroke: "#00ff8833", strokeWidth: 1 } },
  { id: "e1-7", source: "1", target: "7", animated: false, style: { stroke: "#00f5ff22", strokeWidth: 1 } },
  { id: "e1-8", source: "1", target: "8", animated: true, style: { stroke: "#ffd70033", strokeWidth: 1 } },
  { id: "e3-5", source: "3", target: "5", animated: false, style: { stroke: "#ff6b6b33", strokeWidth: 1 } },
  { id: "e6-8", source: "6", target: "8", animated: false, style: { stroke: "#00ff8822", strokeWidth: 1 } },
];

export function NetworkVisualization() {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 mb-4">
            LIVE NETWORK
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            The Awareness
            <span className="gradient-text"> Web</span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Every node is a cause. Every connection is a chain. Drag, explore, and see how issues
            interlink across the globe.
          </p>
        </motion.div>

        {/* React Flow Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[500px] rounded-2xl overflow-hidden glass-card border border-white/[0.06]"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(0,245,255,0.08)"
            />
            <Controls
              className="glass-dark rounded-lg border border-white/10"
              showInteractive={false}
            />
            <MiniMap
              className="glass-dark rounded-lg border border-white/10"
              nodeColor={(n) => (n.data as { color: string }).color + "88"}
              maskColor="rgba(3,5,10,0.8)"
            />
          </ReactFlow>

          {/* Overlay label */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-xs font-mono text-white/40">Interactive — drag nodes to explore</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
