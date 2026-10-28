import type { CaseStudy, Project } from "./types";

/**
 * Featured internship work, written to a conservative "public-safe" standard
 * because the systems are confidential company work:
 *
 * - generic descriptive titles instead of internal product / code names
 * - patterns and responsibilities, not internal architecture, rules, prompts,
 *   configuration values, file or service names
 * - no repository statistics, ticket IDs, team members' names, metrics,
 *   users, data or screenshots
 * - illustrations are generic and labelled as such
 *
 * Before restoring any internal name or detail, get written permission from
 * the company (see private/publication-checklist.md).
 */

const standardConfidentiality = [
  "This is internship work for FutureVerse AI and the system is confidential. Its internal name, code, data, prompts, configuration, metrics and detailed design are not shared here.",
  "What you see is a general description of my role and of widely used engineering patterns. It is not a specification of the company's system, and the illustrations are generic.",
  "I'm happy to talk through my approach in more depth in an interview, within what my agreement allows.",
];

const decisionIntelligence: CaseStudy = {
  problem:
    "Leaders receive signals all day from email, project trackers and business systems. Nobody can read all of it, and an AI summary that can't explain how it reached a conclusion is hard to trust.",
  users: "Internal leadership at the company. It is not a public product.",
  context:
    "Built by a small intern team under a senior-led architecture. I worked on getting data in reliably and on how recommendations should be made explainable.",
  role: {
    mine: [
      "Connectors that collect events from several everyday business tools through their official APIs and webhooks, and convert them into one common message format",
      "A routing service that classifies each message, removes duplicates, assigns a priority and passes it to the right place",
      "Retry and dead-letter handling, so a message that fails is kept for review instead of being lost",
      "Fixes for integration problems found while connecting other teammates' components",
      "The design of an explainable recommendation layer that sits on top",
    ],
    others: "Teammates owned other connectors, the shared storage and the infrastructure. The overall architecture was set by senior staff.",
  },
  architecture: {
    intro: "A simplified, generic view in two halves: first collect and route signals, then analyse them into recommendations a person can check.",
    stages: [
      { label: "Business tools", detail: "Email, project tracking and business software, read through their official integrations.", status: "built" },
      { label: "Connectors", detail: "Turn each tool's events into one common message format.", status: "built" },
      { label: "Router", detail: "Remove duplicates, classify, prioritise and pass each message on.", status: "built" },
      { label: "Shared store", detail: "Keeps routed messages with a record of where they came from.", status: "built" },
      { label: "Analysis and recommendations", detail: "Turns measured numbers into explainable recommendations for a person to review.", status: "documented" },
    ],
    note: "Stages marked 'Design doc' were designed by me and documented; they are described here only at the level of the general pattern.",
  },
  decisions: [
    {
      title: "Rules first, language model second",
      why: "Most messages can be classified by clear, deterministic rules, which are cheap, repeatable and easy to audit. A language model is only a fallback for what the rules can't decide, and anything still uncertain is set aside for a person instead of being guessed.",
      tradeoff: "Rules miss things a model might catch, so coverage has to be watched and the rules improved over time.",
    },
    {
      title: "Never silently lose a message",
      why: "Messages move through a queue that is delivered at least once. Failures are retried, then moved to a dead-letter queue for review, and duplicates are filtered out.",
      tradeoff: "At-least-once delivery means duplicate handling must be correct. A wrong duplicate key can hide real events, so it needs tests.",
    },
    {
      title: "Numbers, then rules, then words",
      why: "For recommendations, code computes the numbers, explicit rules decide what they mean, and only then does a language model write the explanation. The model never invents a figure or picks the conclusion, so the same input gives the same answer.",
      tradeoff: "Rules only capture judgement someone has written down, and the thresholds need to be agreed with the people who use them.",
    },
  ],
  failureHandling: [
    "Missing or out-of-date data is reported as missing, not guessed.",
    "Low-confidence inputs lead to a request for better data rather than a firm recommendation.",
    "When analyses disagree, both views are shown side by side for a person to decide, instead of being averaged away.",
    "Likely spam is set aside, never deleted.",
  ],
  testing: [
    "Unit and property-based tests (pytest, Hypothesis) with in-memory stand-ins for the queue and the database.",
    "I wrote the tests for the components I built, and they ran in the team's continuous-integration pipeline.",
  ],
  outcomes: [
    "My connectors and the routing service were built and integrated into the team's internal system.",
    "The recommendation layer has a written design that the team can build on.",
  ],
  limitations: ["The platform is still in development and has no public release.", "I don't publish usage figures or results, because they belong to the company."],
  confidentiality: standardConfidentiality,
};

