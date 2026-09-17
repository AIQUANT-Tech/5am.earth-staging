const BASE_PATH = "/5am.earth-staging";

// Prefixes a site-root asset path with the Pages basePath. next/image handles
// this through the loader below; raw <img>/<a> tags call asset() directly.
export function asset(src: string) {
  if (/^https?:\/\//.test(src)) return src;
  return `${BASE_PATH}${src}`;
}

export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  return asset(src);
}
