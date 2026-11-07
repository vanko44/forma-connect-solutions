import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SCROLL_ANIMATION_DEFAULTS } from "@/hooks/use-scroll-animation";

/** One observer for the page; never conceal forms, long sections or documents. */
export function PageMotion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const tracked = new Set<HTMLElement>();
    const hero = main.querySelector<HTMLElement>("[data-parallax]");
    const reveal = (element: HTMLElement) => {
      element.dataset.visible = "true";
      observer?.unobserve(element);
    };
    const discover = () => {
      if (media.matches || !observer) return;
      main.querySelectorAll<HTMLElement>(
        ".reveal, .scroll-reveal, .media-reveal, .service-card, section .eyebrow, section h2, section article",
      ).forEach((element) => {
        if (tracked.has(element) || element.closest(".forma-offer, [role=dialog], form, [data-motion]")) return;
        // Above-the-fold content stays instantly available; large blocks stay visible.
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 || rect.height > window.innerHeight * 0.8) return;
        const index = Array.from(element.parentElement?.children ?? []).indexOf(element);
        element.dataset.motion = element.classList.contains("media-reveal") ? "scale" : "up";
        element.dataset.visible = "false";
        element.style.setProperty("--reveal-delay", `${index >= 0 && index < 8 ? index * 100 : 0}ms`);
        tracked.add(element);
        observer.observe(element);
      });
    };
    const updateScroll = () => {
      frame = 0;
      if (media.matches) return;
      const depth = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = depth > 0 ? Math.min(1, Math.max(0, window.scrollY / depth)) : 0;
      if (progress.current) progress.current.style.transform = `scaleX(${ratio})`;
      if (hero) {
        const offset = Math.min(20, Math.max(-20, window.scrollY * 0.04 - 20));
        hero.style.transform = `translate3d(0, ${offset}px, 0) scale(1.04)`;
      }
    };
    const scheduleScroll = () => { if (!frame) frame = requestAnimationFrame(updateScroll); };
    const setup = () => {
      observer?.disconnect();
      tracked.forEach((element) => { element.removeAttribute("data-motion"); element.removeAttribute("data-visible"); });
      tracked.clear();
      if (hero) hero.style.removeProperty("transform");
      if (media.matches || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) reveal(entry.target as HTMLElement); });
      }, { threshold: SCROLL_ANIMATION_DEFAULTS.threshold, rootMargin: SCROLL_ANIMATION_DEFAULTS.rootMargin });
      discover();
      scheduleScroll();
    };
    setup();
    // Discover async-loaded content without observing animation attribute changes.
    const mutations = new MutationObserver(discover);
    mutations.observe(main, { childList: true, subtree: true });
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) {
        const parent = event.target.closest<HTMLElement>("[data-motion]");
        if (parent) reveal(parent);
      }
    };
    main.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", scheduleScroll, { passive: true });
    window.addEventListener("resize", scheduleScroll);
    media.addEventListener("change", setup);
    return () => {
      observer?.disconnect(); mutations.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleScroll);
      window.removeEventListener("resize", scheduleScroll);
      main.removeEventListener("focusin", onFocus);
      media.removeEventListener("change", setup);
      tracked.forEach((element) => { element.removeAttribute("data-motion"); element.removeAttribute("data-visible"); });
      hero?.style.removeProperty("transform");
    };
  }, [pathname]);
  return <div ref={progress} className="reading-progress" aria-hidden="true" />;
}