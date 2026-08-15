import { useEffect } from "react";

/**
 * setea <title>, meta description y los Open Graph basics (og:title, og:description,
 * og:type) del documento para la pagina actual. Elimina los props de pagina anterior.
 */
export function useMeta({
  title,
  description,
  type = "website",
}: { title: string; description?: string; type?: string }) {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (selector: string, attr: string, nameOrProp: string): HTMLMetaElement => {
      const existing = document.head.querySelector<HTMLMetaElement>(selector);
      if (existing) return existing;
      const meta = document.createElement("meta");
      meta.setAttribute(attr, nameOrProp);
      document.head.appendChild(meta);
      return meta;
    };

    const desc = ensureMeta('meta[name="description"]', "name", "description");
    if (description) {
      desc.setAttribute("content", description);
    } else {
      desc.removeAttribute("content");
    }

    const props: Array<[string, string]> = [
      ["og:title", title],
      ["og:description", description ?? ""],
      ["og:type", type],
    ];
    for (const [prop, content] of props) {
      const el = ensureMeta(`meta[property="${prop}"]`, "property", prop);
      if (content) {
        el.setAttribute("content", content);
      } else {
        el.removeAttribute("content");
      }
    }
  }, [title, description, type]);
}
