"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ParticleBackground } from "@/components/ui/ParticleBackground";

const CATEGORIES = [
  { id: "society", name: "Society", icon: "🌍", color: "#00f5ff", description: "Human rights, inequality, justice" },
  { id: "health", name: "Health", icon: "❤️", color: "#ff6b6b", description: "Global health, mental wellness" },
  { id: "environment", name: "Environment", icon: "🌱", color: "#00ff88", description: "Climate, biodiversity, sustainability" },
  { id: "technology", name: "Technology", icon: "⚡", color: "#b400ff", description: "Digital rights, tech inequality" },
  { id: "politics", name: "Politics", icon: "🏛️", color: "#ff6b00", description: "Democracy, governance, accountability" },
  { id: "education", name: "Education", icon: "📚", color: "#ffd700", description: "Access, literacy, knowledge equity" },
  { id: "history", name: "History", icon: "📜", color: "#c0a882", description: "Historical events and lessons" },
  { id: "finance", name: "Finance", icon: "💹", color: "#00ff88", description: "Economic inequality, financial literacy" },
  { id: "cybersecurity", name: "Cybersecurity", icon: "🔒", color: "#00f5ff", description: "Digital threats, privacy rights" },
  { id: "ai-future", name: "AI & Future", icon: "🤖", color: "#b400ff", description: "Artificial intelligence, automation" },
];

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  const toggleCategory = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    if (!user) return;
    if (selected.length < 3) {
      setError("Please select at least 3 interests.");
      return;
    }

    setLoading(true);
    setError(null);

    // Update username if provided
    if (username.trim()) {
      const { error: usernameError } = await supabase
        .from("users")
        .update({ username: username.trim(), onboarding_completed: true })
        .eq("id", user.id);

      if (usernameError) {
        setError(usernameError.message);
        setLoading(false);
        return;
      }
    } else {
      await supabase
        .from("users")
        .update({ onboarding_completed: true })
        .eq("id", user.id);
    }

    // Save interests
    const categoryData = await supabase.from("categories").select("id, slug").in("slug", selected);

    if (categoryData.data) {
      await supabase.from("user_interests").insert(
        categoryData.data.map((cat) => ({ user_id: user.id, category_id: cat.id }))
      );
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-void-950 flex flex-col">
      <ParticleBackground />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan">
            <Zap className="w-5 h-5 text-void-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-2xl gradient-text-cyan">AwareNet</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                  step >= s
                    ? "bg-gradient-to-br from-neon-cyan to-neon-purple text-void-950"
                    : "glass border border-white/10 text-white/30"
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 2 && (
                <div
                  className={`w-16 h-px transition-all duration-500 ${
                    step > s ? "bg-neon-cyan" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="font-display font-bold text-3xl text-white mb-3">
                    What do you <span className="gradient-text">care about?</span>
                  </h1>
                  <p className="text-white/40">Select at least 3 categories to personalize your feed.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selected.includes(cat.id);
                    return (
                      <motion.button
                        key={cat.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(cat.id)}
                        className="relative p-4 rounded-2xl border transition-all duration-300 text-center group"
                        style={{
                          background: isSelected ? `${cat.color}15` : "rgba(255,255,255,0.03)",
                          borderColor: isSelected ? `${cat.color}50` : "rgba(255,255,255,0.08)",
                          boxShadow: isSelected ? `0 0 20px ${cat.color}25` : "none",
                        }}
                      >
                        {isSelected && (
                          <div
                            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: cat.color }}
                          >
                            <Check className="w-3 h-3 text-void-950" />
                          </div>
                        )}
                        <div className="text-2xl mb-2">{cat.icon}</div>
                        <div className="font-display font-semibold text-white text-xs">{cat.name}</div>
                        <div className="text-white/30 text-[10px] mt-1 leading-tight hidden sm:block">
                          {cat.description}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {error && <p className="text-center text-red-400 text-sm">{error}</p>}

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (selected.length < 3) {
                        setError("Please select at least 3 interests.");
                        return;
                      }
                      setError(null);
                      setStep(2);
                    }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold glow-cyan hover:opacity-90 transition-opacity"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h1 className="font-display font-bold text-3xl text-white mb-3">
                    Choose your <span className="gradient-text">identity</span>
                  </h1>
                  <p className="text-white/40">Pick a username for your awareness profile.</p>
                </div>

                <div className="glass-card rounded-3xl p-8 border border-white/[0.08]">
                  <div className="space-y-4">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-wider">
                      Username (optional)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono text-sm">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="yourname"
                        maxLength={30}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-4 text-white placeholder:text-white/20 text-base focus:outline-none focus:border-neon-cyan/40 focus:bg-neon-cyan/5 transition-all duration-200 font-mono"
                      />
                    </div>
                    <p className="text-white/20 text-xs">3-30 characters. Letters, numbers, underscores only.</p>
                  </div>

                  {/* Selected interests summary */}
                  <div className="mt-6 pt-6 border-t border-white/[0.06]">
                    <p className="text-white/40 text-sm mb-3">Your selected interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.map((id) => {
                        const cat = CATEGORIES.find((c) => c.id === id);
                        if (!cat) return null;
                        return (
                          <span
                            key={id}
                            className="px-3 py-1 rounded-full text-xs font-mono"
                            style={{ background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}30` }}
                          >
                            {cat.icon} {cat.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {error && <p className="text-center text-red-400 text-sm">{error}</p>}

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-xl glass border border-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold glow-cyan hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
                    ) : (
                      <>
                        Enter AwareNet
                        <Zap className="w-4 h-4" fill="currentColor" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
