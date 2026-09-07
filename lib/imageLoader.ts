const BASE_PATH = "/5am.earth-staging";

export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (/^https?:\/\//.test(src)) return src;
  return `${BASE_PATH}${src}`;
}
