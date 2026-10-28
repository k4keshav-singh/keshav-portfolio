import Link from "next/link";
import { certifications, education, experience, profile, skills } from "@/content/profile";
import { recruiterHighlights } from "@/content/recruiter";
import { ArrowRight, GitHubIcon, LinkedInIcon } from "./icons";
import { RecruiterToggle } from "./recruiter-toggle";

/**
 * The one-screen recruiter view. Server-rendered and hidden by CSS unless
 * <html data-mode="recruiter"> is set. Internship work is described at a
 * public-safe level (see src/content/projects.ts).
 */
export function RecruiterSummary() {
  const current = experience[0];
  const degree = education[0];
  return (
    <section aria-labelledby="recruiter-title" className="recruiter-only pt-28 pb-16 sm:pt-32">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
        <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_10px_40px_rgba(58,38,36,0.08)] sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="flex items-center gap-2 font-mono text-xs text-muted">
              <span aria-hidden="true" className="sun-dot" /> Recruiter mode · the 60-second version
            </p>
            <RecruiterToggle className="border border-line" />
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h1 id="recruiter-title" className="font-display text-5xl leading-none sm:text-6xl">
                {profile.name}
              </h1>
              <p className="label-caps mt-3 text-muted">
                {profile.role} · Intern at FutureVerse AI · {profile.location}
              </p>
              <p className="prose-measure mt-5 text-muted">{profile.summary}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href={`mailto:${profile.email}`} className="pill pill-solid">
                  Email me
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="pill pill-ghost">
                  <LinkedInIcon /> LinkedIn <span className="sr-only">(opens in a new tab)</span>
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="pill pill-ghost">
                  <GitHubIcon /> GitHub <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
              <p className="mt-3 text-sm text-faint">
                {profile.email}
              </p>
            </div>

            <dl className="grid gap-4 text-[0.95rem] sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
              <Fact term="Now" value={`${current.title} — ${current.org.split(" · ")[0]}, ${current.period}`} />
              <Fact term="Location" value={profile.location} />
              <Fact term="Education" value={`${degree.title}, ${degree.org.split(",")[0]} (${degree.period})`} />
              <Fact term="Focus" value="Explainable multi-agent pipelines · human-in-the-loop AI coding · Next.js product features" />
            </dl>
          </div>

          <h2 className="font-display mt-12 text-3xl">
            Highlights <em className="text-muted">from my internship</em>
          </h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recruiterHighlights.map((h) => (
              <li key={h.project} className="flex flex-col rounded-3xl border border-line bg-bg/60 p-5">
                <p className="font-mono text-xs text-faint">{h.context}</p>
                <h3 className="font-display mt-1 text-2xl">{h.project}</h3>
                <ul className="mt-3 flex-1 list-disc space-y-1.5 pl-5 text-[0.95rem] text-muted marker:text-faint">
                  {h.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-xs text-faint">{h.stack}</p>
                <Link href={`/work/${h.slug}`} className="text-link mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium">
                  Case study<span className="sr-only">: {h.project}</span> <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-display text-3xl">Skills</h2>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                {skills.map((s) => (
                  <div key={s.group} className="grid gap-1 py-3 sm:grid-cols-12 sm:gap-4">
                    <dt className="font-medium text-text sm:col-span-4">{s.group}</dt>
                    <dd className="text-[0.93rem] text-muted sm:col-span-8">{s.items.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-5">
              <h2 className="font-display text-3xl">Experience</h2>
              <ol className="mt-4 space-y-3">
                {experience.map((r) => (
                  <li key={r.org} className="text-[0.95rem]">
                    <p className="font-medium text-text">{r.title}</p>
                    <p className="text-muted">
                      {r.org} · <span className="font-mono text-xs">{r.period}</span>
                    </p>
                  </li>
                ))}
              </ol>
              <h2 className="font-display mt-8 text-2xl">Certifications</h2>
              <ul className="mt-3 space-y-1 text-[0.93rem] text-muted">
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-10 border-t border-line pt-5 text-sm text-faint">
            Figures are from source code and git history, checked read-only in October 2026; test counts are counted, not
            re-run. Turn recruiter mode off for the full story, including an interactive walkthrough of two systems.
          </p>
        </div>
      </div>
    </section>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-bg/60 px-4 py-3">
      <dt className="font-mono text-xs text-faint">{term}</dt>
      <dd className="mt-1 text-text">{value}</dd>
    </div>
  );
}