const codeAgent: CaseStudy = {
  problem:
    "AI coding agents can be fast but hard to trust: they may write tests that only confirm their own code, run untrusted code on the host machine, and leave no record of who approved what.",
  users: "Engineers reviewing AI-generated changes. Built as an internal research prototype.",
  context:
    "Co-built by two interns. We designed separately, compared plans, merged them and split the build.",
  role: {
    mine: [
      "An isolated sandbox for running generated code: no network access, a read-only filesystem, CPU, memory and time limits, and a non-administrator user",
      "A permanent audit trail of human decisions, kept separate from the agent's working state, so automated approvals can never pass as human ones",
      "An evaluation harness with a fixed set of practice tasks and quality measures, including tasks designed to fail",
      "Automatic checks for code style and for changes outside the allowed area",
      "A change so code and tests are written independently and in parallel from one approved specification",
      "The reviewer dashboard used to approve or reject each step",
    ],
    others: "My co-builder owned the agent roles, prompts, model integration and the failure-repair loop.",
  },
  architecture: {
    intro: "A generic view of the workflow. The agent pauses for a person at each important step, and its state survives a restart.",
    stages: [
      { label: "Plan", detail: "The task becomes a written specification with acceptance criteria. A person approves it.", status: "built" },
      { label: "Code and tests, in parallel", detail: "Both are written from the approved specification, without seeing each other.", status: "built" },
      { label: "Human review", detail: "A person reviews the code and the tests, and can approve, edit or reject each.", status: "built" },
      { label: "Sandbox run", detail: "Tests run inside the isolated sandbox.", status: "built" },
      { label: "Diagnose and repair", detail: "Failures are diagnosed first. A person approves the fix plan before code changes.", status: "built" },
    ],
  },
  decisions: [
    {
      title: "Independent code and tests from one approved spec",
      why: "If the test writer reads the code, the tests describe what the code does rather than what was asked for. Writing both independently from the same approved specification keeps the tests honest.",
      tradeoff: "Everything now depends on a clear specification, which is why it gets its own approval step.",
    },
    {
      title: "Isolation first",
      why: "Generated code is untrusted, so it runs with no network, a read-only filesystem and strict resource and time limits.",
      tradeoff: "Container isolation reduces risk but is not a complete security boundary, and we documented that limit.",
    },
    {
      title: "An audit trail you can believe",
      why: "Human decisions are stored separately from the agent's working state, and automated test-run approvals are tagged, so the decision log shows only what a person actually decided.",
      tradeoff: "Two stores to keep in step, handled with a migration script.",
    },
  ],
  failureHandling: [
    "Every run ends with a clear reason: success, a person stopped it, the environment failed, it ran out of budget, or it stopped making progress.",
    "Failures are classified before anyone tries to fix them, and each type takes a different path.",
    "A requirement with no test blocks the run until tests are added and approved.",
    "Rejected work goes back to whoever produced it, not to the start.",
  ],
  testing: [
    "Unit tests with pytest, including offline stand-ins for model calls.",
    "The evaluation harness tracks how many attempts a task needs, how often a person had to step in, and how many problems the automatic checks caught.",
  ],
  outcomes: ["A working prototype with an isolated sandbox, a reliable decision log, an evaluation harness and a reviewer dashboard."],
  limitations: ["A research prototype, not a production system.", "No performance results are published here; they belong to the company."],
  confidentiality: standardConfidentiality,
};

