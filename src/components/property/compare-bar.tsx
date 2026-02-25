"use client";

import Link from "next/link";
import { ArrowLeftRight, X } from "lucide-react";
import { useCompare } from "@/lib/compare-context";

export function CompareBar() {
  const { compareIds, clearCompare } = useCompare();

  if (compareIds.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-warm-200 bg-white/95 px-5 py-3.5 shadow-lg shadow-warm-900/10 backdrop-blur-sm">
          {/* Left: icon + count */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-copper/10">
              <ArrowLeftRight className="size-4 text-copper" />
            </div>
            <div>
              <p className="text-sm font-semibold text-warm-900">
                Compare ({compareIds.length}/3)
              </p>
              <p className="text-xs text-warm-500">
                {compareIds.length === 1
                  ? "Add more properties to compare"
                  : "Ready to compare"}
              </p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-warm-200 bg-white px-3 py-2 text-xs font-medium text-warm-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <X className="size-3.5" />
              Clear
            </button>
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 rounded-xl bg-copper px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-copper/90"
            >
              Compare Now
              <ArrowLeftRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
