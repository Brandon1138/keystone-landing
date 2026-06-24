import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-archivo-narrow",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
  variable: "--font-syne",
});

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
  authors: [{ name: "Brandon Aron", url: "https://mikoshi.studio" }],
  creator: "Brandon Aron",
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
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${archivoNarrow.variable}`}>
        <Script id="keystone-theme-init" src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
