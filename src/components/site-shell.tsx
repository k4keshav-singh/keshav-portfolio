"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type JSX } from "react";
import { visibleArchive } from "@/content/archive";
import { capabilities } from "@/content/home";
import { experience, profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { ArrowUpRight, BagIcon, BuildingIcon, DocIcon, FaceIcon, MailIcon, MenuIcon, TargetIcon } from "./icons";
import { RecruiterToggle } from "./recruiter-toggle";

/**
 * Site navigation shell.
 *
 * Desktop: a fixed left rail (wordmark, six icon buttons, "Menu") plus a
 * top-right "Get in touch" button, a right-edge scroll indicator and a live
 * New Delhi clock. Each rail icon opens a dark side panel on its own tab.
 * Mobile: a top bar with the wordmark and a menu button opening the same
 * panel full-width.
 *
 * The panel is a modal <dialog>: focus is trapped while open, Escape closes
 * it, and focus returns to the button that opened it. Its tabs follow the
 * WAI-ARIA tabs pattern (arrow keys move between them).
 */

type Item = {
  label: string;
  /** No href = shown as plain text with its note (e.g. source not public). */
  href?: string;
  external?: boolean;
  download?: boolean;
  storyOnly?: boolean;
  note?: string;
};
// storyOnly: hidden in recruiter mode, where the sections it points to are hidden.
type Group = { id: string; label: string; heading: string; Icon: (p: { className?: string }) => JSX.Element; items: Item[]; storyOnly?: boolean };

const groups: Group[] = [
  {
    id: "work",
    label: "Work",
    heading: "Case studies",
    Icon: BagIcon,
    items: [...projects.map((p) => ({ label: p.title, href: `/work/${p.slug}` })), { label: "All featured work", href: "/#work", storyOnly: true }],
  },
  {
    id: "systems",
    label: "Systems",
    heading: "Inside the systems",
    Icon: TargetIcon,
    storyOnly: true,
    items: [
      { label: "Human-in-the-loop coding", href: "/#engineering" },
      { label: "Explainable recommendations", href: "/#engineering" },
      { label: "Developer tooling", href: "/#tooling" },
    ],
  },
  {
    id: "ship",
    label: "Capabilities",
    heading: "What I ship",
    Icon: BuildingIcon,
    storyOnly: true,
    items: capabilities.map((c) => ({ label: c.title.replace(/\.$/, ""), href: "/#ship" })),
  },
  {
    id: "about",
    label: "About",
    heading: "About",
    Icon: FaceIcon,
    items: [
      { label: "How I work", href: "/#numbers", storyOnly: true },
      { label: "Experience", href: "/#experience" },
      ...experience.slice(0, 1).map((r) => ({ label: r.org.split(" · ")[0], href: "/#experience" })),
    ],
  },
  {
    id: "archive",
    label: "Archive",
    heading: "More work",
    Icon: DocIcon,
    storyOnly: true,
    // Each entry goes to the real thing: its public repo, or its section on this
    // page. Entries with nothing public yet are shown as text, not dead links.
    items: [
      ...visibleArchive.map((a): Item =>
        a.link
          ? { label: a.name, href: a.link.href, external: a.link.href.startsWith("http") }
          : { label: a.name, note: a.note ?? "Not public yet" },
      ),
      { label: "See them all on the page", href: "/#archive" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    heading: "Contact",
    Icon: MailIcon,
    items: [
      { label: "Say hello", href: "/#contact" },
      { label: "Email", href: `mailto:${profile.email}`, external: true },
      { label: "LinkedIn", href: profile.linkedin, external: true },
      { label: "GitHub", href: profile.github, external: true },
    ],
  },
];

function useClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", hour12: true });
    const tick = () => setTime(fmt.format(new Date()).toUpperCase());
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function SiteShell() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [tab, setTab] = useState(0);
  const [onDark, setOnDark] = useState(false);
  const time = useClock();
  const baseId = useId();

  // Scroll progress + "is the rail over a dark section?" in one rAF loop.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current?.style.setProperty("--progress", p.toFixed(4));
      const probe = document.elementsFromPoint(Math.min(70, window.innerWidth / 2), window.innerHeight / 2);
      setOnDark(probe.some((el) => el.closest(".on-ink") && !el.closest("[data-shell]")));
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

  const openAt = (i: number) => {
    setTab(i);
    dialogRef.current?.showModal();
    requestAnimationFrame(() => tabRefs.current[i]?.focus());
  };
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Close when the backdrop (outside the panel box) is clicked.
  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const d = dialogRef.current;
    if (!d || e.target !== d) return;
    const r = d.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) close();
  };

  const onTabKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % groups.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + groups.length) % groups.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = groups.length - 1;
    else return;
    e.preventDefault();
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  const tone = onDark ? "dark" : "light";
  const square = "rail-square group relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl transition-colors";

  const g = groups[tab];

  return (
    <div data-shell="" data-tone={tone} className="shell">
      {/* ---------- Desktop rail ---------- */}
      <nav aria-label="Primary" className="fixed top-0 left-0 z-40 hidden h-full w-[150px] flex-col items-center justify-between py-8 lg:flex">
        <Link href="/" aria-label={`${profile.name} — home`} className="shell-ink font-display text-center text-[1.85rem] leading-[0.82]">
          Keshav
          <br />
          Singh
        </Link>
        <ul className="flex flex-col gap-3">
          {groups.map((grp, i) => (
            <li key={grp.id} className={grp.storyOnly ? "story-only" : undefined}>
              <button
                type="button"
                onClick={() => openAt(i)}
                aria-haspopup="dialog"
                className={square}
              >
                <grp.Icon />
                <span className="rail-tip">{grp.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => openAt(0)} aria-haspopup="dialog" className="shell-ink label-caps flex min-h-11 flex-col items-center text-base">
          Menu
          <span aria-hidden="true" className="-mt-1 tracking-widest">
            •••
          </span>
        </button>
      </nav>

      {/* ---------- Top-right actions (desktop) ---------- */}
      <aside aria-label="Quick actions" className="fixed top-6 right-8 z-40 hidden items-center gap-2 lg:flex">
        <div className="rounded-full border border-line bg-surface p-0.5">
          <RecruiterToggle />
        </div>
        <a href={`mailto:${profile.email}`} className="shell-cta pill">
          Get in touch
        </a>
      </aside>

      {/* ---------- Right-edge scroll indicator + clock (wide screens) ---------- */}
      <span ref={progressRef} aria-hidden="true" className="shell-progress fixed top-1/2 right-[3.4rem] z-30 hidden h-[300px] w-px -translate-y-1/2 2xl:block">
        <span className="shell-progress-dot" />
      </span>
      {time ? (
        <aside aria-label="Local time" className="shell-muted fixed right-8 bottom-6 z-30 hidden text-sm 2xl:block">
          {profile.location} <strong className="shell-ink font-semibold">{time}</strong>
        </aside>
      ) : null}

      {/* ---------- Mobile top bar ---------- */}
      <header className="fixed inset-x-0 top-0 z-40 bg-bg/90 backdrop-blur-md lg:hidden">
        <div className="flex h-[4.25rem] items-center justify-between gap-2 px-4">
          <Link href="/" aria-label={`${profile.name} — home`} className="font-display inline-flex min-h-11 items-center text-[1.4rem] text-text">
            Keshav<em>Singh</em>
          </Link>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-line bg-surface p-0.5">
              <RecruiterToggle compact />
            </div>
            <button
              type="button"
              onClick={() => openAt(0)}
              aria-haspopup="dialog"
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-cream"
            >
              <MenuIcon />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Side panel ---------- */}
      <dialog ref={dialogRef} aria-label="Site menu" className="shell-panel on-ink" onClick={onDialogClick}>
        <div className="flex h-full">
          {/* Rail copy inside the panel doubles as the tab list. */}
          <div role="tablist" aria-orientation="vertical" aria-label="Menu sections" className="hidden w-[150px] shrink-0 flex-col items-center justify-center gap-3 sm:flex">
            {groups.map((grp, i) => (
              <button
                key={grp.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={i === tab}
                aria-controls={`${baseId}-panel`}
                tabIndex={i === tab ? 0 : -1}
                onClick={() => setTab(i)}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl transition-colors ${
                  i === tab ? "bg-cream text-ink" : "bg-ink-2 text-cream-muted hover:text-cream"
                } ${grp.storyOnly ? "story-only" : ""}`}
              >
                <grp.Icon />
                <span className="sr-only">{grp.label}</span>
              </button>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-6 py-8 sm:pr-12 sm:pl-6">
            <div className="flex items-center justify-between">
              <p className="label-caps text-cream-muted">{g.heading}</p>
              <button type="button" onClick={close} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-ink">
                <span aria-hidden="true" className="text-2xl leading-none">
                  ×
                </span>
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            {/* Mobile: tabs as a horizontal row. */}
            <div className="mt-4 flex flex-wrap gap-2 sm:hidden">
              {groups.map((grp, i) => (
                <button
                  key={grp.id}
                  type="button"
                  aria-pressed={i === tab}
                  onClick={() => setTab(i)}
                  className={`label-caps min-h-10 rounded-full px-3 ${i === tab ? "bg-cream text-ink" : "bg-ink-2 text-cream-muted"} ${grp.storyOnly ? "story-only" : ""}`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${tab}`} className="mt-6 flex-1">
              <ul key={g.id} className="panel-list">
                {g.items.map((it, i) => (
                  <li key={it.label + i} style={{ ["--i" as string]: i }} className={it.storyOnly ? "story-only" : undefined}>
                    {!it.href ? (
                      <span className="panel-link panel-link-static font-display">
                        {it.label}{" "}
                        <span className="align-middle font-mono text-xs tracking-normal text-cream-muted uppercase">{it.note}</span>
                      </span>
                    ) : it.external || it.download ? (
                      <a
                        href={it.href}
                        onClick={close}
                        {...(it.download ? { download: true } : { target: it.href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" })}
                        className="panel-link font-display"
                      >
                        {it.label}
                        {it.href.startsWith("http") ? (
                          <>
                            {" "}
                            <ArrowUpRight className="inline h-6 w-6" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </>
                        ) : null}
                      </a>
                    ) : (
                      <Link href={it.href} onClick={close} className="panel-link font-display">
                        {it.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {g.id === "work" ? (
                <div className="mt-10">
                  <p className="label-caps text-cream-muted">Recent case studies</p>
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {projects.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/work/${p.slug}`} onClick={close} className="block rounded-2xl bg-ink-2 p-4 ring-1 ring-ink-line hover:ring-cream-muted">
                          <span className="font-display block text-2xl text-cream">{p.title}</span>
                          <span className="mt-1 block font-mono text-[0.65rem] text-cream-muted uppercase">
                            {p.period} · {p.kicker.split(" · ")[0]}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
