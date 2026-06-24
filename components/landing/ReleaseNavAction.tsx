import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SmartDownloadButton } from "@/components/landing/SmartDownloadButton";

interface ReleaseNavActionProps {
  available: boolean;
  version?: string;
  className?: string;
  onClick?: () => void;
}

export function ReleaseNavAction({
  available,
  version,
  className = "",
  onClick,
}: ReleaseNavActionProps) {
  if (available) {
    return (
      <div className={`nav-action ${className}`.trim()} data-state="available">
        <span className="nav-action__readout" aria-hidden>
          <span className="nav-action__os">macOS</span>
          {version ? <span className="nav-action__ver">{version}</span> : null}
        </span>
        <SmartDownloadButton
          available
          version={version}
          className="nav-action__cta nav-action__cta--primary"
          ariaLabel={`Download Keystone ${version} for macOS`}
          showSpan
          onClick={onClick}
        />
      </div>
    );
  }

  return (
    <div className={`nav-action ${className}`.trim()} data-state="pending">
      <span
        className="nav-action__readout"
        data-testid="release-pending"
        role="status"
      >
        <span className="nav-action__tick" aria-hidden />
        Release pending
      </span>
      <Link href="#benchmarks" className="nav-action__cta" onClick={onClick}>
        View benchmarks
        <ArrowRight className="nav-action__arrow" aria-hidden />
      </Link>
    </div>
  );
}

export function MobileReleaseAction({
  available,
  version,
  onClick,
}: {
  available: boolean;
  version?: string;
  onClick?: () => void;
}) {
  if (available) {
    return (
      <SmartDownloadButton
        className="mobile-menu-primary"
        available
        version={version}
        ariaLabel={`Download Keystone ${version} for macOS`}
        onClick={onClick}
      />
    );
  }

  return (
    <span
      className="release-status-pill mobile-release-pill"
      data-testid="release-pending"
      role="status"
    >
      <span className="nav-action__tick" aria-hidden />
      Release pending
    </span>
  );
}
