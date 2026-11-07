import { useEffect, useRef, useState } from "react";

export interface ScrollAnimationOptions {
  threshold?: number;
  once?: boolean;
  delay?: number;
}

export const SCROLL_ANIMATION_DEFAULTS = {
  threshold: 0.2,
  rootMargin: "0px 0px -10% 0px",
  once: true,
};

/** Visible before hydration and whenever reduced motion is requested. */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>({
  threshold = SCROLL_ANIMATION_DEFAULTS.threshold,
  once = true,
  delay = 0,
}: ScrollAnimationOptions = {}) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (media.matches || !("IntersectionObserver" in window)) {
        element.removeAttribute("data-motion");
        setIsInView(true);
        return;
      }
      element.dataset.motion = element.dataset.motion || "up";
      element.style.setProperty("--reveal-delay", `${Math.max(0, delay)}ms`);
      observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        setIsInView(entry.isIntersecting);
        element.dataset.visible = String(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasAnimated(true);
          if (once) observer?.unobserve(element);
        }
      }, { threshold, rootMargin: SCROLL_ANIMATION_DEFAULTS.rootMargin });
      observer.observe(element);
    };
    setup();
    media.addEventListener("change", setup);
    return () => { observer?.disconnect(); media.removeEventListener("change", setup); };
  }, [threshold, once, delay]);

  return { ref, isInView, hasAnimated };
}