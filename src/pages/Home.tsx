import { type DiarioEdition, type DiarioNota, formatEditionDate } from "../api/notas";
import { ArticleCard } from "../components/ArticleCard";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";

interface CategoryInfo {
  slug: string;
  name: string;
  color: string;
}

/** Agrupa notas de una edicion por compania, respetando el orden de `categories`. */
function groupBySection(notes: DiarioNota[], categories: CategoryInfo[]) {
  const sections = new Map<string, DiarioNota[]>();
  for (const n of notes) {
    const key = n.companySlug ?? n.sectionSlug ?? n.sectionName ?? "otras";
    const arr = sections.get(key) ?? [];
    arr.push(n);
    sections.set(key, arr);
  }
  const names = new Map(categories.map((c) => [c.slug, c.name]));
  const orderedKeys = categories.map((c) => c.slug).filter((s) => sections.has(s));
  const extraKeys = [...sections.keys()].filter((s) => !orderedKeys.includes(s));
  return [...orderedKeys, ...extraKeys].map((key) => ({
    key,
    name:
      names.get(key) ??
      sections.get(key)?.[0]?.companyName ??
      sections.get(key)?.[0]?.sectionName ??
      key,
    notes: sections.get(key) ?? [],
  }));
}

export function Home() {
  const { data } = useNotas();
  const edition: DiarioEdition | null = data?.edition ?? null;
  const allNotes = data?.notes ?? [];
  const categories = data?.categories ?? [];

  // Notas de la edicion vigente; fallback global si la edicion no trae notas o aun no existe.
  const editionNotes = edition ? allNotes.filter((n) => n.editionSlug === edition.slug) : [];
  const notes = edition && editionNotes.length > 0 ? editionNotes : allNotes;

  const featured =
    (edition ? notes.find((n) => n.slug === edition.featuredNoteSlug) : null) ??
    notes.find((n) => n.featured) ??
    notes[0];
  const rest = notes.filter((n) => n !== featured);
  const groups = groupBySection(rest, categories);

  useMeta({
    title: edition ? `LaDiarIA — ${edition.label}` : "LaDiarIA — Diario digital con agentes de IA",
    description:
      edition?.briefing ?? "Noticias generadas con agentes de IA y validadas por humanos.",
  });

  if (notes.length === 0) {
    return (
      <div className="wrap home-empty">
        <h1>La edición aún no tiene notas</h1>
        <p>El batallón de agentes está en la redacción. Volvé pronto.</p>
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="edition-head">
        <p className="section-label">
          {edition
            ? `Edición de ${edition.label} · ${formatEditionDate(edition.date)}`
            : "LaDiarIA"}
        </p>
        {edition?.briefing ? <p className="edition-briefing">{edition.briefing}</p> : null}
      </header>

      {featured && (
        <section className="home-hero reveal" aria-label="Nota de portada">
          <ArticleCard nota={featured} lead />
        </section>
      )}

      {rest.length > 0 && (
        <section className="home-sections" aria-label="Notas de la edición por sección">
          {groups.map((g) => (
            <section key={g.key} className="home-section-group reveal">
              <h2 className="section-block-title">{g.name}</h2>
              <div className="home-grid">
                {g.notes.map((n) => (
                  <ArticleCard key={n.slug} nota={n} />
                ))}
              </div>
            </section>
          ))}
        </section>
      )}
    </div>
  );
}
