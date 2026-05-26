import { ChevronDown } from "lucide-react";

const ITEMS = [
  "Overview", "Benchmarks", "Schemes", "Runtimes",
  "Workflows", "Results", "Reports", "Settings",
];

export function Sidebar() {
  return (
    <aside
      data-testid="mockup-sidebar"
      className="hidden w-44 shrink-0 flex-col border-r border-border bg-surface-2 px-3 py-4 md:flex"
    >
      <ul className="flex flex-col gap-0.5">
        {ITEMS.map((label, idx) => {
          const active = idx === 0;
          return (
            <li key={label}>
              <span
                className={
                  active
                    ? "flex items-center gap-2 rounded-md border-l-2 border-primary bg-surface-3 px-3 py-1.5 text-xs font-medium text-foreground"
                    : "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-foreground-muted hover:bg-surface-3 hover:text-foreground"
                }
              >
                <span
                  aria-hidden
                  className={active ? "h-1.5 w-1.5 rounded-full bg-primary" : "h-1.5 w-1.5 rounded-full bg-border-strong"}
                />
                {label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <div className="rounded-md border border-border bg-surface px-3 py-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-foreground-subtle">
            Active Profile <ChevronDown className="h-3 w-3" />
          </div>
          <div className="mt-1 text-xs font-medium text-foreground">Default Lab</div>
        </div>
        <div className="rounded-md border border-border bg-surface px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-foreground-subtle">Environment</div>
          <div className="mt-1 text-xs font-medium text-foreground">Apple M2 Pro</div>
          <div className="text-[11px] text-foreground-muted">macOS 14.4</div>
        </div>
        <div className="flex items-center gap-2 px-1 text-[11px] text-foreground-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems nominal
        </div>
      </div>
    </aside>
  );
}
