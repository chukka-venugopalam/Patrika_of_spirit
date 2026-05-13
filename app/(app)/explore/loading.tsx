import { PostGridSkeleton } from "@/components/ui/Skeletons";

export default function ExploreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 space-y-3">
        <div className="h-12 w-64 rounded-xl bg-white/5 animate-pulse" />
        <div className="h-5 w-48 rounded-lg bg-white/5 animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-xl bg-white/5 animate-pulse mb-8" />
      <PostGridSkeleton count={9} />
    </div>
  );
}
