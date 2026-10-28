"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sticky "deck" of cards: each card pins near the top and the next one slides
 * over it. While a card is being covered, it gets --cover (0 → 1) so CSS can
 * shrink and dim it, leaving the stacked edges visible behind the new card.
 * With reduced motion the cards simply scroll as a normal list.
 */
export function DeckScroller({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(list.children) as HTMLElement[];
    let raf = 0;
    const update = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return card.style.setProperty("--cover", "0");
        const a = card.getBoundingClientRect();
        const b = next.getBoundingClientRect();
        // 0 when the next card is a full card-height below, 1 when it has fully arrived.
        const cover = Math.min(1, Math.max(0, 1 - (b.top - a.top) / Math.max(a.height, 1)));
        card.style.setProperty("--cover", cover.toFixed(3));
      });
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
    <ol ref={ref} className={`deck ${className}`}>
      {children}
    </ol>
  );
}
