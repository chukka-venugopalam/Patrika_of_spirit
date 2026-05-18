"use client";

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[#03050a] flex items-center justify-center px-4 text-center">
        <div className="space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-2xl mb-2" style={{ fontFamily: "sans-serif" }}>
              Something went wrong
            </h1>
            <p className="text-white/40 text-sm">
              An unexpected error occurred. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-white/20 text-xs mt-2 font-mono">Error ID: {error.digest}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #00f5ff, #b400ff)", color: "#03050a" }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
