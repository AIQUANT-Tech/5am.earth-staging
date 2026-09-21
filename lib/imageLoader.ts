// Same source of truth as next.config.mjs. The NEXT_PUBLIC_ prefix is load
// bearing: this module runs in the browser, so the value has to be inlined at
// build time rather than read from the environment at runtime.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Keep in sync with LADDER in scripts/optimize-images.py and `deviceSizes` in
// next.config.mjs.
const LADDER = [420, 640, 828, 1280];

// Only these directories have a pre-generated width ladder. Everything else
// (the /img logos, remote partner logos) is served as-is.
const RESPONSIVE_DIR = /^\/(collage|uploads)\/(.+)\.webp$/;

// Prefixes a site-root asset path with the Pages basePath. next/image handles
// this through the loader below; raw <img>/<a> tags call asset() directly.
export function asset(src: string) {
  if (/^https?:\/\//.test(src)) return src;
  return `${BASE_PATH}${src}`;
}

/**
 * next.config.mjs sets `output: "export"`, so Next does no image optimization
 * of its own - this loader is the whole pipeline. It maps the width next/image
 * asks for onto the nearest pre-generated variant, which is what turns the
 * emitted `srcset` into a real responsive image instead of the same file
 * repeated at 1x/2x.
 *
 * Widths above the ladder clamp to the largest variant, which the generator
 * caps at the source width - so we never serve an upscale.
 */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (/^https?:\/\//.test(src)) return src;

  const match = src.match(RESPONSIVE_DIR);
  if (!match) return asset(src);

  const [, dir, name] = match;
  const chosen = LADDER.find((w) => w >= width) ?? LADDER[LADDER.length - 1];
  return asset(`/${dir}/${name}-${chosen}w.webp`);
}
