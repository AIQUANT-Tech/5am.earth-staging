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
  basePath: "/5am.earth-staging",
  assetPrefix: "/5am.earth-staging/",
  trailingSlash: true,
};
export default nextConfig;
