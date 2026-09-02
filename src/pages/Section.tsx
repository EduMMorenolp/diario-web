import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { formatEditionDate } from "../api/notas";
import { ArticleCard } from "../components/ArticleCard";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { revealCards } from "../lib/animations";

export function Section() {
  const { slug } = useParams();
  const { data } = useNotas();
  const section = data?.categories.find((c) => c.slug === slug);
  const color = section?.color ?? "var(--color-accent)";
  const items = data?.notes.filter((n) => n.sectionSlug === slug) ?? [];
  const lead = items[0];
  const rest = items.slice(1);
  const heroRef = useScrollReveal<HTMLDivElement>(0.05);
  const gridRef = useScrollReveal<HTMLDivElement>();
  const animated = useRef(false);

  useMeta({
    title: section ? `${section.name} — LaDiarIA` : "Sección no encontrada — LaDiarIA",
    description: section?.blurb ?? "Sección del diario LaDiarIA.",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: solo animar al montar
  useEffect(() => {
    const el = gridRef.current;
    if (!animated.current && el) {
      const cards = el.querySelectorAll(".card");
      if (cards.length) {
        animated.current = true;
        revealCards(Array.from(cards));
      }
    }
  }, []);

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
          Edición {formatEditionDate(data?.edition?.date)}
        </span>
      </header>

      {lead && (
        <section ref={heroRef} className="home-hero reveal">
          <ArticleCard nota={lead} lead />
        </section>
      )}
      <section ref={gridRef} className="home-grid reveal">
        {rest.map((n) => (
          <ArticleCard key={n.slug} nota={n} />
        ))}
        {rest.length === 0 && <p>Sin más notas en esta sección.</p>}
      </section>
    </div>
  );
}
