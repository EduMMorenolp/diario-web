import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type FontLevel = "" | "a" | "aa";

function readTheme(): Theme {
  const saved = localStorage.getItem("ladiaria-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "dark";
}

function readFont(): FontLevel {
  const saved = localStorage.getItem("ladiaria-font") as FontLevel | null;
  return saved ?? "";
}

export function useUi() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [font, setFont] = useState<FontLevel>(readFont);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ladiaria-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.font = font;
    localStorage.setItem("ladiaria-font", font);
  }, [font]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const cycleFont = () => setFont((f) => (f === "" ? "a" : f === "a" ? "aa" : ""));

  return { theme, font, toggleTheme, cycleFont };
}
