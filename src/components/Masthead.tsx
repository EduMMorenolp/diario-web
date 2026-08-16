import { Link } from "react-router-dom";
import { useNotas } from "../hooks/useNotas";

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
  const editionLabel = data?.edition?.label;
  const now = new Date();
  const dateLabel = `${WEEKDAYS[now.getDay()]} ${now.getDate()} de ${MONTHS[now.getMonth()]} · ${now.getFullYear()}`;

  return (
    <header className="masthead">
      <div className="wrap masthead-inner">
        <Link to="/" className="masthead-link" aria-label="LaDiarIA - portada">
          LaDiarIA
        </Link>
        <div className="masthead-cols">
          <p className="masthead-tag">
            Diario de inteligencia artificial
            <span className="masthead-tag-dot" aria-hidden="true" />
            redacción de agentes · edición humana
          </p>
          <p className="masthead-date">
            {editionLabel ? `${editionLabel} · ` : ""}
            {dateLabel}
          </p>
        </div>
      </div>
    </header>
  );
}
