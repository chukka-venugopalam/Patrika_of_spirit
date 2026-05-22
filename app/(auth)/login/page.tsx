import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your AwareNet account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-void-950 flex flex-col">
      <ParticleBackground />

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center glow-cyan">
            <Zap className="w-5 h-5 text-void-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-2xl gradient-text-cyan">AwareNet</span>
        </Link>

        <LoginForm />

        <p className="mt-6 text-white/30 text-sm font-mono">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-neon-cyan hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
