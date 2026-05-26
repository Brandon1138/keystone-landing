import Link from "next/link";
import { Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRIMARY_LINKS = [
  { label: "Features",   href: "#features" },
  { label: "Benchmarks", href: "#comparison" },
  { label: "Security",   href: "#trust" },
  { label: "Download",   href: "#download" },
  { label: "Docs",       href: "/docs/" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Keystone home">
          <span aria-hidden className="block h-7 w-7 rounded-md bg-gradient-to-br from-primary to-primary-light" />
          <span className="text-lg font-semibold tracking-tight text-foreground">Keystone</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="#"
            aria-label="GitHub"
            className="text-foreground-muted transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="#">
              <Star className="h-4 w-4" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
