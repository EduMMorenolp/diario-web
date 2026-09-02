import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatEditionDate } from "../api/notas";
import { useNotas } from "../hooks/useNotas";
import { useSite } from "../hooks/useSite";
import { animateMasthead } from "../lib/animations";

const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function Masthead() {
  const { data } = useNotas();
  const site = useSite();
  const editionDate = data?.edition?.date;
  const now = new Date();
  const dateLabel = `${WEEKDAYS[now.getDay()]} ${now.getDate()} de ${MONTHS[now.getMonth()]} · ${now.getFullYear()}`;
  const siteName = site.siteName || "LaDiarIA";

  useEffect(() => {
    animateMasthead();
  }, []);

  return (
    <header className="masthead">
      <div className="wrap masthead-inner">
        <Link to="/" className="masthead-link" aria-label={`${siteName} - portada`}>
          {site.logoUrl ? <img className="masthead-logo" src={site.logoUrl} alt="" /> : siteName}
        </Link>
        <div className="masthead-cols">
          <p className="masthead-tag">
            {site.tagline}
            <span className="masthead-tag-dot" aria-hidden="true" />
            redacción de agentes · edición humana
          </p>
          <p className="masthead-date">
            {editionDate ? `Edición ${formatEditionDate(editionDate)} · ` : ""}
            {dateLabel}
          </p>
        </div>
      </div>
    </header>
  );
}
