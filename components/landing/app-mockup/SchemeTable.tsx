import { Check, RefreshCw } from "lucide-react";
import { SCHEME_TABLE } from "@/lib/mockData";

const HEADERS = [
  "Scheme", "Category", "Security Level",
  "Key Gen (ms)", "Sign / Enc (ms)", "Verify / Dec (ms)",
  "Ops / s", "Size (KB)", "Status",
];

export function SchemeTable() {
  return (
    <div
      data-testid="mockup-scheme-table"
      className="rounded-lg border border-border bg-surface-2"
    >
      <div className="border-b border-border px-4 py-3">
        <h4 className="text-[12px] font-semibold text-foreground">Scheme Comparison</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-border bg-surface">
              {HEADERS.map((h) => (
                <th key={h} className="px-3 py-2 font-medium text-foreground-subtle whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEME_TABLE.map((row) => (
              <tr key={row.scheme} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{row.scheme}</td>
                <td className="px-3 py-2 text-foreground-muted whitespace-nowrap">{row.category}</td>
                <td className="px-3 py-2 text-foreground-muted whitespace-nowrap">{row.level}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.keyGen}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.sign}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.verify}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.ops}</td>
                <td className="px-3 py-2 font-mono text-foreground">{row.size}</td>
                <td className="px-3 py-2">
                  {row.ok && <Check className="h-3.5 w-3.5 text-success" aria-label="ok" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-foreground-subtle">
        <span>Completed 32 runs</span>
        <span className="inline-flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3" /> Last run: 2m ago
        </span>
      </div>
    </div>
  );
}
