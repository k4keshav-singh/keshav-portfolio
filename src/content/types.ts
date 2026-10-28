/**
 * Content model for the portfolio.
 *
 * Internship work is described at a public-safe level (see projects.ts and
 * private/publication-checklist.md). The private audit holds file-level notes;
 * nothing here references local paths, private sources or internal names.
 */

export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  role: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  headline: string;
  summary: string;
};

export type Decision = {
  title: string;
  /** What was chosen and why, in plain words. */
  why: string;
  /** What it cost or what it doesn't solve. */
  tradeoff: string;
};

export type FlowStage = {
  label: string;
  detail: string;
  /** Marks stages that exist in design docs but not yet in the inspected code. */
  status?: "built" | "documented" | "not-built";
};

export type CaseStudy = {
  problem: string;
  users: string;
  context: string;
  role: { mine: string[]; others: string };
  architecture: { intro: string; stages: FlowStage[]; note?: string };
  decisions: Decision[];
  failureHandling: string[];
  testing: string[];
  outcomes: string[];
  limitations: string[];
  /** What is deliberately left out, and why (internship confidentiality). */
  confidentiality: string[];
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  oneLiner: string;
  period: string;
  context: string; // e.g. "Internship · team project"
  status: string;
  contribution: string;
  keyDecision: string;
  stack: string[];
  /** Short arrow-chain shown on the home page. */
  flow: string[];
  sourceUrl?: string;
  demoUrl?: string;
  image?: { src: string; alt: string };
  caseStudy: CaseStudy;
};

export type ArchiveCategory = "AI & ML" | "Web" | "Tooling";

export type ArchiveItem = {
  name: string;
  year: string;
  category: ArchiveCategory;
  description: string;
  stack: string[];
  link?: Link;
  note?: string;
  /** Hidden items stay in the data (and private audit) but are not rendered. */
  visible: boolean;
};

export type ToolEntry = {
  name: string;
  purpose: string;
  contribution: "Documented" | "Documented · integrated";
  detail?: string;
};

export type Role = {
  title: string;
  org: string;
  period: string;
  summary: string;
  current?: boolean;
};
