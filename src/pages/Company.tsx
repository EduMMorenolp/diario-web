import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArticleCard } from "../components/ArticleCard";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";
import { revealCards, revealKickers, revealLeadCard } from "../lib/animations";

export function Company() {
  const { companySlug, modelSlug } = useParams();
  const { data } = useNotas();
  const company = data?.categories.find((c) => c.slug === companySlug);
  const color = company?.color ?? "var(--color-accent)";

  const allNotes = data?.notes ?? [];
  const companyNotes = allNotes.filter(
    (n) => n.companySlug === companySlug || n.sectionSlug === companySlug,
  );

  const model = modelSlug ? company?.models?.find((m) => m.slug === modelSlug) : undefined;
  const notes = model ? companyNotes.filter((n) => n.modelSlug === modelSlug) : companyNotes;

  const lead = notes[0];
  const rest = notes.slice(1);

  const models = company?.models ?? [];

  const title = model ? `${model.name} — ${company?.name ?? ""}` : (company?.name ?? "Compañía");
  useMeta({
    title: `${title} — LaDiarIA`,
    description: model?.blurb ?? company?.blurb ?? "Sección del diario LaDiarIA.",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: animar al cambiar de nota/compania/modelo
  useEffect(() => {
    if (lead) {
      revealLeadCard(".home-hero .card");
    }
    const grid = document.querySelector(".home-grid");
    if (grid) {
      const cards = grid.querySelectorAll(".card");
      if (cards.length) {
        revealCards(Array.from(cards));
      }
    }
    requestAnimationFrame(() => revealKickers());
  }, [lead?.slug, companySlug, modelSlug]);

  if (!company) {
    return (
      <div className="wrap">
        <p>Compañía no encontrada.</p>
        <Link to="/">Volver a la portada</Link>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="secpage-head" style={{ borderTopColor: color }}>
        <h1>{title}</h1>
        <span className="section-block-label">
          {companyNotes.length} nota{companyNotes.length === 1 ? "" : "s"}
        </span>
      </header>

      {models.length > 0 && (
        <nav className="company-models" aria-label={`Modelos de ${company.name}`}>
          <Link
            to={`/empresa/${company.slug}`}
            className="company-model-chip"
            aria-current={!modelSlug ? "page" : undefined}
          >
            Todos
          </Link>
          {models.map((m) => (
            <Link
              key={m.slug}
              to={`/empresa/${company.slug}/${m.slug}`}
              className="company-model-chip"
              aria-current={modelSlug === m.slug ? "page" : undefined}
            >
              {m.name}
            </Link>
          ))}
        </nav>
      )}

      {lead && (
        <section className="home-hero reveal">
          <ArticleCard nota={lead} lead />
        </section>
      )}
      <section className="home-grid reveal">
        {rest.map((n) => (
          <ArticleCard key={n.slug} nota={n} />
        ))}
        {rest.length === 0 && <p>Sin más notas en esta sección.</p>}
      </section>
    </div>
  );
}
