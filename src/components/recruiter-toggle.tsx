"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { readMode, subscribeMode, writeMode } from "@/lib/mode";

/**
 * Switch for recruiter mode. It is a real switch (role="switch" with
 * aria-checked), so screen readers announce "Recruiter mode, on/off".
 */
export function RecruiterToggle({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => "story" as const);
  const on = mode === "recruiter";
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = on ? "story" : "recruiter";
    writeMode(next);
    // The recruiter summary lives on the home page; from a case study, go there.
    if (next === "recruiter" && pathname !== "/") {
      router.push("/?mode=recruiter");
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      className={`group inline-flex min-h-10 items-center gap-2.5 rounded-full px-3 text-[0.9rem] text-text ${className}`}
    >
      <span className={compact ? "max-[420px]:sr-only" : undefined}>{compact ? "Recruiter" : "Recruiter mode"}</span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          on ? "border-text bg-text" : "border-line-strong bg-surface-2"
        }`}
      >
        <span
          className={`absolute h-4 w-4 rounded-full transition-transform ${
            on ? "translate-x-[1.35rem] bg-accent-bright" : "translate-x-1 bg-muted"
          }`}
        />
      </span>
      {compact ? null : (
        <span aria-hidden="true" className="w-6 font-mono text-[0.7rem] text-muted">
          {on ? "ON" : "OFF"}
        </span>
      )}
    </button>
  );
}
