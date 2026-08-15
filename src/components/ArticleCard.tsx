import { Link } from "react-router-dom";
import { type DiarioNota, formatDate } from "../api/notas";
import { useSections } from "../hooks/useSections";

export function CoverImg({ nota, ratio = "16/9" }: { nota: DiarioNota; ratio?: string }) {
  const { colorOf } = useSections();
  if (nota.cover) {
    return (
      <img
        className="cover"
        src={nota.cover}
        alt={nota.coverAlt ?? nota.title}
        loading="lazy"
        decoding="async"
        width="1200"
        height={ratio === "16/9" ? "675" : "1200"}
      />
    );
  }
  const color = colorOf(nota.sectionSlug);
  return (
    <div
      className="cover cover--fallback"
      style={{
        background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 40%, #111))`,
      }}
      role="img"
      aria-label={nota.title}
    >
      <span className="cover-kicker">{nota.kicker ?? nota.sectionName ?? "LaDiarIA"}</span>
    </div>
  );
}

export function Kicker({ nota }: { nota: DiarioNota }) {
  const { colorOf } = useSections();
  const color = colorOf(nota.sectionSlug);
  return (
    <span className="kicker" style={{ color }}>
      {nota.kicker ?? nota.sectionName ?? "Noticias"}
    </span>
  );
}

export function Byline({ nota, compact = false }: { nota: DiarioNota; compact?: boolean }) {
  const author = nota.authorName ?? nota.author ?? "LaDiarIA";
  return (
    <p className={`byline ${compact ? "byline--compact" : ""}`}>
      <span className="byline-author">{author}</span>
      {nota.publishedAt && (
        <time dateTime={nota.publishedAt}>
          · {formatDate(nota.publishedAt)} · {nota.readingTime} min
        </time>
      )}
    </p>
  );
}

export function ArticleCard({ nota, lead = false }: { nota: DiarioNota; lead?: boolean }) {
  return (
    <article className={`card ${lead ? "card--lead" : ""}`}>
      {lead ? (
        <>
          <Link to={`/nota/${nota.slug}`} className="card-cover">
            <CoverImg nota={nota} />
          </Link>
          <div className="card-body">
            <Kicker nota={nota} />
            <Link to={`/nota/${nota.slug}`}>
              <h2 className="card-title card-title--lead">{nota.title}</h2>
            </Link>
            {nota.summary && <p className="card-summary">{nota.summary}</p>}
            <Byline nota={nota} compact />
          </div>
        </>
      ) : (
        <div className="card-inner">
          <Link to={`/nota/${nota.slug}`} className="card-cover">
            <CoverImg nota={nota} />
          </Link>
          <div className="card-body">
            <Kicker nota={nota} />
            <Link to={`/nota/${nota.slug}`}>
              <h3 className="card-title">{nota.title}</h3>
            </Link>
            <Byline nota={nota} compact />
          </div>
        </div>
      )}
    </article>
  );
}
