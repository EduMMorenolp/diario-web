export interface SiteSettings {
  siteName: string;
  tagline: string;
  footerText: string;
  descriptionSeo: string;
  accentColor: string;
  darkBg: string;
  lightBg: string;
  logoUrl: string | null;
  faviconUrl: string | null;
}

const str = (v: unknown): string | null => (typeof v === "string" && v.length > 0 ? v : null);

export const DEFAULT_SITE: SiteSettings = {
  siteName: "LaDiarIA",
  tagline: "Diario de inteligencia artificial",
  footerText:
    "Diario generado con agentes de IA (redactor, editor y jefe de redacción) y validado por humanos. Contenido bajo revisión editorial.",
  descriptionSeo:
    "Diario digital de inteligencia artificial y desarrollo: noticias generadas con agentes de IA y validadas por humanos.",
  accentColor: "#4f8fff",
  darkBg: "#0e0e12",
  lightBg: "#ffffff",
  logoUrl: null,
  faviconUrl: null,
};

function normalizeSite(raw: Record<string, unknown> | undefined): SiteSettings {
  if (!raw) return DEFAULT_SITE;
  return {
    siteName: str(raw.siteName) ?? DEFAULT_SITE.siteName,
    tagline: str(raw.tagline) ?? DEFAULT_SITE.tagline,
    footerText: str(raw.footerText) ?? DEFAULT_SITE.footerText,
    descriptionSeo: str(raw.descriptionSeo) ?? DEFAULT_SITE.descriptionSeo,
    accentColor: str(raw.accentColor) ?? DEFAULT_SITE.accentColor,
    darkBg: str(raw.darkBg) ?? DEFAULT_SITE.darkBg,
    lightBg: str(raw.lightBg) ?? DEFAULT_SITE.lightBg,
    logoUrl: str(raw.logoUrl),
    faviconUrl: str(raw.faviconUrl),
  };
}

export async function fetchSite(): Promise<SiteSettings> {
  try {
    const res = await fetch("./site.json");
    if (!res.ok) return DEFAULT_SITE;
    const raw = (await res.json()) as Record<string, unknown>;
    return normalizeSite(raw);
  } catch {
    // site.json ausente (portal legacy): usar defaults.
    return DEFAULT_SITE;
  }
}
