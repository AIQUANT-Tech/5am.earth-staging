/**
 * `sizes` values for next/image.
 *
 * Without `sizes`, next/image emits a 1x/2x srcset based on the declared
 * `width` prop — which for these collages is the full source width, so every
 * viewport downloads the largest variant. Telling it the real CSS layout width
 * lets the browser pick from the ladder in lib/imageLoader.ts instead.
 *
 * Reference points from app/globals.css:
 *   .wrap          = min(1280px, 100vw - 48px), and 100vw - 28px below 560px
 *   two-column grids (.hero-grid, .inner-hero-grid, .case-grid, .field-photos)
 *                  collapse to one column at 900px
 *
 * Slight over-estimates are deliberate: too large only costs the next rung up,
 * too small renders visibly soft.
 */

/** Image spans the full content column — e.g. `.infographic-figure`. */
export const SIZES_FULL =
  "(max-width: 560px) calc(100vw - 28px), (max-width: 1328px) calc(100vw - 48px), 1280px";

/** Image sits in one half of a two-column grid — hero art, case media. */
export const SIZES_HALF =
  "(max-width: 560px) calc(100vw - 28px), (max-width: 900px) calc(100vw - 48px), 640px";
