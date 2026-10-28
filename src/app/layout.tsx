import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteShell } from "@/components/site-shell";
import { SiteFooter } from "@/components/site-footer";
import { profile } from "@/content/profile";
import { modeBootScript } from "@/lib/mode";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "@fontsource-variable/inter-tight/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteTitle, template: "%s · Keshav Singh" },
  description: siteDescription,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    type: "website",
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: profile.name,
    locale: "en_IN",
  },
  twitter: { card: "summary", title: siteTitle, description: siteDescription },
  // Preview builds without a configured domain stay out of search indexes.
  robots: process.env.NEXT_PUBLIC_SITE_URL ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf9ef",
  colorScheme: "light",
};

/** Truthful Person data only: name, role, employer, location, public profiles. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI Engineer (Intern)",
  worksFor: { "@type": "Organization", name: "FutureVerse AI" },
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Applies recruiter mode before first paint (see src/lib/mode.ts). */}
        <script dangerouslySetInnerHTML={{ __html: modeBootScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-1/2 focus:top-20 focus:z-50 focus:-translate-x-1/2 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:font-medium focus:text-cream"
        >
          Skip to content
        </a>
        <SiteShell />
        <main id="main" className="with-rail flex-1">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          // Static, author-controlled data; no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
