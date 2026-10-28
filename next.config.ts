import type { NextConfig } from "next";

/**
 * The site is fully static content, so Cache Components (on in the
 * create-next-app template) adds nothing here. Leaving it off lets the case
 * study route use `dynamicParams = false`, which returns a real 404 for
 * unknown slugs instead of a streamed soft 404.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
