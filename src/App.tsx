import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Masthead } from "./components/Masthead";
import { SectionNav } from "./components/SectionNav";
import { useNotas } from "./hooks/useNotas";
import { useSite } from "./hooks/useSite";
import { useUi } from "./hooks/useUi";
import { Company } from "./pages/Company";
import { Ediciones } from "./pages/Ediciones";
import { Home } from "./pages/Home";
import { Nota } from "./pages/Nota";
import { Section } from "./pages/Section";

function Toolbar() {
  const { theme, font, toggleTheme, cycleFont } = useUi();
  const themeLabel = `Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`;
  const fontLabel = `Tamaño de letra: ${font === "" ? "normal" : font === "a" ? "grande" : "muy grande"}`;
  return (
    <div className="toolbar">
      <button
        type="button"
        className="toolbar-btn toolbar-btn--icon"
        onClick={cycleFont}
        title={fontLabel}
        aria-label={fontLabel}
        aria-pressed={font !== ""}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7V4h16v3" />
          <path d="M9 20h6" />
          <path d="M12 4v16" />
        </svg>
        <span className="toolbar-size" aria-hidden="true">
          {font === "" ? "A" : font === "a" ? "A+" : "A++"}
        </span>
      </button>
      <button
        type="button"
        className="toolbar-btn toolbar-btn--icon theme-toggle"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
      >
        {theme === "dark" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function SiteTheme() {
  const site = useSite();
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-accent", site.accentColor);
    root.style.setProperty("--color-paper", site.darkBg);
    root.style.setProperty("--color-inverse", site.darkBg);
    root.style.setProperty("--color-paper-light", site.lightBg);
    if (site.faviconUrl) {
      const link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) link.href = site.faviconUrl;
    }
  }, [site]);
  return null;
}

export default function App() {
  useUi();
  const { data } = useNotas();
  const site = useSite();
  const categories = data?.categories ?? [];

  return (
    <>
      <SiteTheme />
      <Masthead />
      <SectionNav categories={categories} />
      <Toolbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresa/:companySlug" element={<Company />} />
          <Route path="/empresa/:companySlug/:modelSlug" element={<Company />} />
          <Route path="/seccion/:slug" element={<Section />} />
          <Route path="/ediciones" element={<Ediciones />} />
          <Route path="/nota/:slug" element={<Nota />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span className="footer-word">{site.siteName || "LaDiarIA"}</span>
        <p>{site.footerText}</p>
      </footer>
    </>
  );
}
