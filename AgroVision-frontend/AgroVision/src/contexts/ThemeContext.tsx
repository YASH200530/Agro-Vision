import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  useEffect(() => {
    try { localStorage.setItem("theme", theme); } catch {}
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
