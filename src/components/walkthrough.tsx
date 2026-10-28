"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { Tone, Walkthrough } from "@/content/walkthroughs";

const toneMeta: Record<Tone, { label: string; className: string }> = {
  neutral: { label: "STEP", className: "border-line-strong text-muted" },
  pass: { label: "PASS", className: "border-pass/40 text-pass" },
  human: { label: "HUMAN", className: "border-amber/50 text-amber" },
  fail: { label: "FAIL", className: "border-rose/50 text-rose" },
  stop: { label: "STOP", className: "border-line-strong text-text" },
};

/**
 * "Inside an AI workflow": a step-through of a simulated run.
 *
 * State is just (system, scenario, step). step = -1 means "not started".
 * Everything shown is also available as plain text in the disclosure below
 * the controls, so nothing depends on the interactive part.
 */
export function WalkthroughExplorer({ systems }: { systems: Walkthrough[] }) {
  const baseId = useId();
  const [systemIndex, setSystemIndex] = useState(0);
  const [scenarioId, setScenarioId] = useState(systems[0].scenarios[0].id);
  const [step, setStep] = useState(-1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const system = systems[systemIndex];
  const scenario = system.scenarios.find((s) => s.id === scenarioId) ?? system.scenarios[0];
  const steps = scenario.steps;
  const current = step >= 0 ? steps[step] : undefined;

  // Which pipeline nodes this scenario touches, and which have been reached so far.
  const { touched, reached } = useMemo(() => {
    const touched = new Set(steps.map((s) => s.node));
    const reached = new Set(steps.slice(0, Math.max(step + 1, 0)).map((s) => s.node));
    return { touched, reached };
  }, [steps, step]);

  const selectSystem = (index: number) => {
    setSystemIndex(index);
    setScenarioId(systems[index].scenarios[0].id);
    setStep(-1);
  };

  // Roving focus for the tab list (WAI-ARIA tabs pattern).
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % systems.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + systems.length) % systems.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = systems.length - 1;
    else return;
    e.preventDefault();
    selectSystem(next);
    tabRefs.current[next]?.focus();
  };

  const panelId = `${baseId}-panel`;
  const btn =
    "inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="rounded-[2rem] border border-line bg-surface shadow-[0_10px_40px_rgba(58,38,36,0.08)]">
      {/* System tabs */}
      <div role="tablist" aria-label="Choose a system" className="relative flex flex-wrap gap-1 border-b border-line p-2">
        {systems.map((s, i) => {
          const selected = i === systemIndex;
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectSystem(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm transition-colors ${
                selected ? "bg-text text-cream" : "text-muted hover:text-text"
              }`}
            >
              {s.system}
              <span className="sr-only">{selected ? " (selected)" : ""}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={panelId} aria-labelledby={`${baseId}-tab-${systemIndex}`} className="p-4 sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-3xl">{system.title}</h3>
          <p className="text-sm text-muted">
            <span className="font-mono text-amber">Simulated walkthrough · synthetic data</span> — not a live
            trace or measured output. {system.basis}
          </p>
        </div>

        {/* Scenario picker: a radio group, so the choice is announced and keyboard-native. */}
        <fieldset className="mt-5">
          <legend className="mb-2 text-sm text-faint">Scenario</legend>
          <div className="flex flex-wrap gap-2">
            {system.scenarios.map((s) => {
              const checked = s.id === scenario.id;
              return (
                <label
                  key={s.id}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                    checked ? "border-text bg-surface-2 text-text" : "border-line text-muted hover:text-text"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${baseId}-scenario`}
                    value={s.id}
                    checked={checked}
                    onChange={() => {
                      setScenarioId(s.id);
                      setStep(-1);
                    }}
                    className="sr-only"
                  />
                  {s.label}
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-muted">{scenario.summary}</p>
        </fieldset>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Pipeline rail */}
          <ol aria-label="Pipeline stages" className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            {system.nodes.map((n) => {
              const isCurrent = current?.node === n.id;
              const isReached = reached.has(n.id);
              const inScenario = touched.has(n.id);
              return (
                <li
                  key={n.id}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex items-center gap-2.5 rounded-full px-3 py-1.5 font-mono text-[0.8rem] ${
                    isCurrent ? "bg-surface-2 text-text" : isReached ? "text-muted" : "text-faint"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 shrink-0 rounded-full border ${
                      isCurrent ? "border-accent-bright bg-accent-bright" : isReached ? "border-muted bg-muted" : inScenario ? "border-line-strong" : "border-dashed border-line-strong"
                    }`}
                  />
                  <span>
                    {n.label}
                    {isCurrent ? <span className="sr-only"> (current stage)</span> : null}
                    {!inScenario ? <span className="sr-only"> (not used in this scenario)</span> : null}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Step detail */}
          <div className="min-h-[13rem] rounded-3xl border border-line bg-bg/70 p-5 sm:p-6 lg:col-span-8 lg:min-h-[18rem]">
            <div aria-live="polite" aria-atomic="true">
              {current ? (
                <div key={`${scenario.id}-${step}`} className="fade-in">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-faint">
                      Step {step + 1} of {steps.length}
                    </span>
                    <span className={`rounded border px-1.5 py-0.5 font-mono text-[0.7rem] ${toneMeta[current.tone].className}`}>
                      {toneMeta[current.tone].label}
                    </span>
                  </div>
                  <h4 className="font-display mt-3 text-xl sm:text-2xl">{current.title}</h4>
                  <p className="mt-2 text-[0.98rem] text-muted">{current.body}</p>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-xs text-faint">Not started · {steps.length} steps</p>
                  <h4 className="font-display mt-3 text-xl sm:text-2xl">{scenario.label}</h4>
                  <p className="mt-2 text-[0.98rem] text-muted">
                    Press Start to step through the run. Each step shows what happens and the state at that point.
                  </p>
                </div>
              )}
            </div>
            {current?.state ? (
              <pre
                aria-label="Synthetic state at this step"
                className="mt-4 overflow-x-auto rounded-2xl border border-line bg-surface p-4 font-mono text-[0.8rem] leading-relaxed text-text"
              >
                {current.state}
              </pre>
            ) : null}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Walkthrough controls">
          {step < 0 ? (
            <button type="button" onClick={() => setStep(0)} className={`${btn} border-text bg-text text-cream hover:bg-accent hover:border-accent`}>
              Start
            </button>
          ) : (
            <>
              <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className={`${btn} border-line text-text hover:bg-surface-2`}>
                Previous
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                disabled={step === steps.length - 1}
                className={`${btn} border-text bg-text text-cream hover:bg-accent hover:border-accent`}
              >
                Next
              </button>
            </>
          )}
          <button type="button" onClick={() => setStep(-1)} disabled={step < 0} className={`${btn} border-line text-muted hover:text-text`}>
            Reset
          </button>
        </div>

        {/* Static text equivalent */}
        <details className="mt-6 rounded-2xl border border-line">
          <summary className="cursor-pointer px-4 py-3 text-sm text-muted hover:text-text">
            Read this scenario as text ({steps.length} steps)
          </summary>
          <ol className="list-decimal space-y-3 px-4 pb-4 pl-9 text-sm text-muted">
            {steps.map((s, i) => (
              <li key={i}>
                <span className="text-text">{s.title}.</span> {s.body}
                {s.state ? <span className="mt-1 block whitespace-pre-wrap font-mono text-[0.78rem] text-faint">{s.state}</span> : null}
              </li>
            ))}
          </ol>
        </details>
      </div>
    </div>
  );
}
