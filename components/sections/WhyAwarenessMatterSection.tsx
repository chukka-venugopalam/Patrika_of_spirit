"use client";

import { motion } from "framer-motion";
import { Eye, Link2, Zap, Globe, Shield, Heart } from "lucide-react";

const PILLARS = [
  {
    icon: Eye,
    title: "See the Unseen",
    description:
      "Most critical issues are buried under noise. We surface what truly matters — the stories that shape your world whether you know it or not.",
    color: "#00f5ff",
    delay: 0,
  },
  {
    icon: Link2,
    title: "Connect the Dots",
    description:
      "Every issue ripples outward. Climate affects food. Food affects conflict. Conflict affects health. Our network reveals these invisible chains.",
    color: "#b400ff",
    delay: 0.1,
  },
  {
    icon: Zap,
    title: "Ignite Action",
    description:
      "Awareness without action is incomplete. Every post comes with practical next steps — because change starts with the first person who knows.",
    color: "#00ff88",
    delay: 0.2,
  },
  {
    icon: Globe,
    title: "Global to Local",
    description:
      "Global problems have local faces. We translate macro-level crises into stories from your neighborhood, your country, your community.",
    color: "#ffd700",
    delay: 0.3,
  },
  {
    icon: Shield,
    title: "Fight Misinformation",
    description:
      "In the age of deepfakes and propaganda, verified awareness is a superpower. Every claim on AwareNet is source-linked and fact-checked.",
    color: "#ff6b00",
    delay: 0.4,
  },
  {
    icon: Heart,
    title: "Empathy at Scale",
    description:
      "Data changes minds. Stories change hearts. We combine both — turning statistics into human narratives that make you feel, not just know.",
    color: "#ff00aa",
    delay: 0.5,
  },
];

export function WhyAwarenessMatterSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-neon-purple/5 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-neon-purple border border-neon-purple/20 bg-neon-purple/5 mb-4">
            OUR MISSION
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Why Awareness
            <span className="gradient-text-purple"> Changes Everything</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            In a world drowning in information, the ability to identify what truly matters is the
            rarest and most powerful skill. We build that muscle — together.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: pillar.delay, ease: [0.22, 1, 0.36, 1] }}
              className="group glass-card rounded-2xl p-6 border border-white/[0.06] hover:border-white/10 transition-all duration-500 relative overflow-hidden"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(ellipse at 20% 20%, ${pillar.color}08 0%, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div
                className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: `${pillar.color}15`,
                  border: `1px solid ${pillar.color}30`,
                }}
              >
                <pillar.icon className="w-5 h-5" style={{ color: pillar.color }} />
              </div>

              <h3 className="font-display font-bold text-white text-lg mb-2">{pillar.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{pillar.description}</p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700"
                style={{ background: `linear-gradient(90deg, ${pillar.color}66, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
