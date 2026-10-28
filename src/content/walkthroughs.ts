/**
 * Data for the "Inside an AI workflow" walkthrough.
 *
 * These are GENERIC, SIMULATED examples with made-up data. They illustrate
 * well-known engineering patterns (human approval steps, sandboxed test runs,
 * "numbers → rules → words" recommendations). They are not traces, rules,
 * thresholds, prompts or configuration from any company system.
 */

export type Tone = "neutral" | "pass" | "human" | "fail" | "stop";

export type WalkStep = {
  node: string;
  title: string;
  body: string;
  /** Synthetic state shown in the trace panel. */
  state?: string;
  tone: Tone;
};

export type Scenario = {
  id: string;
  label: string;
  summary: string;
  steps: WalkStep[];
};

export type WalkNode = { id: string; label: string };

export type Walkthrough = {
  id: string;
  system: string;
  title: string;
  basis: string;
  nodes: WalkNode[];
  scenarios: Scenario[];
};

/* ------------------------------------------------------------------ */
/* Pattern 1: human-in-the-loop code generation                        */
/* ------------------------------------------------------------------ */

const codeNodes: WalkNode[] = [
  { id: "plan", label: "Plan" },
  { id: "spec", label: "Approve spec" },
  { id: "write", label: "Code ∥ Tests" },
  { id: "review-code", label: "Review code" },
  { id: "review-tests", label: "Review tests" },
  { id: "ready", label: "Both approved?" },
  { id: "sandbox", label: "Sandbox run" },
  { id: "check", label: "Check result" },
  { id: "diagnose", label: "Diagnose" },
  { id: "fix-plan", label: "Approve fix plan" },
  { id: "fix", label: "Fix" },
  { id: "accept", label: "Final acceptance" },
];

const task = `task: "Add slugify(title): lowercase, trim, join words with '-'" (example)`;

const plan: WalkStep = {
  node: "plan",
  title: "The task becomes a written specification",
  body: "The agent can ask questions first. This task is clear, so it drafts a short spec with acceptance criteria straight away.",
  state: `${task}\ncriteria:\n  C1 lowercases input\n  C2 trims outer whitespace\n  C3 joins words with "-"`,
  tone: "neutral",
};

const approvedSpec: WalkStep = {
  node: "spec",
  title: "A person approves the spec",
  body: "Once approved, the spec is locked. Everything after this point is built from this exact version.",
  state: `decision: APPROVE (human)\nspec: locked`,
  tone: "human",
};

const write: WalkStep = {
  node: "write",
  title: "Code and tests are written separately",
  body: "Both are written from the approved spec, without seeing each other. That way the tests check the requirement rather than repeat what the code happens to do.",
  state: `code  → slug.py\ntests → test_slug.py (6 tests)\nindependent: yes`,
  tone: "neutral",
};

const reviewCode: WalkStep = {
  node: "review-code",
  title: "A person reviews the code",
  body: "The reviewer can approve, edit, reject or stop. Rejected work goes back to the step that produced it, not to the start.",
  state: `decision: APPROVE (human)`,
  tone: "human",
};

const reviewTests: WalkStep = {
  node: "review-tests",
  title: "A person reviews the tests",
  body: "Each acceptance criterion should be covered by at least one test.",
  state: `C1 → 2 tests   C2 → 2 tests   C3 → 2 tests\ndecision: APPROVE (human)`,
  tone: "human",
};

const ready: WalkStep = {
  node: "ready",
  title: "Nothing runs until both are approved",
  body: "Code and tests must both be approved before anything executes.",
  state: `code: approved   tests: approved → run`,
  tone: "pass",
};

const sandbox = `isolated sandbox: no network · read-only files\n  CPU, memory and time limits · non-admin user`;

