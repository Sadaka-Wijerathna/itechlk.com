"use client";
import { useEffect, useRef } from "react";

/**
 * useSlickInert
 *
 * Fixes the WCAG 2.1 SC 4.1.2 / aria-hidden-focus violation produced by
 * react-slick: hidden slides have aria-hidden="true" but their descendant
 * links/buttons remain focusable.
 *
 * Attaches a MutationObserver to the slider container and keeps `inert`
 * in sync with `aria-hidden` on every .slick-slide - including cloned
 * slides that react-slick adds for infinite looping.
 *
 * Usage:
 *   const containerRef = useSlickInert();
 *   <div ref={containerRef}><Slider ...>...</Slider></div>
 */
export function useSlickInert() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function syncInert() {
      container!.querySelectorAll<HTMLElement>(".slick-slide").forEach((slide) => {
        slide.inert = slide.getAttribute("aria-hidden") === "true";
      });
    }

    // Run once immediately (slides may already be rendered)
    syncInert();

    // Watch for aria-hidden toggling by react-slick on any descendant
    const observer = new MutationObserver(syncInert);
    observer.observe(container, {
      subtree: true,
      attributeFilter: ["aria-hidden"],
    });

    return () => observer.disconnect();
  }, []);

  return containerRef;
}