"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/content/profile";

/**
 * Floating call-to-action pill at the bottom of the screen. It slides in after
 * the visitor scrolls past the first screen and hides again over the contact
 * section and footer, so it never covers the content it points to.
 */
export function CtaBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const pastHero = window.scrollY > window.innerHeight * 0.7;
      const contact = document.getElementById("contact")?.closest("section");
      const footer = document.querySelector("footer");
      const nearEnd = [contact, footer].some((n) => n && n.getBoundingClientRect().top < window.innerHeight * 0.85);
      const show = pastHero && !nearEnd;
      if (show) el.dataset.show = "";
      else delete el.dataset.show;
      // Off-screen, it must not be reachable with Tab or by screen readers.
      el.inert = !show;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="cta-bar fixed bottom-4 left-1/2 z-30 flex w-[min(560px,calc(100%-2rem))] items-center justify-between gap-3 rounded-full bg-ink/90 py-2 pr-2 pl-5 text-cream shadow-[0_20px_50px_-20px_rgba(23,20,18,0.6)] backdrop-blur-md"
    >
      <p className="text-sm text-cream sm:text-[0.95rem]">Hiring an AI engineer?</p>
      <a href={`mailto:${profile.email}`} className="pill pill-light shrink-0">
        Get in touch
        <span aria-hidden="true" className="pill-dot">
          →
        </span>
      </a>
    </div>
  );
}
