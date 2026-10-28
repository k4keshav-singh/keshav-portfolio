/**
 * Recruiter-mode highlights. Short and scannable, written to the same
 * public-safe standard as projects.ts: no internal names, figures or design
 * specifics. Keep in step with projects.ts.
 */
export const recruiterHighlights = [
  {
    slug: "decision-intelligence",
    project: "Decision Intelligence",
    context: "FutureVerse AI · internal platform · team project · May–Aug 2026",
    points: [
      "Built data connectors for several everyday business tools and the service that classifies, deduplicates and routes their messages.",
      "Rules first, a language model only as a fallback, and uncertain cases sent to a person.",
      "Retries and a dead-letter queue, so failed messages are kept for review, not lost.",
    ],
    stack: "Python · FastAPI · Redis Streams · MongoDB · LLM APIs · pytest",
  },
  {
    slug: "code-agent",
    project: "Code Agent",
    context: "FutureVerse AI · research prototype · co-built by two interns · Aug–Sep 2026",
    points: [
      "Built an isolated sandbox for running AI-generated code: no network, read-only files, strict resource and time limits.",
      "Kept a separate audit trail so automated approvals can never pass as human ones.",
      "Built the evaluation harness and the reviewer dashboard; code and tests are written independently from one approved spec.",
    ],
    stack: "Python · LangGraph · Docker · SQLite · pytest · Ruff",
  },
  {
    slug: "learning-platform",
    project: "Learning Platform",
    context: "FutureVerse AI · team product · Sep–Oct 2026",
    points: [
      "One of the main contributors to the student web app, with every change through mentor-reviewed pull requests.",
      "Built the learning path, results with PDF reports, account settings and two admin screens.",
      "Made test-taking reliable: server-enforced time limits, one session per test, and safe answer saving.",
    ],
    stack: "TypeScript · Next.js · React · TanStack Query · zod · Vitest",
  },
  {
    slug: "exam-prep-app",
    project: "Exam-Prep App",
    context: "FutureVerse AI · Flutter team product · Oct 2026",
    points: [
      "Built the account and settings area and the plans and add-ons flow, in phone and web layouts, English and Hindi.",
      "Offer prompts that open over the current page, ask once and can be switched off; choices stored on the device.",
      "Clean Architecture with BLoC, typed routes and typed failures; tested and merged through reviewed PRs.",
    ],
    stack: "Flutter · Dart · BLoC · auto_route · get_it · freezed · bloc_test",
  },
];
