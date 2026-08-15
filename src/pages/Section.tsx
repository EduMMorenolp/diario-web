import { Link, useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";

export function Section() {
  const { slug } = useParams();
  const { data } = useNotas();
  const section = data?.categories.find((c) => c.slug === slug);
  const color = section?.color ?? "var(--color-accent)";
  const items = data?.notes.filter((n) => n.sectionSlug === slug) ?? [];
  const lead = items[0];
  const rest = items.slice(1);

  useMeta({
    title: section ? `${section.name} — LaDiarIA` : "Sección no encontrada — LaDiarIA",
    description: section?.blurb ?? "Sección del diario LaDiarIA.",
  });

  if (!section) {
    return (
      <div className="wrap">
        <p>Sección no encontrada.</p>
        <Link to="/">Volver a la portada</Link>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="secpage-head" style={{ borderTopColor: color }}>
        <h1>{section.name}</h1>
        <span className="section-block-label">
          Edición {new Date().toLocaleDateString("es-AR")}
        </span>
      </header>

      {lead && (
        <section className="home-hero">
          <ArticleCard nota={lead} lead />
        </section>
      )}
      <section className="home-grid">
        {rest.map((n) => (
          <ArticleCard key={n.slug} nota={n} />
        ))}
        {rest.length === 0 && <p>Sin más notas en esta sección.</p>}
      </section>
    </div>
  );
}
