export interface DiarioModel {
  slug: string;
  name: string;
  color: string;
  blurb: string | null;
}

export interface DiarioCategory {
  slug: string;
  name: string;
  color: string;
  /** Conste editorial corta de la seccion. Puede faltar hasta que el backend lo exporte. */
  blurb: string | null;
  /** Modelos hijos (jerarquia compania -> modelo). */
  models?: DiarioModel[];
}

export interface DiarioEditionSummary {
  slug: string;
  label: string;
  date: string;
  slot: string;
  noteCount: number;
}

export interface DiarioEdition {
  slug: string;
  label: string;
  date: string;
  slot: string;
  publishedAt: string | null;
  briefing: string | null;
  featuredNoteSlug: string | null;
}

export interface DiarioNota {
  slug: string;
  title: string;
  kicker: string | null;
  summary: string | null;
  body: string;
  author: string | null;
  authorName: string | null;
  sectionSlug: string | null;
  sectionName: string | null;
  companySlug: string | null;
  companyName: string | null;
  modelSlug: string | null;
  modelName: string | null;
  editionSlug: string | null;
  tags: string[];
  cover: string | null;
  coverAlt: string | null;
  featured: boolean;
  readingTime: number;
  imageUrl: string | null;
  materialUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
}

export interface NotasPayload {
  generatedAt: string;
  updatedAt: string;
  noteCount: number;
  categories: DiarioCategory[];
  notes: DiarioNota[];
  /** Edicion vigente que manda en la portada. Puede faltar hasta que el backend la exporte. */
  edition: DiarioEdition | null;
  /** Ultimas N ediciones para el archivo/navegacion. Puede faltar. */
  editions: DiarioEditionSummary[];
}

const str = (v: unknown): string | null => (typeof v === "string" ? v : null);
const num = (v: unknown): number => (typeof v === "number" ? v : 0);
const bool = (v: unknown): boolean => Boolean(v);
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

/** Convierte una nota cruda (del JSON) a `DiarioNota`, tolerando campos nuevos ausentes. */
function normalizeNota(n: Record<string, unknown>): DiarioNota {
  return {
    slug: String(n.slug ?? ""),
    title: String(n.title ?? ""),
    kicker: str(n.kicker),
    summary: str(n.summary),
    body: String(n.body ?? ""),
    author: str(n.author),
    authorName: str(n.authorName),
    sectionSlug: str(n.sectionSlug),
    sectionName: str(n.sectionName),
    companySlug: str(n.companySlug),
    companyName: str(n.companyName),
    modelSlug: str(n.modelSlug),
    modelName: str(n.modelName),
    editionSlug: str(n.editionSlug),
    tags: list(n.tags),
    cover: str(n.cover),
    coverAlt: str(n.coverAlt),
    featured: bool(n.featured),
    readingTime: num(n.readingTime),
    imageUrl: str(n.imageUrl),
    materialUrl: str(n.materialUrl),
    publishedAt: str(n.publishedAt),
    updatedAt: str(n.updatedAt),
  };
}

function normalizeCategory(c: Record<string, unknown>): DiarioCategory {
  const rawModels = Array.isArray(c.models) ? c.models : [];
  const models = rawModels
    .map((m) => (m && typeof m === "object" ? (m as Record<string, unknown>) : null))
    .filter((m): m is Record<string, unknown> => m !== null)
    .map((m) => ({
      slug: String(m.slug ?? ""),
      name: String(m.name ?? ""),
      color: String(m.color ?? c.color ?? ""),
      blurb: str(m.blurb),
    }));
  return {
    slug: String(c.slug ?? ""),
    name: String(c.name ?? ""),
    color: String(c.color ?? ""),
    blurb: str(c.blurb),
    models: models.length > 0 ? models : undefined,
  };
}

/**
 * Normaliza el payload descargado a tipos fuertes y tolera un `notas.json` legacy
 * que aun no exporta `edition`/`editions`/`authorName`/`blurb` (entrega E10).
 */
function normalizeNotasPayload(raw: Record<string, unknown>): NotasPayload {
  const rawNotes = Array.isArray(raw.notes) ? raw.notes : [];
  const rawCats = Array.isArray(raw.categories) ? raw.categories : [];
  const rawEds = Array.isArray(raw.editions) ? raw.editions : [];
  const notes = rawNotes
    .map((n) => (n && typeof n === "object" ? normalizeNota(n as Record<string, unknown>) : null))
    .filter((n): n is DiarioNota => n !== null);
  const categories = rawCats
    .map((c) =>
      c && typeof c === "object" ? normalizeCategory(c as Record<string, unknown>) : null,
    )
    .filter((c): c is DiarioCategory => c !== null);
  const editions = rawEds
    .map((e): DiarioEditionSummary | null => {
      if (!e || typeof e !== "object") return null;
      const o = e as Record<string, unknown>;
      return {
        slug: String(o.slug ?? ""),
        label: String(o.label ?? ""),
        date: String(o.date ?? ""),
        slot: String(o.slot ?? ""),
        noteCount: num(o.noteCount),
      };
    })
    .filter((e): e is DiarioEditionSummary => e !== null);

  let edition: DiarioEdition | null = null;
  const rawEdition = raw.edition;
  if (rawEdition && typeof rawEdition === "object") {
    const o = rawEdition as Record<string, unknown>;
    edition = {
      slug: String(o.slug ?? ""),
      label: String(o.label ?? ""),
      date: String(o.date ?? ""),
      slot: String(o.slot ?? ""),
      publishedAt: str(o.publishedAt),
      briefing: str(o.briefing),
      featuredNoteSlug: str(o.featuredNoteSlug),
    };
  }

  return {
    generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : "",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
    noteCount: typeof raw.noteCount === "number" ? raw.noteCount : notes.length,
    categories,
    notes,
    edition,
    editions,
  };
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function fetchNotas(): Promise<NotasPayload> {
  const res = await fetch("./notas.json");
  if (!res.ok) throw new Error("No se pudo leer notas.json");
  const raw = (await res.json()) as Record<string, unknown>;
  return normalizeNotasPayload(raw);
}

/** Formatea la fecha `YYYY-MM-DD` de una edicion (sin hora) a forma legible en es-AR. */
export function formatEditionDate(date: string | null | undefined): string {
  if (!date) return "";
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date; // formato raro: devolver crudo
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
