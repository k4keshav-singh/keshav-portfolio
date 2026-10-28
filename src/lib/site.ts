/**
 * The production domain isn't decided yet, so it comes from the environment.
 * Set NEXT_PUBLIC_SITE_URL (e.g. https://keshavsingh.dev) when deploying;
 * canonical URLs, the sitemap and robots.txt all derive from it.
 */
function resolveSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(raw);
  } catch {
    // A malformed value should not break the build; fall back to localhost.
    return new URL("http://localhost:3000");
  }
}

export const siteUrl = resolveSiteUrl();

export const siteTitle = "Keshav Singh — AI Engineer";
export const siteDescription =
  "Keshav Singh is an early-career AI engineer in New Delhi building multi-agent pipelines with deterministic reasoning, human-gated code generation, and full-stack product features.";

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Engineering", href: "/#engineering" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
] as const;
