import { useEffect, useRef } from "react";
import { type DiarioEdition, type DiarioNota, formatEditionDate } from "../api/notas";
import { ArticleCard } from "../components/ArticleCard";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSite } from "../hooks/useSite";
import { animateEditionHead, revealCards } from "../lib/animations";

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
  const site = useSite();
  const edition: DiarioEdition | null = data?.edition ?? null;
  const allNotes = data?.notes ?? [];
  const categories = data?.categories ?? [];
  const featuredRef = useScrollReveal<HTMLDivElement>(0.05);

  // Notas de la edicion vigente + notas sin edicion (huérfanas); fallback global si no hay nada.
  const editionNotes = edition
    ? allNotes.filter((n) => n.editionSlug === edition.slug || n.editionSlug === null)
    : [];
  const notes = edition && editionNotes.length > 0 ? editionNotes : allNotes;

  const featured =
    (edition ? notes.find((n) => n.slug === edition.featuredNoteSlug) : null) ??
    notes.find((n) => n.featured) ??
    notes[0];
  const rest = notes.filter((n) => n !== featured);
  const secondary = rest.slice(0, 3);
  const groupedNotes = rest.filter((n) => !secondary.some((item) => item.slug === n.slug));
  const groups = groupBySection(groupedNotes, categories);

  useMeta({
    title: edition
      ? `${site.siteName} — ${edition.label}`
      : `${site.siteName} — Diario digital con agentes de IA`,
    description: edition?.briefing ?? site.descriptionSeo,
  });

  // Animar cards del featured grid cuando cargan
  const featuredAnimated = useRef(false);
  useEffect(() => {
    if (notes.length > 0 && !featuredAnimated.current) {
      featuredAnimated.current = true;
      revealCards(".featured-story .card, .featured-rail .card");
    }
  }, [notes.length]);

  // Animar edition head al cambiar de edición
  const prevEditionSlug = useRef(edition?.slug);
  useEffect(() => {
    if (prevEditionSlug.current !== edition?.slug) {
      animateEditionHead();
      prevEditionSlug.current = edition?.slug;
    }
  }, [edition?.slug]);

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
            ? `${edition.label} · ${formatEditionDate(edition.date)}`
            : "LaDiarIA"}
        </p>
        {edition?.briefing ? <p className="edition-briefing">{edition.briefing}</p> : null}
      </header>

      {featured && (
        <section
          ref={featuredRef}
          className="home-featured-grid reveal"
          aria-label="Nota de portada y tendencias"
        >
          <div className="featured-story">
            <ArticleCard nota={featured} lead />
          </div>

          {secondary.length > 0 && (
            <aside className="featured-rail" aria-label="Notas destacadas secundarias">
              <div className="featured-rail-header">
                <span>Lo más reciente</span>
              </div>
              {secondary.map((n) => (
                <ArticleCard key={n.slug} nota={n} compact />
              ))}
            </aside>
          )}
        </section>
      )}

      {groups.length > 0 && (
        <section className="home-sections" aria-label="Notas de la edición por sección">
          {groups.map((g) => (
            <SectionGroup key={g.key} group={g} />
          ))}
        </section>
      )}
    </div>
  );
}

/** Sección de grupo con scroll reveal y stagger de cards */
function SectionGroup({ group }: { group: { key: string; name: string; notes: DiarioNota[] } }) {
  const ref = useScrollReveal<HTMLDivElement>();
  const animated = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: solo animar al montar
  useEffect(() => {
    const el = ref.current;
    if (!animated.current && el) {
      const grid = el.querySelector(".home-grid");
      if (grid) {
        const cards = grid.querySelectorAll(".card");
        if (cards.length) {
          animated.current = true;
          revealCards(Array.from(cards));
        }
      }
    }
  }, []);

  return (
    <section ref={ref} className="home-section-group reveal">
      <h2 className="section-block-title">{group.name}</h2>
      <div className="home-grid">
        {group.notes.map((n) => (
          <ArticleCard key={n.slug} nota={n} />
        ))}
      </div>
    </section>
  );
}
