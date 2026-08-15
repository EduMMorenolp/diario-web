import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { DiarioCategory } from "../api/notas";

export function SectionNav({ categories = [] }: { categories: DiarioCategory[] }) {
  const [open, setOpen] = useState(false);
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (pathname) setOpen(false);
  }, [pathname]);

  return (
    <nav className="secnav" aria-label="Secciones del diario">
      <button
        type="button"
        className="secnav-burger"
        aria-expanded={open}
        aria-controls="secnav-list"
        aria-label={open ? "Cerrar menú de secciones" : "Abrir menú de secciones"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="burger" />
        <span>Secciones</span>
      </button>
      <ul id="secnav-list" className={`secnav-list ${open ? "is-open" : ""}`}>
        <li>
          <Link to="/" className="secnav-item" aria-current={pathname === "/" ? "page" : undefined}>
            Portada
          </Link>
        </li>
        {categories.map((c) => {
          const active = pathname === `/seccion/${c.slug}`;
          return (
            <li key={c.slug}>
              <Link
                to={`/seccion/${c.slug}`}
                className="secnav-item"
                aria-current={active ? "page" : undefined}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            to="/ediciones"
            className="secnav-item"
            aria-current={pathname === "/ediciones" ? "page" : undefined}
          >
            Ediciones
          </Link>
        </li>
      </ul>
    </nav>
  );
}
