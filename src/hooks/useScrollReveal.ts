import { useEffect, useRef } from "react";
import { revealSection } from "../lib/animations";

/**
 * Hook que revela un elemento con animación cuando entra en el viewport.
 * Usa IntersectionObserver (cross-browser) en vez de animation-timeline (solo Chromium).
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
) {
  const ref = useRef<T>(null);
  const thresholdRef = useRef(threshold);
  thresholdRef.current = threshold;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si reduced-motion, no animar
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealSection(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: thresholdRef.current },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
