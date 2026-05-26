import type { NextConfig } from "next";

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
  async rewrites() {
    return SUB_PAGES.flatMap((slug) => [
      { source: `/${slug}`, destination: `/${slug}/index.html` },
      { source: `/${slug}/`, destination: `/${slug}/index.html` },
    ]);
  },
};

export default config;
