#!/usr/bin/env node
/**
 * Generate estatico de feeds RSS (rss 2.0) para el portal estatico LaDiarIA.
 *
 * Enfoque: en un site estatico (Vite + GitHub Pages) las rutas de React no existen
 * como archivos reales en prod, de modo que sirve/public/? un generador de build que
 * escribe `public/feed.xml` y `public/seccion/<slug>/feed.xml` ANTES de `vite build`.
 * Asi el build los copia tal cual a `dist/` y son accesibles sin servidor.
 *
 * Base URL: leerla de `VITE_SITE_URL` (con fallback de ejemplo) porque RSS exige URLs
 * absolutas en <link>/<guid>. Copiar .env para setearla en el deploy real.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const payloadPath = join(publicDir, "notas.json");

const SITE_BASE = (process.env.VITE_SITE_URL ?? "https://example.com/LaDiarIA").replace(/\/$/, "");
const SITE_NAME = "LaDiarIA";
const SITE_DESC = "Diario digital generado con agentes de IA y validado por humanos.";

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function rfc822(iso) {
  if (!iso) return new Date().toUTCString();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function channel({ title, desc, link, notes }) {
  const items = notes
    .map((n) => {
      const url = `${SITE_BASE}/nota/${n.slug}`;
      return `    <item>
      <title>${esc(n.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="false">${esc(url)}</guid>
      <pubDate>${rfc822(n.publishedAt)}</pubDate>
      <author>${esc(n.authorName ?? n.author ?? SITE_NAME)}</author>
      ${n.summary ? `<description>${esc(n.summary)}</description>` : ""}
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(title)}</title>
    <link>${esc(link)}</link>
    <description>${esc(desc)}</description>
    <language>es-AR</language>
    <lastBuildDate>${rfc822(process.env.BUILD_TIME ?? new Date().toISOString())}</lastBuildDate>
    <atom:link href="${esc(`${SITE_BASE}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

let payload;
try {
  payload = JSON.parse(readFileSync(payloadPath, "utf8"));
} catch {
  console.error("[feedgen] no se pudo leer public/notas.json; se omiten feeds");
  process.exit(0);
}

const notes = Array.isArray(payload.notes) ? payload.notes : [];
// feed del sitio (portada / edicion vigente)
writeFileSync(
  join(publicDir, "feed.xml"),
  channel({
    title: SITE_NAME,
    desc: SITE_DESC,
    link: SITE_BASE,
    notes,
  }),
  "utf8",
);

// feed por compania y por modelo (jerarquia compania -> modelo)
const categories = Array.isArray(payload.categories) ? payload.categories : [];
for (const company of categories) {
  const companyNotes = notes.filter(
    (n) => n.companySlug === company.slug || n.sectionSlug === company.slug,
  );
  // feed por compania
  const companyDir = join(publicDir, "empresa", company.slug);
  mkdirSync(companyDir, { recursive: true });
  writeFileSync(
    join(companyDir, "feed.xml"),
    channel({
      title: `${SITE_NAME} — ${company.name}`,
      desc: company.blurb ?? `${company.name} en el diario ${SITE_NAME}.`,
      link: `${SITE_BASE}/empresa/${company.slug}`,
      notes: companyNotes,
    }),
    "utf8",
  );

  // feed por modelo
  const models = Array.isArray(company.models) ? company.models : [];
  for (const model of models) {
    const modelNotes = companyNotes.filter((n) => n.modelSlug === model.slug);
    const modelDir = join(companyDir, model.slug);
    mkdirSync(modelDir, { recursive: true });
    writeFileSync(
      join(modelDir, "feed.xml"),
      channel({
        title: `${SITE_NAME} — ${company.name} / ${model.name}`,
        desc: model.blurb ?? `${model.name} de ${company.name} en ${SITE_NAME}.`,
        link: `${SITE_BASE}/empresa/${company.slug}/${model.slug}`,
        notes: modelNotes,
      }),
      "utf8",
    );
  }
}

// feed por seccion (retrocompat: categorias raiz planas)
for (const cat of categories) {
  const sectionNotes = notes.filter(
    (n) => n.sectionSlug === cat.slug || n.sectionName === cat.name,
  );
  const dir = join(publicDir, "seccion", cat.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "feed.xml"),
    channel({
      title: `${SITE_NAME} — ${cat.name}`,
      desc: cat.blurb ?? `${cat.name} en el diario ${SITE_NAME}.`,
      link: `${SITE_BASE}/seccion/${cat.slug}`,
      notes: sectionNotes,
    }),
    "utf8",
  );
}

console.log("[scgen] feeds generados en public/");
