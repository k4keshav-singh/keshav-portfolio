import Link from "next/link";
import { CopyEmail } from "@/components/copy-email";
import { CtaBar } from "@/components/cta-bar";
import { ArrowRight, ArrowUpRight, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { illustrationFor } from "@/components/illustrations";
import { RecruiterHint } from "@/components/recruiter-hint";
import { DeckScroller } from "@/components/deck-scroller";
import { RecruiterSummary } from "@/components/recruiter-summary";
import { Container } from "@/components/ui";
import { WalkthroughExplorer } from "@/components/walkthrough";
import { sopCorrections, tooling, visibleArchive } from "@/content/archive";
import { capabilities, practices, toolStrip } from "@/content/home";
import { certifications, education, experience, principles, profile, skills } from "@/content/profile";
import { projects } from "@/content/projects";
import { coderWalkthrough, walkthroughs } from "@/content/walkthroughs";

export default function Home() {
  return (
    <>
      {/* Shown only in recruiter mode; the story-only sections below hide then. */}
      <RecruiterSummary />
      <Hero />
      <Work />
      <MoreWork />
      <Ship />
      <Engineering />
      <Numbers />
      <Experience />
      <Contact />
      <CtaBar />
    </>
  );
}

/* ------------------------------------------------------------------ */

/** Two-tone section headline: first half ink, `muted` half warm grey. */
function Headline({ id, ink, muted, size = "headline-lg", className = "" }: { id: string; ink: string; muted?: string; size?: string; className?: string }) {
  return (
    <h2 id={id} className={`font-display ${size} ${className}`}>
      {ink}
      {muted ? (
        <>
          <br />
          <em>{muted}</em>
        </>
      ) : null}
    </h2>
  );
}

function Hero() {
  const trace = coderWalkthrough.scenarios[0].steps;
  return (
    <section aria-labelledby="hero-title" className="story-only pt-28 sm:pt-36">
      <Container>
        <p className="text-center font-mono text-xs text-muted sm:text-sm">
          {profile.name} · {profile.role} (Intern) at FutureVerse AI · {profile.location}
        </p>
        <h1 id="hero-title" className="font-display mx-auto mt-6 max-w-[14ch] text-center text-[3.1rem] sm:text-7xl lg:text-[7.4rem]">
          AI systems
          <sup aria-hidden="true" className="ml-1 align-super text-[0.45em] text-accent-bright">
            ✳
          </sup>{" "}
          with reasoning <em>you can inspect.</em>
        </h1>
      </Container>

      {/* Tool strip: names as plain text, scrolling slowly. */}
      <div aria-hidden="true" className="marquee mt-14">
        <div className="marquee-track font-display text-2xl text-display-muted sm:text-3xl">
          {[...toolStrip, ...toolStrip].map((t, i) => (
            <span key={i} className="whitespace-nowrap">
              {t}
            </span>
          ))}
        </div>
      </div>

      <Container className="mt-14 flex flex-col items-center text-center">
        <p className="prose-measure text-lg text-text sm:text-xl">{profile.summary}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/#work" className="pill pill-solid">
            Explore my work
            <span aria-hidden="true" className="pill-dot">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <RecruiterHint />
        </div>
      </Container>

      {/* Big dark frame with a looping, simulated pipeline trace. */}
      <Container className="mt-16">
        <figure className="on-ink overflow-hidden rounded-[28px] bg-ink text-cream">
          <div className="flex items-center justify-between border-b border-ink-line px-5 py-3">
            <div aria-hidden="true" className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#f26a1b]" />
              <span className="h-3 w-3 rounded-full bg-[#e9b44c]" />
              <span className="h-3 w-3 rounded-full bg-[#7fd49a]" />
            </div>
            <p className="hidden font-mono text-xs text-cream-muted sm:block">example · human-in-the-loop run</p>
            <p className="font-mono text-xs text-[#e9b44c]">Generic · made-up data</p>
          </div>
          <ol className="grid gap-1.5 px-5 py-6 font-mono text-[0.78rem] sm:px-8 sm:text-sm">
            {trace.map((s, i) => (
              <li key={i} className="trace-line flex flex-wrap items-baseline gap-x-3" style={{ ["--i" as string]: i }}>
                <span className="w-6 text-cream-muted">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={
                    s.tone === "human" ? "text-[#e9b44c]" : s.tone === "pass" ? "text-[#7fd49a]" : s.tone === "fail" ? "text-[#f2917f]" : "text-cream-muted"
                  }
                >
                  [{s.tone === "human" ? "HUMAN" : s.tone === "pass" ? "PASS" : s.tone === "fail" ? "FAIL" : "STEP"}]
                </span>
                <span className="text-cream">{s.title}</span>
              </li>
            ))}
            <li aria-hidden="true" className="caret mt-1 h-4 w-2 bg-cream" />
          </ol>
          <figcaption className="border-t border-ink-line px-5 py-3 text-sm text-cream-muted sm:px-8">
            A generic AI coding run with four human approvals before anything is accepted.{" "}
            <Link href="/#engineering" className="text-cream underline decoration-accent-bright underline-offset-4">
              Step through it yourself
            </Link>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

/** Principle "note" cards that sit between the project tiles. */
const notes = [
  { tone: "bg-[#3b2fae] text-cream", principle: principles[0] },
  { tone: "bg-[#c8361f] text-cream", principle: principles[3] },
];

function WorkTile({ slug, minH }: { slug: string; minH: string }) {
  const p = projects.find((x) => x.slug === slug)!;
  const Illustration = illustrationFor[p.slug];
  return (
    <Link href={`/work/${p.slug}`} className={`work-tile on-ink group h-full ${minH}`}>
      <div className="work-art absolute inset-0 flex items-center justify-center px-6 pt-24 pb-28">{Illustration ? <Illustration /> : null}</div>
      <span className="work-hover-title font-display text-5xl text-cream uppercase sm:text-6xl" aria-hidden="true">
        {p.title}
      </span>
      <span className="tag absolute top-4 left-4">
        <span className="font-display text-xl">{p.title}</span>
        <span className="font-mono text-[0.6rem] leading-tight text-cream-muted uppercase">
          {p.period}
          <br />
          {p.kicker.split(" · ")[0]}
        </span>
      </span>
      <span className="absolute top-5 right-5 font-mono text-[0.6rem] text-cream-muted uppercase">Illustration</span>
      <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-ink/80 px-4 py-3 backdrop-blur">
        <span className="line-clamp-2 text-sm text-cream/90">{p.oneLiner}</span>
        <span className="label-caps shrink-0 text-cream">
          Discover case<span className="sr-only">: {p.title}</span>
        </span>
      </span>
    </Link>
  );
}

function NoteCard({ i }: { i: number }) {
  const n = notes[i];
  return (
    <article className={`flex h-full flex-col rounded-[24px] p-7 sm:p-9 ${n.tone}`}>
      <p className="font-mono text-xs tracking-widest uppercase">How I build · principle 0{principles.indexOf(n.principle) + 1}</p>
      <h3 className="mt-5 text-3xl leading-tight font-medium sm:text-4xl">{n.principle.rule}.</h3>
      <p className="mt-4 flex-1 text-lg">{n.principle.proof}</p>
      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm">— {profile.name}</p>
        <Link href={n.principle.href} className="label-caps inline-flex min-h-11 items-center gap-3">
          See the proof
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink">
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </article>
  );
}

function Work() {
  return (
    <section aria-labelledby="work" className="story-only py-24 sm:py-32">
      <Container className="max-w-[1340px]">
        <div className="reveal flex flex-col items-center text-center">
          <Headline id="work" ink="Featured" muted="work" size="headline-xl" />
          <span aria-hidden="true" className="mt-6 text-3xl text-text">
            ↓
          </span>
          <p className="prose-measure mt-6 text-lg">
            Internship projects at FutureVerse AI. They are confidential, so each case study uses a descriptive title and
            explains my role and the engineering patterns in general terms. Pictures on the cards are generic
            illustrations, not screenshots.
          </p>
        </div>

        {/* Two aligned rows of project tiles, then the two principle notes. */}
        <ul className="mt-16 grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.slug} className="reveal">
              <WorkTile slug={p.slug} minH="min-h-[520px] lg:min-h-[560px]" />
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="reveal">
            <NoteCard i={0} />
          </div>
          <div className="reveal">
            <NoteCard i={1} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Ellipse positions and tilts for the ring of archive cards (computed once, server-side). */
function ringLayout(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + Math.PI / n;
    return {
      x: `${(Math.cos(a) * 34).toFixed(2)}vw`,
      y: `${(Math.sin(a) * 31).toFixed(2)}vh`,
      tilt: `${((i % 2 ? 1 : -1) * (8 + (i * 7) % 14)).toFixed(0)}deg`,
    };
  });
}

const cardTones = ["bg-[#3b2fae]", "bg-[#2a2522]", "bg-[#a8301c]", "bg-[#6b4f3a]", "bg-[#2a2522]", "bg-[#3b2fae]", "bg-[#6b4f3a]", "bg-[#2a2522]"];

function ArchiveCard({ item, i }: { item: (typeof visibleArchive)[number]; i: number }) {
  const external = item.link?.href.startsWith("http");
  return (
    <div className={`flex h-full flex-col rounded-3xl p-5 text-cream shadow-2xl ${cardTones[i % cardTones.length]}`}>
      <p className="font-mono text-[0.62rem] text-cream uppercase">
        {item.year} · {item.category}
      </p>
      <h3 className="font-display mt-2 text-2xl">{item.name}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-cream">{item.description}</p>
      {item.link ? (
        <a
          href={item.link.href}
          className="label-caps mt-3 inline-flex min-h-10 items-center gap-1 text-cream hover:text-[#ffb27a]"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {item.link.label}
          <span className="sr-only">
            : {item.name}
            {external ? " (opens in a new tab)" : ""}
          </span>
          {external ? <ArrowUpRight /> : null}
        </a>
      ) : (
        <p className="mt-3 font-mono text-xs text-cream">{item.note}</p>
      )}
    </div>
  );
}

function MoreWork() {
  const pos = ringLayout(visibleArchive.length);
  return (
    <section aria-labelledby="archive" className="story-only ring-section bleed on-ink bg-ink text-cream">
      {/* Large screens: cards orbit the headline and turn as you scroll. */}
      <div className="ring-stage hidden lg:block">
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none">
          <h2 id="archive" className="font-display headline-xl text-cream">
            See more
            <br />
            work
          </h2>
          <p className="mt-4 max-w-[34ch] text-cream-muted">Earlier and smaller projects. No accuracy figures quoted from notebooks.</p>
        </div>
        <ul className="ring">
          {visibleArchive.map((item, i) => (
            <li key={item.name} className="ring-card" style={{ ["--x" as string]: pos[i].x, ["--y" as string]: pos[i].y, ["--tilt" as string]: pos[i].tilt }}>
              <ArchiveCard item={item} i={i} />
            </li>
          ))}
        </ul>
      </div>

      {/* Smaller screens: a simple grid. */}
      <div className="px-4 py-24 sm:px-8 lg:hidden">
        <h2 className="font-display headline-xl text-center text-cream">
          See more
          <br />
          work
        </h2>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2">
          {visibleArchive.map((item, i) => (
            <li key={item.name} className="float-card" style={{ ["--r" as string]: i % 2 ? "2deg" : "-2deg" }}>
              <ArchiveCard item={item} i={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Ship() {
  return (
    <section aria-labelledby="ship" className="story-only py-24 sm:py-32">
      <Container className="max-w-[1340px]">
        <div className="reveal flex flex-col items-center text-center">
          <h2 id="ship" className="font-display headline-lg">
            What I ship.
            <br />
            <em>How I keep it honest.</em>
          </h2>
        </div>

        <DeckScroller className="mx-auto mt-16 max-w-[1240px] space-y-8 pb-16">
          {capabilities.map((c, i) => (
            <li key={c.n} style={{ ["--i" as string]: i }} className={`rounded-[28px] p-7 shadow-[0_-20px_60px_-30px_rgba(23,20,18,0.5)] sm:p-12 ${c.tone}`}>
              <div className="flex items-start justify-between gap-6">
                <h3 className="font-display text-4xl sm:text-6xl">{c.title}</h3>
                <p aria-hidden="true" className="font-display text-3xl sm:text-4xl">
                  ({c.n})
                </p>
              </div>
              <p className="prose-measure mt-6 text-lg">{c.body}</p>

              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                <figure className="min-w-0 lg:col-span-4">
                  <blockquote className="text-lg leading-snug font-medium">{c.principle.text}</blockquote>
                  <figcaption className="mt-4 font-mono text-xs uppercase">{c.principle.label}</figcaption>
                </figure>
                <div className="relative min-w-0 lg:col-span-8">
                  <ul aria-label="Stack" className="flex gap-3 overflow-hidden">
                    {c.stack.slice(0, 4).map((s, j) => (
                      <li
                        key={s}
                        className={`flex aspect-square w-1/4 min-w-[110px] shrink-0 items-center justify-center rounded-2xl p-3 text-center ${
                          ["bg-[#d9f24a] text-ink", "bg-[#efe3d0] text-ink", "bg-[#f2d84a] text-ink", "bg-ink text-cream"][j]
                        }`}
                      >
                        <span className="font-display text-xl leading-none sm:text-2xl">{s}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={c.proof.href} className="pill pill-light absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg">
                    {c.proof.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </DeckScroller>
      </Container>
    </section>
  );
}

function Engineering() {
  return (
    <section aria-labelledby="engineering" className="story-only py-24 sm:py-32">
      <Container>
        <div className="reveal mb-14 flex flex-col items-center text-center">
          <Headline id="engineering" ink="Inside an AI" muted="workflow" />
          <p className="prose-measure mt-6">
            Step through two generic examples of the patterns behind my work, with made-up data. Pick a scenario to see
            what happens when a person withholds approval, a test fails, confidence is too low, or analyses disagree.
          </p>
        </div>
        <WalkthroughExplorer systems={walkthroughs} />

        <div id="tooling" className="mt-24 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h3 className="font-display text-5xl">
              Developer
              <br />
              <em>tooling</em>
            </h3>
            <p className="mt-5 text-[0.98rem] text-muted">
              In May 2026 I put together an internal guide to our team&apos;s Claude Code skills, plugins and Python
              tooling, then checked every Claude Code instruction against how the product actually behaved. These are
              other people&apos;s publicly available tools; the labels say what I did with each.
            </p>
            <div className="mt-6 rounded-3xl bg-surface p-5">
              <p className="label-caps">Corrections made in that revision</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted">
                {sopCorrections.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-faint">Accurate as of May 2026. Check the current Claude Code docs before following them.</p>
            </div>
          </div>
          <ul className="divide-y divide-line border-y border-line md:col-span-7">
            {tooling.map((t) => (
              <li key={t.name} className="grid gap-1 py-5 sm:grid-cols-12 sm:gap-4">
                <div className="sm:col-span-5">
                  <p className="font-display text-2xl">{t.name}</p>
                  <p className="font-mono text-xs text-faint">{t.contribution}</p>
                </div>
                <div className="text-[0.96rem] text-muted sm:col-span-7">
                  <p>{t.purpose}</p>
                  {t.detail ? <p className="mt-1 text-sm text-faint">{t.detail}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Numbers() {
  const tilts = ["-5deg", "3deg", "-2deg", "4deg", "-3deg", "2deg"];
  const tones = ["bg-surface text-text", "bg-[#6f645e] text-cream", "bg-surface text-text", "bg-[#6f645e] text-cream", "bg-surface text-text", "bg-[#6f645e] text-cream"];
  return (
    <section aria-labelledby="numbers" className="story-only overflow-hidden py-24 sm:py-32">
      <Container className="max-w-[1340px]">
        <div className="reveal">
          <h2 id="numbers" className="font-display headline-xl">
            How I
            <br />
            <em>work</em>
          </h2>
          <p className="prose-measure mt-6">
            Habits that run through all three projects. Internal metrics and repository statistics belong to the company,
            so they aren&apos;t published here.
          </p>
        </div>
        <ul className="fan mt-16">
          {practices.map((s, i) => (
            <li key={s.label} style={{ ["--tilt" as string]: tilts[i] }} className={`flex min-h-[380px] flex-col rounded-[24px] p-7 ${tones[i]}`}>
              <div className="flex items-center justify-end gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream">
                  ✓
                </span>
              </div>
              <p className="font-display mt-8 text-5xl sm:text-6xl">{s.value}</p>
              <p className="mt-3 flex-1 text-xl leading-snug font-medium">{s.label}</p>
              <div className="mt-6 flex items-center gap-3">
                <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-bright font-display text-sm text-ink">
                  KS
                </span>
                <p className="text-sm leading-tight">
                  Shows up in
                  <br />
                  <span>{s.detail}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Experience() {
  return (
    <section aria-labelledby="experience" className="py-24 sm:py-32">
      <Container>
        <div className="reveal mb-14 flex flex-col items-center text-center">
          <Headline id="experience" ink="Small résumé," muted="real work" />
        </div>
        <div className="grid gap-14 lg:grid-cols-12">
          <ol className="divide-y divide-line border-y border-line lg:col-span-7">
            {experience.map((r) => (
              <li key={r.org} className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-6">
                <p className="font-mono text-sm text-faint sm:col-span-4">{r.period}</p>
                <div className="sm:col-span-8">
                  <h3 className="font-display text-2xl">{r.title}</h3>
                  <p className="label-caps mt-1 text-muted">{r.org}</p>
                  <p className="mt-3 text-[0.96rem] text-muted">{r.summary}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl bg-surface p-6">
              <h3 className="label-caps">Education</h3>
              <ul className="mt-3 space-y-4">
                {education.map((e) => (
                  <li key={e.title}>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-muted">
                      {e.org} · {e.period}
                    </p>
                    {e.note ? <p className="text-sm text-faint">{e.note}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-surface p-6">
              <h3 className="label-caps">Certifications</h3>
              <ul className="mt-3 space-y-1.5 text-[0.96rem] text-muted">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-display text-center text-4xl">
            What I work with, <em>and where it shows up</em>
          </h3>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {skills.map((s) => (
              <div key={s.group} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
                <dt className="font-display text-xl md:col-span-3">{s.group}</dt>
                <dd className="text-[0.96rem] text-muted md:col-span-6">{s.items.join(" · ")}</dd>
                <dd className="font-mono text-xs text-faint md:col-span-3 md:text-right">{s.where}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section aria-labelledby="contact" className="py-24 sm:py-32">
      <Container className="flex flex-col items-center text-center">
        <h2 id="contact" className="font-display headline-xl">
          Let&apos;s build
          <br />
          <em>something you can inspect.</em>
        </h2>
        <p className="prose-measure mt-6 text-lg">Email is the best way to reach me. I&apos;m happy to talk through my approach in more depth, within what my internship agreement allows.</p>

        <div className="mt-10 w-full max-w-[680px] rounded-[28px] bg-surface p-6 text-left sm:p-8">
          <CopyEmail email={profile.email} />
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={`mailto:${profile.email}`} className="pill pill-solid">
              Email me
              <span aria-hidden="true" className="pill-dot">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-ghost">
              <LinkedInIcon /> LinkedIn <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="pill pill-ghost">
              <GitHubIcon /> GitHub <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
