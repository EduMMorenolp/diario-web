import { Navigate, Route, Routes } from "react-router-dom";
import { Masthead } from "./components/Masthead";
import { SectionNav } from "./components/SectionNav";
import { useNotas } from "./hooks/useNotas";
import { useUi } from "./hooks/useUi";
import { Ediciones } from "./pages/Ediciones";
import { Home } from "./pages/Home";
import { Nota } from "./pages/Nota";
import { Section } from "./pages/Section";

function Toolbar() {
  const { theme, toggleTheme, cycleFont } = useUi();
  const label = `Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`;
  return (
    <div className="toolbar">
      <button
        type="button"
        className="toolbar-btn"
        onClick={cycleFont}
        title="Cambiar tamaño de letra"
        aria-label="Cambiar tamaño de letra"
      >
        A±
      </button>
      <button
        type="button"
        className="toolbar-btn theme-toggle"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
      >
        {theme === "dark" ? "S" : "C"}
      </button>
    </div>
  );
}

export default function App() {
  useUi();
  const { data } = useNotas();
  const categories = data?.categories ?? [];

  return (
    <>
      <Masthead />
      <SectionNav categories={categories} />
      <Toolbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/seccion/:slug" element={<Section />} />
          <Route path="/ediciones" element={<Ediciones />} />
          <Route path="/nota/:slug" element={<Nota />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span className="footer-word">LaDiarIA</span>
        <p>
          Diario generado con agentes de IA (redactor, editor y jefe de redacción) y validado por
          humanos. Contenido bajo revisión editorial.
        </p>
      </footer>
    </>
  );
}
