import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keystone - Post-Quantum Benchmarking for Mac",
  description:
    "Download Keystone for macOS: a Mac-first desktop instrument for benchmarking classical and post-quantum cryptography with reproducible local evidence.",
  metadataBase: new URL("https://github.com/Brandon1138/keystone"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
