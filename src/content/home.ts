/**
 * "What I ship" — four capabilities, each tied to the case study that shows it.
 * Internship work is described at the level of general patterns only; see
 * projects.ts for the confidentiality standard.
 */
export const capabilities = [
  {
    n: "01",
    title: "Multi-agent pipelines that show their work.",
    body: "Connectors that collect signals from business tools, a rules-first router that says how sure it is, and recommendations where code works out the numbers before a model writes a word.",
    proof: { label: "Decision Intelligence case study", href: "/work/decision-intelligence" },
    stack: ["Python", "FastAPI", "Redis Streams", "MongoDB", "LLM APIs"],
    tone: "bg-[#3b2fae] text-cream",
    principle: { text: "If the rules can't decide and the model isn't sure, a person decides. Nothing is guessed.", label: "Design principle" },
  },
  {
    n: "02",
    title: "Code generation with a human in the loop.",
    body: "An agent workflow with approval steps, code and tests written independently from one approved spec, an isolated sandbox, and an audit trail that keeps human and automated approvals apart.",
    proof: { label: "Code Agent case study", href: "/work/code-agent" },
    stack: ["LangGraph", "Docker", "SQLite", "pytest", "Ruff"],
    tone: "bg-[#f26a1b] text-ink",
    principle: { text: "Generated code is untrusted: no network, read-only files, strict limits.", label: "Design principle" },
  },
  {
    n: "03",
    title: "Product features, shipped end to end.",
    body: "Learning path, results with PDF reports, settings and test-taking flows in a Next.js app, with time limits and sessions enforced on the server and every change through a reviewed pull request.",
    proof: { label: "Learning Platform case study", href: "/work/learning-platform" },
    stack: ["TypeScript", "Next.js", "TanStack Query", "zod", "Vitest"],
    tone: "bg-[#c8361f] text-cream",
    principle: { text: "The browser shows the test. The server keeps the answers and the clock.", label: "Design principle" },
  },
  {
    n: "04",
    title: "Tooling and docs a team can follow.",
    body: "A set of procedures for the team's AI coding-assistant skills, plugins and Python tooling, with every instruction re-checked against how the product actually behaves.",
    proof: { label: "See the tooling list", href: "/#tooling" },
    stack: ["Claude Code", "pytest", "Ruff", "MkDocs"],
    tone: "bg-[#6b4f3a] text-cream",
    principle: { text: "A procedure is only useful if it matches what the tool really does today.", label: "Design principle" },
  },
] as const;

/**
 * "How I work" cards. Deliberately qualitative: internal metrics, repository
 * statistics and counts belong to the company and are not published.
 */
export const practices: { value: string; label: string; detail: string }[] = [
  { value: "Reviewed", label: "Every change through a pull request and a mentor's review", detail: "Learning Platform" },
  { value: "Tested", label: "Unit, property-based and component tests for what I build", detail: "All three projects" },
  { value: "Gated", label: "A person approves the steps that matter in AI workflows", detail: "Code Agent" },
  { value: "Traceable", label: "Rules, confidence and sources visible for every decision", detail: "Decision Intelligence" },
  { value: "Isolated", label: "Untrusted, AI-generated code only runs in a locked-down sandbox", detail: "Code Agent" },
  { value: "Server-side", label: "Time limits, sessions and answers enforced where they can't be tampered with", detail: "Learning Platform" },
];

/** Tool names for the hero strip (plain text, not logos). */
export const toolStrip = ["Python", "LangGraph", "FastAPI", "Redis Streams", "MongoDB", "LLM APIs", "Docker", "Next.js", "TypeScript", "pytest"];
