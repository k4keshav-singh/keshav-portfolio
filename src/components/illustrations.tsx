/**
 * Generic illustrations for the project cards, drawn in code.
 *
 * These are NOT screenshots or diagrams of company software, which is
 * confidential. Each one is labelled "Illustration" on the card and shows a
 * general pattern with made-up labels and values.
 */

function Badge({ children, tone }: { children: string; tone: "ok" | "warn" | "muted" }) {
  const cls =
    tone === "ok" ? "bg-[#2f6a3b] text-cream" : tone === "warn" ? "bg-accent-bright text-ink" : "bg-ink-line text-cream-muted";
  return <span className={`rounded-md px-1.5 py-0.5 font-mono text-[0.62rem] ${cls}`}>{children}</span>;
}

/** Generic: messages flow into a router and leave with a confidence label. */
export function RouterIllustration() {
  const sources = ["email", "tracker", "business app"];
  const lanes: [string, string, "ok" | "warn" | "muted"][] = [
    ["topic A", "SURE", "ok"],
    ["topic B", "LIKELY", "warn"],
    ["a person", "UNCLEAR", "muted"],
  ];
  return (
    <div className="grid w-full max-w-[560px] grid-cols-1 items-center gap-3 font-mono text-[0.72rem] text-cream sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s} className="rounded-lg border border-ink-line bg-ink-2 px-3 py-2">
            {s}
            <span className="ml-2 text-cream-muted">→</span>
          </li>
        ))}
      </ul>
      <div className="rounded-2xl border border-accent-bright/60 bg-ink-2 px-4 py-6 text-center shadow-[0_0_40px_-10px_var(--accent-bright)]">
        <p className="font-display text-lg tracking-tight text-cream">router</p>
        <p className="mt-1 text-[0.6rem] text-cream-muted">dedupe · classify · prioritise</p>
        <p className="mt-2 text-[0.6rem] text-cream-muted">rules first</p>
      </div>
      <ul className="space-y-2">
        {lanes.map(([lane, conf, tone]) => (
          <li key={lane} className="flex items-center justify-between gap-2 rounded-lg border border-ink-line bg-ink-2 px-3 py-2">
            <span>{lane}</span>
            <Badge tone={tone}>{conf}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Generic: stacked human approvals and a sandbox result. */
export function GatesIllustration() {
  const gates: [string, string, "ok" | "warn" | "muted"][] = [
    ["spec", "APPROVED", "ok"],
    ["code", "APPROVED", "ok"],
    ["tests", "APPROVED", "ok"],
    ["sandbox · no network", "PASS", "ok"],
    ["final acceptance", "WAITING", "warn"],
  ];
  return (
    <ol className="w-full max-w-[420px] space-y-2 font-mono text-[0.72rem] text-cream">
      {gates.map(([g, s, tone], i) => (
        <li
          key={g}
          className="flex items-center justify-between rounded-xl border border-ink-line bg-ink-2 px-4 py-3"
          style={{ transform: `translateX(${(i % 2) * 18}px) rotate(${i % 2 ? -1.2 : 1}deg)` }}
        >
          <span>{g}</span>
          <Badge tone={tone}>{s}</Badge>
        </li>
      ))}
    </ol>
  );
}

/** Generic: a results card with a score ring and attempt rows (made-up values). */
export function ResultsIllustration() {
  const rows = [
    ["Practice test", "62%"],
    ["Mock test", "48%"],
    ["Topic quiz", "71%"],
  ];
  return (
    <div className="w-full max-w-[460px] rounded-2xl bg-cream p-5 text-ink shadow-xl">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 36 36" className="h-16 w-16" aria-hidden="true">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#e0d9c8" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#f26a1b" strokeWidth="4" strokeDasharray="58 94" strokeLinecap="round" transform="rotate(-90 18 18)" />
        </svg>
        <div>
          <p className="font-display text-xl">Your results</p>
          <p className="font-mono text-[0.68rem] text-muted">server-timed · one session per test</p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-line text-sm">
        {rows.map(([n, s]) => (
          <li key={n} className="flex justify-between py-2">
            <span>{n}</span>
            <span className="font-mono">{s}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 inline-flex rounded-full bg-ink px-3 py-1.5 font-mono text-[0.68rem] text-cream">Download PDF report</p>
    </div>
  );
}

/** Generic: a phone screen with a plan card and add-on rows (sample values). */
export function PhoneIllustration() {
  const rows: [string, string][] = [
    ["Extra storage", "sample"],
    ["Marked answers", "sample"],
    ["Test series", "sample"],
  ];
  return (
    <div className="w-[230px] rounded-[2.2rem] border-[6px] border-ink-2 bg-cream p-4 text-ink shadow-2xl">
      <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-ink/20" />
      <p className="font-display text-lg">Plans</p>
      <div className="mt-2 rounded-2xl bg-surface p-3 shadow-sm">
        <p className="font-mono text-[0.6rem] text-muted uppercase">Your plan</p>
        <p className="mt-1 text-sm font-medium">Free plan</p>
      </div>
      <ul className="mt-3 space-y-2 text-[0.78rem]">
        {rows.map(([n, tag]) => (
          <li key={n} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2 shadow-sm">
            <span>{n}</span>
            <span className="rounded-md border border-line px-1 font-mono text-[0.58rem] text-muted">{tag}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center font-mono text-[0.6rem] text-muted">English · हिन्दी</p>
    </div>
  );
}

export const illustrationFor: Record<string, () => React.JSX.Element> = {
  "decision-intelligence": RouterIllustration,
  "code-agent": GatesIllustration,
  "learning-platform": ResultsIllustration,
  "exam-prep-app": PhoneIllustration,
};
