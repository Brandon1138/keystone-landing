"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download as DownloadIcon } from "lucide-react";

interface SmartDownloadButtonProps {
  className?: string;
  githubUrl: string;
  showSpan?: boolean;
  onClick?: () => void;
}

export function SmartDownloadButton({ className, githubUrl, showSpan = false, onClick }: SmartDownloadButtonProps) {
  const [os, setOs] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      if (ua.indexOf("Mac") !== -1) setOs("macos");
      else if (ua.indexOf("Win") !== -1) setOs("windows");
      else if (ua.indexOf("Linux") !== -1) setOs("linux");
      else setOs("other");
    }
  }, []);

  // For macOS, we link directly to the releases/repo (as it's currently the only native target)
  // For others, we scroll to the download section which shows "Coming soon"
  const href = os === "macos" ? githubUrl : "#download";

  return (
    <Link className={className} href={href} onClick={onClick}>
      <DownloadIcon className="h-4 w-4" />
      {showSpan ? <span>Download</span> : "Download"}
    </Link>
  );
}
