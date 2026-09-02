import { animate, createTimeline, stagger } from "animejs";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if user prefers reduced motion */
function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/** Make elements immediately visible (fallback for reduced-motion) */
function showImmediately(selector: string | Element[]) {
  const els =
    typeof selector === "string" ? document.querySelectorAll<HTMLElement>(selector) : selector;
  for (const el of els) {
    if (el instanceof HTMLElement) {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  }
}

// ---------------------------------------------------------------------------
// 1. Masthead — timeline con clip-path reveal + dot pulse
// ---------------------------------------------------------------------------

/** Animated masthead entrance: title clips in, tagline slides, dot pulses */
export function animateMasthead() {
  if (prefersReducedMotion()) return;

  const tl = createTimeline({
    defaults: { ease: "outExpo" },
  });

  // Title: scale + opacity
  tl.add(".masthead-link", {
    opacity: [0, 1],
    scale: [0.92, 1],
    duration: 700,
  });

  // Tagline + date: staggered fade + slide from below
  tl.add(
    ".masthead-cols",
    {
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 500,
    },
    "-=400",
  );

  // Accent dot: pulse glow (loop)
  pulseAccentDot();
}

/** Continuous subtle pulse on the masthead accent dot */
export function pulseAccentDot() {
  if (prefersReducedMotion()) return;
  // The pseudo-element can't be directly targeted by anime.js,
  // so we animate the masthead-link glow via a wrapper-safe approach
  animate(".masthead-link", {
    filter: [
      "drop-shadow(0 0 0px transparent)",
      "drop-shadow(0 0 6px var(--color-accent))",
      "drop-shadow(0 0 0px transparent)",
    ],
    duration: 3000,
    loop: true,
    ease: "inOutSine",
  });
}

// ---------------------------------------------------------------------------
// 2. Edition head — elastic slide
// ---------------------------------------------------------------------------

/** Animación del edition header al cambiar de edición */
export function animateEditionHead() {
  if (prefersReducedMotion()) return;

  const tl = createTimeline({
    defaults: { ease: "outBack" },
  });

  tl.add(".edition-head .section-label", {
    opacity: [0, 1],
    translateX: [-20, 0],
    duration: 500,
  });

  tl.add(
    ".edition-briefing",
    {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 400,
      ease: "outQuad",
    },
    "-=300",
  );
}

// ---------------------------------------------------------------------------
// 3. Featured lead card — "emerge" effect
// ---------------------------------------------------------------------------

/** Lead card: scale up + fade + subtle shadow growth */
export function revealLeadCard(selector: string | HTMLElement) {
  if (prefersReducedMotion()) {
    showImmediately(typeof selector === "string" ? selector : [selector]);
    return;
  }

  animate(selector, {
    opacity: [0, 1],
    scale: [0.97, 1],
    duration: 600,
    ease: "outQuad",
  });
}

// ---------------------------------------------------------------------------
// 4. Cards grid — alternating-origin stagger
// ---------------------------------------------------------------------------

/** Animación stagger para grids de cards con orígenes alternados */
export function revealCards(selector: string | Element[]) {
  if (prefersReducedMotion()) {
    showImmediately(selector);
    return;
  }

  const els =
    typeof selector === "string"
      ? Array.from(document.querySelectorAll<HTMLElement>(selector))
      : selector;

  if (els.length === 0) return;

  animate(els, {
    opacity: [0, 1],
    translateY: [24, 0],
    translateX: [-12, 0],
    scale: [0.97, 1],
    duration: 500,
    delay: stagger(80, { from: "first", ease: "outQuad" }),
    ease: "outQuad",
  });
}

/** Simple stagger reveal for compact cards (sidebar) */
export function revealCompactCards(selector: string | Element[]) {
  if (prefersReducedMotion()) {
    showImmediately(selector);
    return;
  }

  animate(selector, {
    opacity: [0, 1],
    translateX: [16, 0],
    duration: 400,
    delay: stagger(60),
    ease: "outQuad",
  });
}

// ---------------------------------------------------------------------------
// 5. Section group titles — animated rule line
// ---------------------------------------------------------------------------

/** Animate the section title + its decorative ::after line */
export function animateSectionTitle(el: HTMLElement) {
  if (prefersReducedMotion()) return;

  const tl = createTimeline({ defaults: { ease: "outQuad" } });

  tl.add(el, {
    opacity: [0, 1],
    translateX: [-12, 0],
    duration: 400,
  });

  // Animate the ::after pseudo-line via the element's clip-path
  // Since we can't directly animate ::after, we use the element itself
  // The line growth is handled by CSS animation on reveal
}

// ---------------------------------------------------------------------------
// 6. Generic section reveal (IntersectionObserver callback)
// ---------------------------------------------------------------------------

/** Animación de una sección al entrar en viewport */
export function revealSection(el: HTMLElement) {
  if (prefersReducedMotion()) return;
  animate(el, {
    opacity: [0, 1],
    translateY: [20, 0],
    duration: 500,
    ease: "outQuad",
  });
}

// ---------------------------------------------------------------------------
// 7. Footer reveal
// ---------------------------------------------------------------------------

export function animateFooter() {
  if (prefersReducedMotion()) return;

  const footer = document.querySelector(".site-footer");
  if (!footer) return;

  const tl = createTimeline({
    defaults: { ease: "outQuad" },
  });

  tl.add(".footer-word", {
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 500,
  });

  tl.add(
    ".site-footer p",
    {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 400,
    },
    "-=300",
  );
}

// ---------------------------------------------------------------------------
// 8. Article page entry
// ---------------------------------------------------------------------------

export function animateArticleEntry() {
  if (prefersReducedMotion()) return;

  const tl = createTimeline({
    defaults: { ease: "outQuad" },
  });

  tl.add(".article-head .kicker", {
    opacity: [0, 1],
    translateX: [-10, 0],
    duration: 350,
  });

  tl.add(
    ".article-title",
    {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 500,
      ease: "outExpo",
    },
    "-=200",
  );

  tl.add(
    ".article-dek",
    {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 400,
    },
    "-=350",
  );

  tl.add(
    ".article-head .byline",
    {
      opacity: [0, 1],
      duration: 300,
    },
    "-=250",
  );

  tl.add(
    ".article-cover",
    {
      opacity: [0, 1],
      scale: [0.98, 1],
      duration: 600,
    },
    "-=200",
  );

  tl.add(
    ".article-body",
    {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
    },
    "-=400",
  );

  tl.add(
    ".article-rail",
    {
      opacity: [0, 1],
      translateX: [16, 0],
      duration: 400,
    },
    "-=400",
  );
}

// ---------------------------------------------------------------------------
// 9. Kicker lines — animate from 0 to full width
// ---------------------------------------------------------------------------

/** Add .is-visible class to kickers in viewport to trigger CSS line anim */
export function revealKickers(container?: HTMLElement) {
  const root = container ?? document;
  const kickers = root.querySelectorAll<HTMLElement>(".kicker:not(.is-visible)");
  for (const k of kickers) {
    k.classList.add("is-visible");
  }
}

// ---------------------------------------------------------------------------
// 10. Page transitions
// ---------------------------------------------------------------------------

/** Fade out the main content before navigation */
export function pageTransitionOut(): Promise<void> {
  if (prefersReducedMotion()) return Promise.resolve();
  const main = document.querySelector("main");
  if (!main) return Promise.resolve();

  return new Promise((resolve) => {
    animate(main, {
      opacity: [1, 0],
      translateY: [0, -6],
      duration: 150,
      ease: "inQuad",
      onComplete: () => resolve(),
    });
  });
}

/** Fade in the main content after navigation */
export function pageTransitionIn() {
  if (prefersReducedMotion()) return;
  const main = document.querySelector("main");
  if (!main) return;

  animate(main, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 300,
    ease: "outQuad",
  });
}
