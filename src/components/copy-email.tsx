"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "copied" | "failed";

/**
 * Copies the address with the Clipboard API. If that's unavailable or
 * refused (insecure context, permissions), it says so and selects the
 * visible address so the visitor can copy it by hand.
 */
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const textRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const selectText = () => {
    const el = textRef.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      selectText();
      setStatus("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span ref={textRef} className="font-mono text-base text-text sm:text-lg">
        {email}
      </span>
      <button
        type="button"
        onClick={copy}
        className="pill pill-ghost text-sm"
      >
        {status === "copied" ? "Copied" : "Copy email"}
      </button>
      <span role="status" className="text-sm text-muted">
        {status === "copied" ? "Email address copied to clipboard." : status === "failed" ? "Couldn't copy automatically — the address is selected; press Ctrl/⌘+C." : ""}
      </span>
    </div>
  );
}
