"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Download, Github, Menu, X } from "lucide-react";

type NavLink = { label: string; href: string };

export function MobileNav({
  links,
  githubUrl,
}: {
  links: readonly NavLink[];
  githubUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  const overlay = (
    <div id="mobile-menu" className="mobile-menu" data-open={open} aria-hidden={!open}>
      <button
        type="button"
        className="mobile-menu-scrim"
        aria-label="Close menu"
        onClick={close}
      />
      <nav className="mobile-menu-panel" aria-label="Mobile">
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-actions">
          <Link href={githubUrl} className="mobile-menu-secondary" onClick={() => setOpen(false)}>
            <Github className="h-4 w-4" aria-hidden />
            View source
          </Link>
          <Link href="#download" className="mobile-menu-primary" onClick={() => setOpen(false)}>
            <Download className="h-4 w-4" aria-hidden />
            Download for macOS
          </Link>
        </div>
      </nav>
    </div>
  );

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
