"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white/5 relative overflow-hidden",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
      <SkeletonBlock className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <SkeletonBlock className="h-4 w-20" />
        <SkeletonBlock className="h-5 w-full" />
        <SkeletonBlock className="h-5 w-3/4" />
        <div className="flex justify-between pt-2">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="rounded-3xl p-8 border border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-6">
          <SkeletonBlock className="w-24 h-24 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <SkeletonBlock className="h-7 w-48" />
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-4 w-full max-w-md" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.06]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center space-y-1">
              <SkeletonBlock className="h-8 w-16 mx-auto" />
              <SkeletonBlock className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div>
      <SkeletonBlock className="h-[70vh] w-full" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="rounded-2xl p-8 border border-white/[0.06] bg-white/[0.02] space-y-4">
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-4/5" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 space-y-4">
            <SkeletonBlock className="h-48 rounded-2xl" />
            <SkeletonBlock className="h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