export const coderWalkthrough: Walkthrough = {
  id: "code-agent",
  system: "AI coding with approvals",
  title: "A human-in-the-loop coding run",
  basis: "A generic example of the pattern. The task, code and results are made up, and the steps are simplified.",
  nodes: codeNodes,
  scenarios: [
    {
      id: "approved",
      label: "Everything approved",
      summary: "The happy path, which still has four human approvals.",
      steps: [
        plan,
        approvedSpec,
        write,
        reviewCode,
        reviewTests,
        ready,
        { node: "sandbox", title: "Tests run in the sandbox", body: "Generated code is untrusted, so it only runs in isolation.", state: `${sandbox}\nresult: 6 passed, 0 failed`, tone: "pass" },
        { node: "check", title: "The result is checked", body: "Every criterion has a test and nothing failed, so the run goes to final acceptance.", state: `coverage: complete   failures: 0`, tone: "pass" },
        { node: "accept", title: "A person accepts the result", body: "Only accept or stop are offered here.", state: `decision: ACCEPT (human)\noutcome: success`, tone: "human" },
      ],
    },
    {
      id: "withheld",
      label: "Approval withheld",
      summary: "The reviewer rejects the spec. It goes back for revision before any code is written.",
      steps: [
        plan,
        {
          node: "spec",
          title: "The reviewer rejects the spec",
          body: "The criteria say nothing about empty input. The spec goes back with the reason attached. No code exists yet, so nothing is wasted.",
          state: `decision: REJECT (human)\nreason: "No criterion for empty string"\nroute: → plan`,
          tone: "fail",
        },
        {
          node: "plan",
          title: "The spec is revised",
          body: "The missing criterion is added. The earlier version stays in the decision log.",
          state: `criteria:\n  C1 lowercases input\n  C2 trims outer whitespace\n  C3 joins words with "-"\n  C4 empty string → ""   (added)`,
          tone: "neutral",
        },
        { ...approvedSpec, body: "The revised spec is approved and locked. The run then continues as on the happy path." },
      ],
    },
    {
      id: "repair",
      label: "A test fails",
      summary: "The failure is diagnosed, a person approves the fix plan, and the fix goes back through code review.",
      steps: [
        plan,
        approvedSpec,
        write,
        reviewCode,
        reviewTests,
        ready,
        { node: "sandbox", title: "One test fails", body: "With repeated spaces, the code produces a double hyphen.", state: `${sandbox}\nresult: 5 passed, 1 failed\nFAILED test_collapses_repeated_spaces`, tone: "fail" },
        { node: "check", title: "The result is checked", body: "There is a new failure and the run is within its limits, so it continues to diagnosis.", state: `new failure → diagnose`, tone: "neutral" },
        { node: "diagnose", title: "The failure is diagnosed first", body: "Is it a bug in the code, a wrong test, a gap in the spec or an environment problem? Each takes a different route.", state: `diagnosis: bug in the code → fix plan`, tone: "neutral" },
        { node: "fix-plan", title: "A person approves the fix plan", body: "The plan is approved before any code changes.", state: `plan: "split on runs of whitespace, not single spaces"\ndecision: APPROVE (human)`, tone: "human" },
        { node: "fix", title: "The fix is applied", body: "Changes are only allowed in the agreed area of the code.", state: `patched: slug.py`, tone: "neutral" },
        { node: "review-code", title: "The fix goes back through code review", body: "A fix is still code, so it is reviewed like any other change.", state: `decision: APPROVE (human)`, tone: "human" },
        { node: "sandbox", title: "The same tests run again", body: "The locked tests run against the fixed code.", state: `result: 6 passed, 0 failed`, tone: "pass" },
        { node: "accept", title: "Accepted", body: "Two attempts, with a person signing off at every important step.", state: `decision: ACCEPT (human)\noutcome: success (attempt 2)`, tone: "human" },
      ],
    },
    {
      id: "no-progress",
      label: "No progress",
      summary: "The same test fails twice in a row, so the run stops instead of looping.",
      steps: [
        plan,
        approvedSpec,
        write,
        reviewCode,
        reviewTests,
        ready,
        { node: "sandbox", title: "A test fails", body: "One test fails on the first run.", state: `result: 5 passed, 1 failed`, tone: "fail" },
        { node: "diagnose", title: "Diagnose, approve and fix", body: "The repair loop runs as in the previous scenario.", state: `bug in the code → fix plan approved → fixed → reviewed`, tone: "neutral" },
        { node: "sandbox", title: "The same test fails again", body: "The fix didn't solve the problem.", state: `result: 5 passed, 1 failed (same test)`, tone: "fail" },
        { node: "check", title: "The run stops with a clear reason", body: "The same failure twice means the loop isn't getting anywhere. Stopping with a named reason is cheaper than retrying forever.", state: `outcome: stopped, no progress\nother stop reasons: out of budget, environment failure, a person stopped it`, tone: "stop" },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Pattern 2: explainable recommendations                              */
/* ------------------------------------------------------------------ */

const recNodes: WalkNode[] = [
  { id: "inputs", label: "Inputs" },
  { id: "numbers", label: "Measured numbers" },
  { id: "compare", label: "Compare to limits" },
  { id: "rules", label: "Decision rules" },
  { id: "words", label: "Model explains" },
  { id: "views", label: "Compare views" },
  { id: "summary", label: "Summary" },
  { id: "person", label: "Person decides" },
];

const question = `question: "Should a small bakery accept one very large wholesale order?" (fictional)`;

export const recommendationWalkthrough: Walkthrough = {
  id: "explainable-recommendations",
  system: "Explainable recommendations",
  title: "Numbers → rules → words",
  basis:
    "A generic example of a common pattern, using a fictional business and made-up numbers and limits. It is not the rules, thresholds or data of any company system.",
  nodes: recNodes,
  scenarios: [
    {
      id: "conflict",
      label: "Analyses disagree",
      summary: "One view says caution, another says go. The summary shows both instead of averaging them away.",
      steps: [
        {
          node: "inputs",
          title: "Several analyses look at the question",
          body: "Each analysis covers one area, such as finances, risk or capacity. Each must point to the data it used.",
          state: `${question}\nfinance   cash buffer is healthy\nrisk      one customer would be 40% of sales\ncapacity  ovens are near their limit`,
          tone: "neutral",
        },
        {
          node: "numbers",
          title: "Code calculates the numbers",
          body: "Figures come from the data, calculated by ordinary code. The language model never produces a number.",
          state: `share of sales from one customer = 0.40\nlimit agreed with the owner = 0.30 (made up)`,
          tone: "neutral",
        },
        {
          node: "compare",
          title: "The number is compared with the agreed limit",
          body: "0.40 is above 0.30, so the risk check is triggered.",
          state: `0.40 > 0.30 → above limit`,
          tone: "fail",
        },
        {
          node: "rules",
          title: "Written rules decide what that means",
          body: "A simple, readable table turns the result into a position before any model is called.",
          state: `well above limit → advise caution\nnear limit       → flag only\nwell within      → support\ndata too weak    → ask for better data`,
          tone: "neutral",
        },
        {
          node: "words",
          title: "Only then does the model write",
          body: "The model gets the fixed position and the evidence, and explains it in plain words. It can't change the position or add numbers.",
          state: `risk: advise caution → "One customer would be 40% of sales, above the agreed 30%."`,
          tone: "neutral",
        },
        {
          node: "views",
          title: "The views are compared",
          body: "The growth view supports the order and the risk view advises caution. That disagreement is kept, not resolved by majority vote.",
          state: `growth: support   risk: advise caution\n→ disagreement recorded`,
          tone: "stop",
        },
        {
          node: "summary",
          title: "A fixed template builds the summary",
          body: "The most serious concern comes first, and the disagreement is shown side by side.",
          state: `1 Serious concern: customer concentration\n2 Disagreement: growth vs risk\n3 Open questions`,
          tone: "neutral",
        },
        {
          node: "person",
          title: "A person makes the call",
          body: "The system lays out the trade-offs. It never decides.",
          state: `decision: owner`,
          tone: "human",
        },
      ],
    },
    {
      id: "low-confidence",
      label: "Low confidence",
      summary: "The evidence is only a guess, so the system asks for better data instead of taking a side.",
      steps: [
        {
          node: "inputs",
          title: "A weakly supported input arrives",
          body: "The capacity view thinks staff may be overloaded, but it is based on a guess rather than a measurement.",
          state: `${question}\ncapacity  staff may be overloaded   confidence: low`,
          tone: "neutral",
        },
        {
          node: "compare",
          title: "Each check needs a minimum confidence",
          body: "This check needs measured data. A guess is below that bar.",
          state: `needed: measured   have: guess → not enough`,
          tone: "fail",
        },
        {
          node: "rules",
          title: "The rule is: ask for better data",
          body: "A guess is not treated as a fact, so the position is a request for evidence.",
          state: `data too weak → ask for better data`,
          tone: "neutral",
        },
        {
          node: "summary",
          title: "The summary lists it as an open question",
          body: "The person sees what is missing before relying on it.",
          state: `Open questions ← staff workload not measured`,
          tone: "neutral",
        },
      ],
    },
    {
      id: "unclear",
      label: "Can't be classified",
      summary: "Earlier in the pipeline: a message no rule matches is set aside for a person, not guessed.",
      steps: [
        {
          node: "inputs",
          title: "A new message arrives",
          body: "This happens in the routing step, before any analysis. The message is new, and likely spam is only marked, never deleted.",
          state: `message: email from an unknown sender (made up)\nduplicate: no   spam: no`,
          tone: "neutral",
        },
        {
          node: "rules",
          title: "Rules are tried in order",
          body: "Clear rules first, then fuzzier matching. Here nothing matches with enough confidence.",
          state: `exact rules       ✗\nfuzzy matching    ✗ (not confident)\nmodel fallback    only if enabled`,
          tone: "fail",
        },
        {
          node: "person",
          title: "Set aside for a person",
          body: "The message waits for a human instead of being forced into a category. If processing keeps failing, it is retried and then kept in a separate queue for review.",
          state: `status: needs a person\non failure: retry → review queue`,
          tone: "stop",
        },
      ],
    },
  ],
};

export const walkthroughs = [coderWalkthrough, recommendationWalkthrough];
