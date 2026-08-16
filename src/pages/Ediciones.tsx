import { useState } from "react";
import { type DiarioEditionSummary, formatEditionDate } from "../api/notas";
import { ArticleCard } from "../components/ArticleCard";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";

const SLOT_LABEL: Record<string, string> = {
  manana: "mañana",
  mediodia: "mediodía",
  tarde: "tarde",
  noche: "noche",
};

function slotLabel(slot: string | undefined): string {
  if (!slot) return "";
  return SLOT_LABEL[slot] ?? slot;
}

export function Ediciones() {
  const { data } = useNotas();
  const editions: DiarioEditionSummary[] = data?.editions ?? [];
  const allNotes = data?.notes ?? [];
  const [activeSlug, setActiveSlug] = useState<string>("");

  const edition = editions.find((e) => e.slug === (activeSlug || editions[0]?.slug)) ?? editions[0];
  const editionNotes = edition ? allNotes.filter((n) => n.editionSlug === edition.slug) : [];

  useMeta({
    title: "Ediciones — LaDiarIA",
    description: "Archivo de ediciones anteriores del diario LaDiarIA.",
  });

  if (editions.length === 0) {
    return (
      <div className="wrap archive-404">
        <h1>Ediciones</h1>
        <p>Aún no hay ediciones archivadas. Volvé pronto.</p>
      </div>
    );
  }

  return (
    <div className="wrap archive">
      <header className="archive-head">
        <h1>Ediciones</h1>
        <p className="section-block-label">Archivo del diario</p>
      </header>

      <div className="archive-layout">
        <nav className="archive-nav reveal" aria-label="Ediciones anteriores">
          <ul className="archive-list">
            {editions.map((e) => (
              <li key={e.slug}>
                <button
                  type="button"
                  className={`archive-item ${e.slug === edition.slug ? "is-active" : ""}`}
                  aria-current={e.slug === edition.slug ? "page" : undefined}
                  onClick={() => setActiveSlug(e.slug)}
                >
                  <span className="archive-item-label">{e.label}</span>
                  <span className="archive-item-meta">
                    {slotLabel(e.slot)} · {formatEditionDate(e.date)} · {e.noteCount} notas
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <section
          className="archive-content"
          aria-label={`Notas de ${edition?.label ?? "la edición"}`}
        >
          {editionNotes.length === 0 ? (
            <p>Esta edición no tiene notas publicadas.</p>
          ) : (
            <div className="home-grid">
              {editionNotes.map((n) => (
                <ArticleCard key={n.slug} nota={n} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
