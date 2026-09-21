// Empty for production (5am.earth serves from the domain root); the staging
// workflow sets NEXT_PUBLIC_BASE_PATH=/5am.earth-staging because GitHub Pages
// serves that repo from a sub-path. Keep it in step with lib/imageLoader.ts,
// which reads the same variable for client-side asset URLs.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    // Widths next/image is allowed to put in a srcset. These must match the
    // ladder that scripts/optimize-images.py generates and that
    // lib/imageLoader.ts maps onto, otherwise the srcset points at files that
    // do not exist.
    deviceSizes: [420, 640, 828, 1280],
    // Kept to a single small rung: anything smaller just duplicates the 420w
    // file under a misleading descriptor, since no `sizes` on this site ever
    // resolves below ~330px.
    imageSizes: [256],
  },
  basePath: BASE_PATH,
  // undefined rather than "/" - Next treats a bare "/" as a real prefix and
  // emits double slashes in asset URLs.
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : undefined,
  trailingSlash: true,
};
export default nextConfig;
