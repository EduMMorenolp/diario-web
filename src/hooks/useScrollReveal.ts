import { useEffect, useRef } from "react";
import { revealSection } from "../lib/animations";

type RevealFn = (el: HTMLElement) => void;

/**
 * Hook que revela un elemento con animación cuando entra en el viewport.
 * Usa IntersectionObserver (cross-browser) en vez de animation-timeline (solo Chromium).
 *
 * @param threshold  — % de visibilidad requerido (default 0.12)
 * @param animateFn — función de animación custom (default: revealSection de anime.js)
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.02,
  animateFn?: RevealFn,
) {
  const ref = useRef<T>(null);
  const thresholdRef = useRef(threshold);
  thresholdRef.current = threshold;

  const animateFnRef = useRef(animateFn);
  animateFnRef.current = animateFn;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si reduced-motion, no animar
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const fn = animateFnRef.current ?? revealSection;
            fn(entry.target as HTMLElement);
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
