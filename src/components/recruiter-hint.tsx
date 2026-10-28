"use client";

import { writeMode } from "@/lib/mode";

/** Small invitation in the hero for visitors short on time. */
export function RecruiterHint() {
  return (
    <button
      type="button"
      onClick={() => {
        writeMode("recruiter");
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
      className="pill text-text hover:text-accent"
    >
      Short on time? Recruiter mode
      <span aria-hidden="true" className="pill-dot">
        →
      </span>
    </button>
  );
}
