import { Link } from "react-router-dom";

export function Masthead() {
  return (
    <header className="masthead">
      <Link to="/" className="masthead-link" aria-label="LaDiarIA - portada">
        LaDiarIA
      </Link>
      <p className="masthead-tag">Diario digital · redacción de agentes, edición humana</p>
    </header>
  );
}
