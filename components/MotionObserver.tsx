"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".cell",
  ".stat-cell",
  ".team-card",
  ".quote-block",
  ".pilot-band",
  ".partner-logos > div",
  ".field-photos figure",
  ".section-head",
  ".case-media",
  ".infographic-figure",
  ".outcome-grid > div",
].join(", ");

const COUNT_SELECTOR = ".stat-cell strong, .pilot-stats b";

function animateCount(el: Element) {
  const raw = el.textContent?.trim() ?? "";
  const match = raw.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return;
  const [, numStr, suffix] = match;
  const target = parseFloat(numStr.replace(/,/g, ""));
  if (Number.isNaN(target)) return;
  const decimals = (numStr.split(".")[1] || "").length;
  const hasGrouping = numStr.replace(/[.\d]/g, "").length > 0;

  const duration = 1100;
  const start = performance.now();

  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    const formatted = hasGrouping
      ? value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : value.toFixed(decimals);
    el.textContent = formatted + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = numStr + suffix;
    }
  }
  requestAnimationFrame(tick);
}

export default function MotionObserver() {
  useEffect(() => {
    // The `js` class itself is added synchronously by an inline script in
    // <head> (see layout.tsx) so reveal-hidden content is never visible
    // before this effect runs — this only wires up the observers.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealTargets = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
    const countTargets = Array.from(document.querySelectorAll(COUNT_SELECTOR));

    if (reduceMotion) {
      revealTargets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    countTargets.forEach((el) => countObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      countObserver.disconnect();
    };
  }, []);

  return null;
}
