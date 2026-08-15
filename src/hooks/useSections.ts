import { useNotas } from "./useNotas";

export function useSections() {
  const { data } = useNotas();
  const sections = data?.categories ?? [];
  const bySlug = new Map(sections.map((c) => [c.slug, c]));
  const colorOf = (slug: string | null | undefined): string =>
    bySlug.get(slug ?? "")?.color ?? "var(--color-accent)";
  const nameOf = (slug: string | null | undefined): string | null =>
    bySlug.get(slug ?? "")?.name ?? null;
  return { sections, colorOf, nameOf };
}
