import Link from "next/link";
import { Download } from "lucide-react";

interface SmartDownloadButtonProps {
  available: boolean;
  version?: string;
  className?: string;
  showSpan?: boolean;
  onClick?: () => void;
}

export function SmartDownloadButton({
  available,
  version,
  className,
  showSpan = false,
  onClick,
}: SmartDownloadButtonProps) {
  if (!available) {
    return (
      <span
        className={className}
        data-testid="download-unavailable"
        role="status"
      >
        Download unavailable
      </span>
    );
  }

  return (
    <Link
      className={className}
      href="/download"
      data-testid="download-macos"
      onClick={onClick}
    >
      <Download className="h-4 w-4" />
      {showSpan ? (
        <span>Download</span>
      ) : (
        `Download Keystone ${version} for macOS`
      )}
    </Link>
  );
}
