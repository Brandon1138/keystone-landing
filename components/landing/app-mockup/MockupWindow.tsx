import { Settings, ChevronDown } from "lucide-react";

export function MockupWindow({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="mockup-window"
      className="overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5),0_8px_24px_-8px_rgba(20,184,166,0.18)]"
    >
      <div className="flex h-10 items-center justify-between border-b border-border bg-surface-2 px-4">
        <div data-testid="traffic-lights" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-danger" />
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span className="h-3 w-3 rounded-full bg-success" />
        </div>
        <span className="text-xs font-medium text-foreground-muted">Keystone</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-background hover:bg-primary-light"
          >
            Run Benchmark
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-foreground-muted hover:text-foreground"
          >
            Preset: Balanced <ChevronDown className="h-3 w-3" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="grid h-6 w-6 place-items-center rounded-md text-foreground-muted hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
