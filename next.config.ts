import type { NextConfig } from "next";
import path from "node:path";

const SUB_PAGES = [
  "about",
  "benchmarks",
  "blog",
  "contact",
  "docs",
  "platform",
  "privacy",
  "releases",
  "reports",
  "schemes",
  "security",
  "terms",
] as const;

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return SUB_PAGES.flatMap((slug) => [
      { source: `/${slug}`, destination: `/${slug}/index.html` },
      { source: `/${slug}/`, destination: `/${slug}/index.html` },
    ]);
  },
};

export default config;
