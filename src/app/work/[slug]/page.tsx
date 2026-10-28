import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@/components/icons";
import { ChipList, Container } from "@/components/ui";
import { getProject, projects } from "@/content/projects";
import type { FlowStage } from "@/content/types";

// Only the slugs below exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — case study`,
    description: project.oneLiner,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: `${project.title} — case study`, description: project.oneLiner, url: `/work/${project.slug}`, type: "article" },
  };
}

const stageStatus: Record<NonNullable<FlowStage["status"]>, string> = {
  built: "Built",
  documented: "Design doc",
  "not-built": "Not built yet",
};

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cs = project.caseStudy;
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <header className="border-b border-line">
        <Container className="pt-32 pb-16 sm:pt-40 sm:pb-20">
          <nav aria-label="Breadcrumb" className="font-mono text-sm text-faint">
            <ol className="flex gap-2">
              <li>
                <Link href="/#work" className="hover:text-text">
                  Work
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-muted">
                {project.title}
              </li>
            </ol>
          </nav>
          <p className="mt-6 font-mono text-sm text-muted uppercase">{project.kicker}</p>
          <h1 className="font-display mt-3 text-[clamp(2.75rem,12.5vw,4.5rem)] sm:text-9xl">{project.title}</h1>
          <p className="prose-measure mt-5 text-lg text-muted">{project.oneLiner}</p>

          <dl className="mt-10 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Meta term="Context" value={project.context} />
            <Meta term="Period" value={project.period} />
            <Meta term="Status" value={project.status} />
            <div>
              <dt className="text-faint">Stack</dt>
              <dd className="mt-2">
                <ChipList items={project.stack} label="Stack" />
              </dd>
            </div>
          </dl>
        </Container>
      </header>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Short read */}
          <aside aria-labelledby="summary-title" className="lg:col-span-4">
            <div className="rounded-3xl border border-line bg-surface p-6 lg:sticky lg:top-28">
              <h2 id="summary-title" className="font-mono text-xs text-faint">
                The short version
              </h2>
              <dl className="mt-4 space-y-4 text-[0.95rem]">
                <div>
                  <dt className="text-faint">My part</dt>
                  <dd className="mt-1 text-muted">{project.contribution}</dd>
                </div>
                <div>
                  <dt className="text-faint">Key decision</dt>
                  <dd className="mt-1 text-muted">{project.keyDecision}</dd>
                </div>
              </dl>
              <nav aria-label="On this page" className="mt-6 border-t border-line pt-4">
                <ul className="space-y-1.5 text-sm">
                  {[
                    ["problem", "Problem"],
                    ["role", "My role"],
                    ["architecture", "Architecture"],
                    ["decisions", "Decisions"],
                    ["failure", "Failure handling"],
                    ["testing", "Testing"],
                    ["outcomes", "Outcomes & limits"],
                    ["confidentiality", "What I can't share"],
                  ].map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`} className="text-muted hover:text-text">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Long read */}
          <div className="space-y-16 lg:col-span-8">
            <Block id="problem" title="Problem and users">
              <p>{cs.problem}</p>
              <p>{cs.users}</p>
              <p className="text-faint">{cs.context}</p>
            </Block>

            <Block id="role" title="My role">
              <ul className="list-disc space-y-2 pl-5 marker:text-faint">
                {cs.role.mine.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <p className="rounded-2xl border border-line bg-surface p-4 text-[0.95rem]">
                <span className="font-medium text-text">Not mine: </span>
                {cs.role.others}
              </p>
            </Block>

            <Block id="architecture" title="Architecture">
              <p>{cs.architecture.intro}</p>
              <ol className="mt-2 space-y-0">
                {cs.architecture.stages.map((s, i) => (
                  <li key={s.label} className="relative grid grid-cols-[1.75rem_1fr] gap-3 pb-5 last:pb-0">
                    <span aria-hidden="true" className="relative flex justify-center">
                      <span className={`mt-1.5 h-3 w-3 rounded-full border ${s.status === "built" ? "border-accent bg-accent" : s.status === "documented" ? "border-amber" : "border-line-strong"}`} />
                      {i < cs.architecture.stages.length - 1 ? <span className="absolute top-5 bottom-0 w-px bg-line" /> : null}
                    </span>
                    <div>
                      <p className="flex flex-wrap items-center gap-2 font-medium text-text">
                        {s.label}
                        {s.status ? <span className="rounded border border-line px-1.5 font-mono text-[0.7rem] font-normal text-faint">{stageStatus[s.status]}</span> : null}
                      </p>
                      <p className="mt-0.5 text-[0.96rem]">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {cs.architecture.note ? <p className="text-sm text-faint">{cs.architecture.note}</p> : null}
            </Block>

            <Block id="decisions" title="Decisions and tradeoffs">
              <ol className="space-y-6">
                {cs.decisions.map((d, i) => (
                  <li key={d.title} className="rounded-3xl border border-line bg-surface/60 p-6">
                    <h3 className="font-display flex items-baseline gap-3 text-2xl text-text">
                      <span aria-hidden="true" className="font-mono text-xs text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {d.title}
                    </h3>
                    <p className="mt-3">{d.why}</p>
                    <p className="mt-3 border-t border-line pt-3 text-[0.95rem]">
                      <span className="font-medium text-text">Tradeoff: </span>
                      {d.tradeoff}
                    </p>
                  </li>
                ))}
              </ol>
            </Block>

            <Block id="failure" title="Failure handling">
              <List items={cs.failureHandling} />
            </Block>

            <Block id="testing" title="Testing and evaluation">
              <List items={cs.testing} />
            </Block>

            <Block id="outcomes" title="Outcomes and limitations">
              <h3 className="font-medium text-text">What exists</h3>
              <List items={cs.outcomes} />
              <h3 className="pt-2 font-medium text-text">What doesn&apos;t, yet</h3>
              <List items={cs.limitations} />
            </Block>

            <Block id="confidentiality" title="What I can't share">
              <List items={cs.confidentiality} />
            </Block>
          </div>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/#engineering" className="text-link text-sm">
            Step through a generic example
          </Link>
          <Link href={`/work/${next.slug}`} className="pill pill-solid">
            Next: {next.title} <ArrowRight />
          </Link>
        </Container>
      </div>
    </article>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-faint">{term}</dt>
      <dd className="mt-1 text-text">{value}</dd>
    </div>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-4xl text-text">
        {title}
      </h2>
      <div className="prose-measure mt-4 space-y-4 text-muted">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-faint">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}
