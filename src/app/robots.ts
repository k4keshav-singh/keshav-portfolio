import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Until a real domain is configured, ask crawlers not to index preview builds.
  const configured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  return {
    rules: configured ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteUrl.origin}/sitemap.xml`,
  };
}
