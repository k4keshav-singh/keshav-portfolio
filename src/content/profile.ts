import type { Profile, Role } from "./types";

export const profile: Profile = {
  name: "Keshav Singh",
  role: "AI Engineer",
  location: "New Delhi, India",
  email: "k4keshav.s4singh@gmail.com",
  github: "https://github.com/k4keshav-singh",
  linkedin: "https://www.linkedin.com/in/keshav-singh-ab83a930a/",
  headline: "I build AI systems with reasoning you can inspect.",
  summary:
    "Early-career AI engineer, interning at FutureVerse AI. I work on multi-agent pipelines that explain their reasoning, AI coding tools with a human in the loop, and the full-stack product features around them.",
};

/** Principles shown in the intro. `display` is the stacked serif phrasing; each points at the project that shows it. */
export const principles = [
  {
    rule: "Deterministic before generative",
    display: ["Deterministic", "before", "generative"],
    proof: "Clear rules handle what they can. A language model only helps where the rules can't decide, and anything still unclear goes to a person.",
    href: "/work/decision-intelligence",
  },
  {
    rule: "Humans approve the consequential steps",
    display: ["Humans", "approve what", "matters"],
    proof: "An AI coding agent should pause for a person before its plan, code, tests or fixes go forward.",
    href: "/work/code-agent",
  },
  {
    rule: "Fail into a queue, not into silence",
    display: ["Fail", "into a", "queue"],
    proof: "A message that fails is retried, then kept aside for review, never silently dropped.",
    href: "/work/decision-intelligence",
  },
  {
    rule: "Enforce limits on the server",
    display: ["Limits", "on the", "server"],
    proof: "Test timers, sessions and answers are checked on the server, not trusted from the browser.",
    href: "/work/learning-platform",
  },
] as const;

export const experience: Role[] = [
  {
    title: "AI Engineer & Full-Stack Engineer (Intern)",
    org: "FutureVerse AI · New Delhi",
    period: "May 2026 – Present",
    current: true,
    summary:
      "Data connectors and a message-routing service for an internal AI platform, plus the design of its explainable recommendation layer; the sandbox, audit trail and evaluation harness of a co-built AI coding agent; student-facing features in a learning platform's web app; and account, plans and offer screens in a Flutter exam-prep app — all shipped through mentor-reviewed pull requests. Details are limited by confidentiality.",
  },
  {
    title: "Project Coordination Intern",
    org: "Dofin Tech",
    period: "Oct 2025 – Dec 2025",
    summary:
      "Worked with cross-functional teams on requirements, wrote and ran test cases, and tracked deliverables.",
  },
  {
    title: "Web Development Intern",
    org: "Tech Access Learning Pvt. Ltd.",
    period: "Jan 2023 – Apr 2023",
    summary: "System and database testing, and SQL query optimisation.",
  },
];

export const education = [
  {
    title: "B.Tech, Artificial Intelligence & Machine Learning",
    org: "Guru Tegh Bahadur Institute of Technology, New Delhi",
    period: "2023 – 2026",
    note: "82.2% (as reported on my resume)",
  },
  {
    title: "Diploma, IT-Enabled Services & Management",
    org: "Rajokari Institute of Technology, New Delhi",
    period: "2020 – 2023",
  },
];

export const certifications = [
  "Machine Learning — IIT Madras Pravartak",
  "Machine Learning — National Skill Development Corporation (NSDC)",
  "Oracle Cloud Infrastructure 2025 — AI Foundations Associate",
];

/** Skills grouped by where they actually show up. */
export const skills = [
  {
    group: "AI applications",
    items: ["Multi-agent workflows", "LangGraph", "Anthropic SDK", "OpenAI SDK", "Schema-validated LLM output", "Human-in-the-loop gates"],
    where: "Internship AI projects",
  },
  {
    group: "Backend & data",
    items: ["Python", "FastAPI", "Pydantic", "Redis Streams", "MongoDB", "SQLite", "OAuth", "Webhooks & REST"],
    where: "Internship AI projects",
  },
  {
    group: "Frontend",
    items: ["TypeScript", "Next.js App Router", "React", "TanStack Query", "react-hook-form + zod", "Flutter / BLoC"],
    where: "Learning platform web app, exam-prep Flutter app",
  },
  {
    group: "Reliability & delivery",
    items: ["pytest", "Hypothesis", "Vitest + Testing Library + MSW", "Docker", "GitHub Actions", "Ruff", "Git & PR review"],
    where: "Every project above",
  },
  {
    group: "ML foundations",
    items: ["scikit-learn", "pandas", "NumPy", "TensorFlow / Keras", "YOLOv8 (Ultralytics)"],
    where: "Earlier notebooks in the archive",
  },
] as const;
