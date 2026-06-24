"use client";

import { type ReactNode, useEffect, useState } from "react";
import Link from "next/link";

import { MobileNav } from "@/components/landing/MobileNav";
import { ReleaseNavAction } from "@/components/landing/ReleaseNavAction";

type NavLink = { label: string; href: string };

interface SiteHeaderProps {
  links: readonly NavLink[];
  releaseAvailable: boolean;
  releaseVersion?: string;
  brand: ReactNode;
}

export function SiteHeader({
  links,
  releaseAvailable,
  releaseVersion,
  brand,
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header site-header--editorial" data-scrolled={scrolled}>
      <div className="header-editorial">
        {brand}
        <nav aria-label="Primary" className="primary-nav primary-nav--editorial">
          {links.map((link) => (
            <Link key={link.label} href={link.href}>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="header-actions header-actions--editorial">
          <ReleaseNavAction available={releaseAvailable} version={releaseVersion} />
          <MobileNav
            links={links}
            releaseAvailable={releaseAvailable}
            releaseVersion={releaseVersion}
          />
        </div>
      </div>
    </header>
  );
}
