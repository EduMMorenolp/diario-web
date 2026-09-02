import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { pageTransitionIn } from "../lib/animations";

/**
 * Hook que aplica una animación fade-in al contenido de <main>
 * cada vez que cambia la ruta. La transición es rápida (300ms)
 * y se desactiva automáticamente con prefers-reduced-motion.
 */
export function usePageTransition() {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers route-change animation
  useEffect(() => {
    // Skip the first render (the masthead animation handles the initial load)
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // Scroll to top and animate in
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    pageTransitionIn();
  }, [pathname]);
}