const learningPlatform: CaseStudy = {
  problem:
    "Students take practice and mock tests, then need honest results and a clear next step. A test page that trusts the browser with answers or timing can be gamed, and one that loses a save loses a student's work.",
  users: "Students using the platform's web app, and staff who configure it in an admin console.",
  context:
    "A team product with a mentor who reviews and merges every pull request. The platform, its backend services and its recommendation logic were built by others; my work is product features on top.",
  role: {
    mine: [
      "A learning-path screen that shows progress, what is unlocked and what to do next",
      "Results: attempt history, a per-attempt report with question review, and PDF download",
      "Account settings, including profile, notifications and password change",
      "Moving the test flows onto one shared test-taking component, then fixing reliability and integrity issues",
      "Two configuration screens in the admin console",
    ],
    others: "Teammates built the backend services, the recommendation logic, the design system and the continuous-integration setup.",
  },
  architecture: {
    intro: "The browser never talks to backend services directly. A thin server layer inside the web app checks the session and fetches data.",
    stages: [
      { label: "Student's browser", detail: "React screens; form input validated before sending.", status: "built" },
      { label: "Web app server layer", detail: "Checks who is signed in, enforces ownership, combines data.", status: "built" },
      { label: "Backend services", detail: "Owned by the wider team.", status: "built" },
      { label: "Results and reports", detail: "Attempt history and per-attempt reports, downloadable as PDF.", status: "built" },
    ],
  },
  decisions: [
    {
      title: "Answers stay on the server until submission",
      why: "The test page only receives what it needs to show the questions. Answers are checked on the server after submission, and one student can't open another student's results.",
      tradeoff: "More requests to the server and more server-side code to test.",
    },
    {
      title: "The server owns the clock and the session",
      why: "Time limits are enforced on the server, and each student gets one open session per test, so refreshing the page or opening a second tab can't buy extra time.",
      tradeoff: "Network trouble near the deadline needs careful handling, so time-up and failed-submit states have their own messages and a retry.",
    },
    {
      title: "One save at a time",
      why: "Saving answers one at a time per session prevents duplicate records and conflicts at submission, and the student is told if a background save fails.",
      tradeoff: "A little extra latency, which is worth it to never lose an answer.",
    },
  ],
  failureHandling: [
    "Clear messages for a failed submit, an expired session and time running out, with a retry where it is safe.",
    "Before building a screen, I checked that every field had a real data source, and showed nothing rather than invented values.",
    "Demo data used during development is switched off in production.",
  ],
  testing: [
    "Component and integration tests with Vitest, Testing Library and mocked network calls.",
    "Every change went through continuous integration and a mentor's code review before merging.",
  ],
  outcomes: ["The features above were merged into the product through reviewed pull requests.", "I was one of the main contributors to the student web app during my time on it."],
  limitations: ["The product is in development; I don't describe its users, data or deployment."],
  confidentiality: standardConfidentiality,
};

const examPrepApp: CaseStudy = {
  problem:
    "Students preparing for a long, competitive exam need one place for their plan, practice and progress, on their phone and on the web, in English or Hindi. Settings and paid options have to be clear and never pushy.",
  users: "Students preparing for a competitive exam. The app is pre-release and not public.",
  context:
    "A team product built in Flutter, with designs to follow screen by screen and a mentor reviewing every pull request. I owned a set of screens end to end, from data layer to UI.",
  role: {
    mine: [
      "The account area: profile, settings and the in-app study companion's preferences, in both phone and web layouts",
      "The plans and add-ons flow: plan overview, checkout, free-trial and usage-limit screens",
      "Offer prompts that open over the current page at the right moment, ask only once, and can be switched off",
      "A small on-device consent store that remembers whether the student was asked about optional suggestions",
      "Moving a shared soft-UI component kit and page frame into the core layer so every feature can reuse them",
    ],
    others: "Teammates built the other features (planning, practice, library, news, onboarding), the theme and the app shell.",
  },
  architecture: {
    intro: "Clean Architecture with a feature-first layout. Each layer only depends inward, so screens can be built on sample data and switched to real data later.",
    stages: [
      { label: "Presentation", detail: "Pages and widgets driven by BLoC state, with typed routes.", status: "built" },
      { label: "Domain", detail: "Entities, repository contracts and use cases in pure Dart.", status: "built" },
      { label: "Data", detail: "Models, data sources and repository implementations; errors become typed failures.", status: "built" },
      { label: "Local storage", detail: "Small preferences kept on the device, such as whether she was already asked.", status: "built" },
    ],
  },
  decisions: [
    {
      title: "Layers that keep the UI honest",
      why: "Data sources throw, repositories turn errors into typed failures, and blocs turn failures into states the screen can show. A screen never has to guess what went wrong.",
      tradeoff: "More files per feature, which pays off once real data replaces the sample data.",
    },
    {
      title: "Offers that ask once and step aside",
      why: "Optional offers open over the current page instead of replacing it, appear only when they are due, and the answer is remembered. Turning them off is always one setting away.",
      tradeoff: "Pages layered over others need careful back-button handling, so each flow has to be walked through end to end.",
    },
    {
      title: "One codebase, phone and web",
      why: "A shared page frame adapts the same screen to a phone layout or a wider web layout, with both languages fitting the space.",
      tradeoff: "Two layouts and two languages to check for every screen.",
    },
  ],
  failureHandling: [
    "If a saved choice can't be read or written, the app falls back safely and tells the student rather than crashing.",
    "Placeholder prices and limits are clearly labelled as samples until real data is connected.",
    "Loading and error states are designed screens, not blank boxes.",
  ],
  testing: [
    "Widget and bloc tests (flutter_test, bloc_test, mocktail) for the screens and logic I built, including checks that Hindi labels fit.",
    "Every change went through continuous integration and a mentor's code review before merging.",
  ],
  outcomes: ["The account, plans and offer screens were merged into the team's app through reviewed pull requests."],
  limitations: ["The app is pre-release; I don't describe its users, content, pricing or launch plans."],
  confidentiality: standardConfidentiality,
};

