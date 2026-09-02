import { animate, stagger } from "animejs";

/** Check if user prefers reduced motion */
function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** Animación de entrada para el masthead (título + metadata) */
export function animateMasthead() {
  if (prefersReducedMotion()) return;
  animate(".masthead-link", {
    opacity: [0, 1],
    scale: [0.96, 1],
    duration: 500,
    ease: "outExpo",
  });
  animate(".masthead-cols", {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 400,
    delay: 150,
    ease: "outQuad",
  });
}

/** Animación stagger para grids de cards */
export function revealCards(selector: string | Element[]) {
  if (prefersReducedMotion()) {
    // Make elements visible immediately
    const els =
      typeof selector === "string"
        ? document.querySelectorAll<HTMLElement>(selector)
        : selector;
    for (const el of els) {
      if (el instanceof HTMLElement) el.style.opacity = "1";
    }
    return;
  }
  animate(selector, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 450,
    delay: stagger(70),
    ease: "outQuad",
  });
}

/** Animación de una sección al entrar en viewport */
export function revealSection(el: HTMLElement) {
  if (prefersReducedMotion()) return;
  animate(el, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 400,
    ease: "outQuad",
  });
}

/** Animación del edition header al cambiar de edición */
export function animateEditionHead() {
  if (prefersReducedMotion()) return;
  animate(".edition-head", {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 350,
    ease: "outQuad",
  });
}
