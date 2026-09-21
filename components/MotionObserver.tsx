"use client";

import { useEffect } from "react";

// Scroll-reveal is no longer set up here - it moved to an inline script at the
// end of <body> (see REVEAL_SCRIPT in app/layout.tsx) so that content hidden by
// `html.js ...:not(.in-view)` is not waiting on the React bundle to hydrate.
// This component now only drives the number count-up, which is decorative and
// can safely wait.
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
      ? value.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
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
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const countTargets = Array.from(document.querySelectorAll(COUNT_SELECTOR));

    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    countTargets.forEach((el) => countObserver.observe(el));

    return () => {
      countObserver.disconnect();
    };
  }, []);

  return null;
}