export const projects: Project[] = [
  {
    slug: "decision-intelligence",
    title: "Decision Intelligence",
    kicker: "Internal AI platform · FutureVerse AI",
    oneLiner:
      "An internal multi-agent system that collects signals from everyday business tools, routes them reliably, and turns measured data into recommendations a person can check.",
    period: "May – Aug 2026",
    context: "Internship · team project · confidential",
    status: "Internal, in development",
    contribution: "I built data connectors and the message-routing service, and designed how recommendations stay explainable.",
    keyDecision: "Deterministic rules first, a language model only where rules can't decide, so every step can be traced.",
    stack: ["Python", "FastAPI", "Redis Streams", "MongoDB", "LLM APIs", "Docker", "pytest"],
    flow: ["Business tools", "Connectors", "Router", "Shared store", "Analysis", "Recommendations"],
    caseStudy: decisionIntelligence,
  },
  {
    slug: "code-agent",
    title: "Code Agent",
    kicker: "Human-in-the-loop AI coding · co-built",
    oneLiner:
      "A prototype AI coding agent that plans, writes code and tests separately, runs them in an isolated sandbox and asks a person to approve each important step.",
    period: "Aug – Sep 2026",
    context: "Internship · co-built by two interns · confidential",
    status: "Internal research prototype",
    contribution: "I built the isolated sandbox, the audit trail of human decisions, the evaluation harness and the reviewer dashboard.",
    keyDecision: "Write code and tests independently from one approved spec, so the tests check the requirement, not the code.",
    stack: ["Python", "LangGraph", "Docker", "SQLite", "pytest", "Ruff", "FastAPI"],
    flow: ["Plan", "Approve", "Code ∥ Tests", "Review", "Sandbox", "Diagnose → fix"],
    caseStudy: codeAgent,
  },
  {
    slug: "learning-platform",
    title: "Learning Platform",
    kicker: "EdTech web app · FutureVerse AI",
    oneLiner:
      "Student-facing features for an adaptive learning platform: learning paths, test-taking, results with downloadable reports, and account settings.",
    period: "Sep – Oct 2026",
    context: "Internship · team product · confidential",
    status: "In development",
    contribution: "Main contributor to the student web app: learning path, results and reports, settings, and test-taking reliability, plus admin screens.",
    keyDecision: "Keep answers and time limits on the server, because the browser can't be trusted with them.",
    stack: ["TypeScript", "Next.js", "React", "TanStack Query", "zod", "Vitest", "Testing Library"],
    flow: ["Browser", "Server layer", "Backend services", "Results & PDF report"],
    caseStudy: learningPlatform,
  },
  {
    slug: "exam-prep-app",
    title: "Exam-Prep App",
    kicker: "Flutter mobile & web app · FutureVerse AI",
    oneLiner:
      "Account, plans and offer screens for a bilingual exam-preparation app, built with Clean Architecture in Flutter for phone and web.",
    period: "Oct 2026",
    context: "Internship · team product · confidential",
    status: "Pre-release",
    contribution: "Built the account and settings area, the plans and add-ons flow, and offer prompts that ask once and step aside.",
    keyDecision: "Strict layers (UI → use cases ← data) so screens built on sample data switch to real data without rewrites.",
    stack: ["Flutter", "Dart", "BLoC", "auto_route", "get_it", "freezed", "fpdart", "bloc_test"],
    flow: ["Screen", "Bloc", "Use case", "Repository", "Data source"],
    caseStudy: examPrepApp,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
