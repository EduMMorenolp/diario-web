import { Link, useParams } from "react-router-dom";
import { ArticleCard, Byline, CoverImg, Kicker } from "../components/ArticleCard";
import { MarkdownContent } from "../components/Markdown";
import { useMeta } from "../hooks/useMeta";
import { useNotas } from "../hooks/useNotas";

export function Nota() {
  const { slug } = useParams();
  const { data } = useNotas();
  const nota = data?.notes.find((n) => n.slug === slug);
  const related = (
    data?.notes.filter((n) => n.slug !== slug && n.sectionSlug === nota?.sectionSlug) ?? []
  ).slice(0, 3);

  useMeta({
    title: nota ? `${nota.title} — LaDiarIA` : "Nota no encontrada — LaDiarIA",
    description: nota?.summary ?? "Nota del diario LaDiarIA.",
  });

  if (!nota) {
    return (
      <div className="wrap article-404">
        <h1>Nota no encontrada</h1>
        <Link to="/">Volver a la portada</Link>
      </div>
    );
  }

  return (
    <article className="article">
      <header className="article-head wrap">
        <Kicker nota={nota} />
        <h1 className="article-title">{nota.title}</h1>
        {nota.summary && <p className="article-dek">{nota.summary}</p>}
        <Byline nota={nota} />
      </header>
      <div className="article-cover wrap">
        <CoverImg nota={nota} />
      </div>
      <div className="wrap article-grid">
        <div className="article-body">
          <MarkdownContent content={nota.body} />
          {nota.tags.length > 0 && (
            <div className="article-tags">
              {nota.tags.map((t) => (
                <span className="tag" key={t}>
                  #{t}
                </span>
              ))}
            </div>
          )}
          {nota.materialUrl && (
            <p className="article-source">
              Fuente:{" "}
              <a href={nota.materialUrl} target="_blank" rel="noopener noreferrer">
                {nota.materialUrl}
              </a>
            </p>
          )}
        </div>
        <aside className="article-rail">
          <div className="rail-card">
            <span className="section-label">Publicado</span>
            <p>{data?.updatedAt ? new Date(data.updatedAt).toLocaleString("es-AR") : ""}</p>
            <p className="rail-disclaimer">
              Esta nota fue generada con ayuda de agentes de IA y editada/validada por humanos.
            </p>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="wrap related">
          <h2 className="section-block-title">Relacionadas</h2>
          <div className="home-grid">
            {related.map((n) => (
              <ArticleCard key={n.slug} nota={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
