"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "testdev:theme";

type ThemeMode = "light" | "dark";

function getPreferredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const nextThemeLabel = theme === "dark" ? "切换浅色主题" : "切换暗色主题";

  return (
    <button
      type="button"
      className="ghost-button theme-toggle"
      onClick={toggleTheme}
      aria-label={nextThemeLabel}
      title={nextThemeLabel}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {theme === "dark" ? "◐" : "◑"}
      </span>
      <span className="theme-toggle-label" suppressHydrationWarning>
        {theme === "dark" ? "暗色" : "浅色"}
      </span>
    </button>
  );
}
