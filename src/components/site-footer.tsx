import Link from "next/link";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { nav } from "@/lib/site";
import { ArrowUpRight } from "./icons";

const linkCls = "label-caps inline-flex min-h-10 items-center gap-1 text-cream hover:text-accent-bright";

export function SiteFooter() {
  return (
    <footer className="with-rail on-ink bg-ink pb-24 text-cream">
      <div className="mx-auto max-w-[1320px] px-4 pt-20 sm:px-8">
        <p className="font-display text-[3.4rem] sm:text-8xl">
          Keshav<em>Singh</em>
        </p>
        <nav aria-label="Footer" className="mt-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <p className="text-sm text-cream-muted">Site</p>
            <ul className="mt-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={linkCls}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-cream-muted">Case studies</p>
            <ul className="mt-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className={linkCls}>
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-cream-muted">Elsewhere</p>
            <ul className="mt-3">
              <li>
                <a href={`mailto:${profile.email}`} className={linkCls}>
                  Email
                </a>
              </li>
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  GitHub <ArrowUpRight /> <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  LinkedIn <ArrowUpRight /> <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-cream-muted">Quick view</p>
            <ul className="mt-3">
              <li>
                {/* Full page load on purpose, so the recruiter-mode boot script runs. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/?mode=recruiter" className={linkCls}>
                  Recruiter mode
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="mt-16 flex flex-col gap-2 border-t border-ink-line pt-6 text-xs text-cream-muted sm:flex-row sm:justify-between">
          <p>© 2026 {profile.name}. Built with Next.js. No analytics or tracking.</p>
          <p>Internship work is described in general terms to respect confidentiality. Illustrations and walkthroughs are generic, with made-up data.</p>
        </div>
      </div>
    </footer>
  );
}
