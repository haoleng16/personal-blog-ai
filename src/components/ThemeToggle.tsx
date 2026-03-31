"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("site-theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("site-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: ThemeMode = saved === "dark" || saved === "light" ? (saved as ThemeMode) : systemDark ? "dark" : "light";

    setTheme(initial);
    applyTheme(initial);
    setReady(true);
  }, []);

  function handleChange(next: ThemeMode) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={() => handleChange("light")}
        className={[
          "rounded-full px-3 py-1.5 text-sm transition",
          ready && theme === "light"
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
        ].join(" ")}
        aria-pressed={theme === "light"}
      >
        亮
      </button>
      <button
        type="button"
        onClick={() => handleChange("dark")}
        className={[
          "rounded-full px-3 py-1.5 text-sm transition",
          ready && theme === "dark"
            ? "bg-[var(--accent)] text-[#1a1209]"
            : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]",
        ].join(" ")}
        aria-pressed={theme === "dark"}
      >
        暗
      </button>
    </div>
  );
}
