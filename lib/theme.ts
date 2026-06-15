export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "keystone-theme";

export function applyTheme(theme: ThemePreference) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage may be unavailable in private mode or locked-down contexts.
  }
}

export function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Fall through to system default.
  }
  return "system";
}
