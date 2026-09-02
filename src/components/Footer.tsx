import { Link } from "react-router-dom";
import { type DiarioCategory, type DiarioEditionSummary, formatEditionDate } from "../api/notas";
import { useSite } from "../hooks/useSite";

const SLOT_LABEL: Record<string, string> = {
  manana: "Mañana",
  mediodia: "Mediodía",
  tarde: "Tarde",
  noche: "Noche",
  diaria: "Diaria",
};

export function Footer({
  categories = [],
  editions = [],
}: {
  categories: DiarioCategory[];
  editions: DiarioEditionSummary[];
}) {
  const site = useSite();
  const siteName = site.siteName || "LaDiarIA";

  // Excluir categoría portada para evitar duplicado
  const validCategories = categories.filter(
    (c) => c.slug !== "portada" && c.name.toLowerCase() !== "portada",
  );

  // Filtrar solo ediciones con notas publicadas (excluir ediciones vacías con 0 notas)
  const validEditions = editions.filter((e) => e.noteCount > 0);

  // Tomar las 4 ediciones más recientes para el bloque del footer
  const recentEditions = validEditions.slice(0, 4);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer" aria-label="Pie de página del diario">
      <div className="wrap footer-inner">
        {/* Encabezado del Doormat Footer: Marca + Volver arriba */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo" aria-label={`${siteName} - portada`}>
              {siteName}
              <span className="footer-dot" aria-hidden="true" />
            </Link>
            <p className="footer-tagline">
              {site.tagline} · Periodismo tecnológico asistido por agentes de IA con edición y
              validación humana
            </p>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="footer-back-to-top"
            aria-label="Volver al inicio de la página"
          >
            <span>Volver arriba</span>
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
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>

        {/* Columnas del Doormat Footer */}
        <div className="footer-grid">
          {/* Columna 1: Secciones */}
          <div className="footer-col">
            <h3 className="footer-col-title">Secciones</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">
                  Portada
                </Link>
              </li>
              {validCategories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/empresa/${c.slug}`} className="footer-link">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 2: Archivo de Ediciones */}
          <div className="footer-col">
            <h3 className="footer-col-title">Archivo de Ediciones</h3>
            {recentEditions.length > 0 ? (
              <ul className="footer-editions-list">
                {recentEditions.map((e) => (
                  <li key={e.slug} className="footer-edition-item">
                    <Link to="/ediciones" className="footer-edition-link">
                      <span className="footer-edition-date">{formatEditionDate(e.date)}</span>
                      <span className="footer-edition-badge">{SLOT_LABEL[e.slot] ?? e.slot}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="footer-text-muted">Próximamente más ediciones archivadas.</p>
            )}
            <Link to="/ediciones" className="footer-cta-link">
              Ver archivo completo de ediciones →
            </Link>
          </div>

          {/* Columna 3: El Diario & Redacción IA */}
          <div className="footer-col">
            <h3 className="footer-col-title">Redacción de Agentes</h3>
            <p className="footer-col-desc">
              Cada nota es investigada, sintetizada y redactada por un pipeline de agentes autónomos
              y revisada por editores humanos antes de su publicación.
            </p>
            <ul className="footer-links">
              <li>
                <a
                  href="./feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Canal RSS de noticias
                </a>
              </li>
              <li>
                <Link to="/ediciones" className="footer-link">
                  Hemeroteca digital
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Sobre LaDiarIA */}
          <div className="footer-col">
            <h3 className="footer-col-title">Transparencia Editorial</h3>
            <p className="footer-col-desc">{site.footerText}</p>
            <div className="footer-meta-badge">
              <span className="status-dot" />
              <span>Sistema operativo 24/7</span>
            </div>
          </div>
        </div>

        {/* Barra inferior de Copyright y Colofón */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {siteName}. Publicación estática de alta disponibilidad.
          </p>
          <p className="footer-notice">
            Edición digital continua · Inteligencia Artificial y Desarrollo
          </p>
        </div>
      </div>
    </footer>
  );
}
