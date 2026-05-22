"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const STATS = [
  { value: 2400000, suffix: "+", label: "Awareness Posts", description: "Issues tracked globally" },
  { value: 186000, suffix: "+", label: "Active Users", description: "Spreading awareness daily" },
  { value: 48000000, suffix: "+", label: "People Reached", description: "Through chain propagation" },
  { value: 12, suffix: "x", label: "Viral Multiplier", description: "Average chain reaction depth", decimals: 0 },
  { value: 94, suffix: "%", label: "Share Rate", description: "Of readers share onward" },
  { value: 180, suffix: "+", label: "Countries", description: "Represented on the network" },
];

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-900/50 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-neon-green border border-neon-green/20 bg-neon-green/5 mb-4">
            IMPACT AT SCALE
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            Numbers That
            <span className="gradient-text"> Can&apos;t Be Ignored</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="glass-card rounded-2xl p-6 sm:p-8 text-center border border-white/[0.06] relative overflow-hidden group hover:border-neon-cyan/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/0 group-hover:from-neon-cyan/5 transition-all duration-500 rounded-2xl" />
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-neon-cyan mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} delay={0.3 + i * 0.05} decimals={stat.decimals ?? 0} />
              </div>
              <div className="font-display font-semibold text-white text-base mb-1">{stat.label}</div>
              <div className="text-white/30 text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
