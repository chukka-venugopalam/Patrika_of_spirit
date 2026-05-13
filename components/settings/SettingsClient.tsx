"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, AlertCircle, Check } from "lucide-react";
import { updateProfile, updateInterests } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import type { User as UserProfile, Category } from "@/types/database";

interface SettingsClientProps {
  profile: UserProfile | null;
  categories: Category[];
  currentInterests: string[];
}

export function SettingsClient({ profile, categories, currentInterests }: SettingsClientProps) {
  const [username, setUsername] = useState(profile?.username ?? "");
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [interests, setInterests] = useState<string[]>(currentInterests);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingInterests, setSavingInterests] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleInterest = (categoryId: string) => {
    setInterests((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError(null);
    const formData = new FormData();
    formData.set("username", username);
    formData.set("full_name", fullName);
    formData.set("bio", bio);

    const result = await updateProfile(formData);
    if (result.error) {
      setProfileError(result.error);
    } else {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
    }
    setSavingProfile(false);
  };

  const handleSaveInterests = async () => {
    setSavingInterests(true);
    const result = await updateInterests(interests);
    if (result.error) {
      toast({ title: "Failed to save interests", variant: "destructive" });
    } else {
      toast({ title: "Interests updated!" });
    }
    setSavingInterests(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Settings</h1>
        <p className="text-white/40">Manage your profile and preferences.</p>
      </motion.div>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-6 border border-white/[0.06] space-y-5"
      >
        <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06]">
          <User className="w-4 h-4 text-neon-cyan" />
          <h2 className="font-display font-semibold text-white">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                maxLength={30}
                placeholder="yourname"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={100}
              placeholder="Your full name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Tell the world why awareness matters to you..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-neon-cyan/40 transition-all resize-none"
            />
            <p className="text-white/20 text-xs text-right font-mono">{bio.length}/500</p>
          </div>

          {profileError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {profileError}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {savingProfile ? (
              <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Profile
          </button>
        </div>
      </motion.div>

      {/* Interests section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6 border border-white/[0.06] space-y-5"
      >
        <div className="pb-4 border-b border-white/[0.06]">
          <h2 className="font-display font-semibold text-white mb-1">Awareness Interests</h2>
          <p className="text-white/40 text-sm">Select categories to personalize your feed.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const isSelected = interests.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleInterest(cat.id)}
                className="relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 text-left"
                style={{
                  background: isSelected ? `${cat.color}15` : "rgba(255,255,255,0.03)",
                  borderColor: isSelected ? `${cat.color}40` : "rgba(255,255,255,0.08)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: cat.color }}
                  >
                    <Check className="w-2.5 h-2.5 text-void-950" />
                  </div>
                )}
                <span className="text-xl">{cat.icon}</span>
                <span className="font-display font-medium text-white text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSaveInterests}
          disabled={savingInterests || interests.length < 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-void-950 font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {savingInterests ? (
            <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Interests
        </button>
      </motion.div>
    </div>
  );
}
