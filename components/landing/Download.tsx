import Link from "next/link";
import { Apple, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function WindowsLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M0 3.5L9.5 2.2v9.3H0V3.5zM10.6 2L24 0v11.3H10.6V2zM0 12.5h9.5v9.3L0 20.5v-8zM10.6 12.5H24V24l-13.4-2.1V12.5z" />
    </svg>
  );
}
function TuxLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 2c-2.7 0-4.5 2.4-4.5 5.4 0 1.4.5 2.6 1.3 3.5-1.4 1.1-3 3.4-3.5 6.6-.4 2.4 1 5 4 5 1.2 0 2.4-.4 3.7-1.3 1.3.9 2.5 1.3 3.7 1.3 3 0 4.4-2.6 4-5-.5-3.2-2.1-5.5-3.5-6.6.8-.9 1.3-2.1 1.3-3.5 0-3-1.8-5.4-4.5-5.4z" />
    </svg>
  );
}

const PLATFORMS = [
  { name: "macOS",   Logo: Apple,        sub: "10.15 or later · Apple Silicon & Intel", label: "Download .dmg",      enabled: false, href: "#" },
  { name: "Windows", Logo: WindowsLogo,  sub: "Windows 10 or later · x64",               label: "Download .exe",      enabled: true,  href: "#" },
  { name: "Linux",   Logo: TuxLogo,      sub: "Ubuntu 20.04+ / Fedora 39+ / Arch",        label: "Download .AppImage", enabled: false, href: "#" },
];

export function Download() {
  return (
    <section id="download" className="container-page pb-24 text-center">
      <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.05] tracking-tight text-foreground">
        Download Keystone
      </h2>
      <p className="mt-3 text-[15px] text-foreground-muted">Native installers. No cloud required.</p>

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {PLATFORMS.map((p) => (
          <article
            key={p.name}
            data-testid="download-card"
            className="rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground"><p.Logo className="h-6 w-6" /></span>
              <div>
                <div className="text-[15px] font-semibold text-foreground">{p.name}</div>
                <div className="text-[11px] text-foreground-subtle">{p.sub}</div>
              </div>
            </div>

            <div className="mt-5">
              {p.enabled ? (
                <Button asChild className="w-full justify-center">
                  <Link href={p.href}>{p.label}</Link>
                </Button>
              ) : p.name === "Linux" ? (
                <div className="flex">
                  <Button disabled className="flex-1 justify-center rounded-r-none">{p.label}</Button>
                  <Button disabled className="rounded-l-none border-l border-background/30 px-3"><ChevronDown className="h-4 w-4" /></Button>
                </div>
              ) : (
                <Button disabled className="w-full justify-center">{p.label}</Button>
              )}
              {!p.enabled && (
                <div className="mt-2 text-center text-[11px] text-foreground-subtle">Coming soon</div>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-[12px] text-foreground-subtle">
        Verify downloads:{" "}
        <Link href="#" className="text-foreground-muted underline-offset-4 hover:underline">checksums.txt</Link>
        {" · "}
        <Link href="/releases/" className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground">
          View all releases on GitHub <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </section>
  );
}
