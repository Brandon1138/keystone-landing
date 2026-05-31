import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = "Keystone — Post-Quantum Benchmarking for Mac";
const description =
  "Keystone is a Mac-first desktop instrument for benchmarking classical and post-quantum cryptography with reproducible, local evidence.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Keystone",
  },
  description,
  applicationName: "Keystone",
  keywords: [
    "post-quantum cryptography",
    "PQC benchmarking",
    "ML-KEM",
    "ML-DSA",
    "Falcon",
    "SPHINCS+",
    "macOS",
    "cryptography benchmarks",
  ],
  authors: [{ name: "Keystone Labs" }],
  creator: "Keystone Labs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Keystone",
    title,
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1320" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
