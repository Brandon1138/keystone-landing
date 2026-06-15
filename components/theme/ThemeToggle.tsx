"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { applyTheme, readStoredTheme, type ThemePreference } from "@/lib/theme";

const OPTIONS = [
  { value: "light" as const, label: "Light theme", Icon: Sun },
  { value: "system" as const, label: "System theme", Icon: Monitor },
  { value: "dark" as const, label: "Dark theme", Icon: Moon },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference>("system");

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  function choose(next: ThemePreference) {
    applyTheme(next);
    setTheme(next);
  }

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Theme appearance">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          className={theme === value ? "is-active" : undefined}
          onClick={() => choose(value)}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </button>
      ))}
    </div>
  );
}
