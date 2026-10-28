import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

/** Centered section heading: a small bracketed label over a large serif title. */
export function SectionHeading({
  id,
  index,
  title,
  lead,
}: {
  id: string;
  index: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className="reveal mb-14 flex flex-col items-center text-center">
      <p className="flex items-center gap-2 text-sm text-muted">
        <span aria-hidden="true" className="sun-dot" />
        <span>
          <span aria-hidden="true">( {index} )</span>
        </span>
      </p>
      <h2 id={id} className="font-display mt-4 text-[2.4rem] leading-[1.05] text-text sm:text-6xl">
        {title}
      </h2>
      {lead ? <p className="prose-measure mt-5 text-muted">{lead}</p> : null}
    </div>
  );
}

/** Asterisk divider. */
export function StarRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`star-rule ${className}`}>
      <span className="font-display text-xl">✳</span>
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface/70 px-2.5 py-0.5 font-mono text-[0.76rem] leading-6 text-muted">
      {children}
    </span>
  );
}

export function ChipList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}

