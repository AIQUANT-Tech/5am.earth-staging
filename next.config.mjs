/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
  basePath: "/5am.earth-staging",
  assetPrefix: "/5am.earth-staging/",
  trailingSlash: true,
};
export default nextConfig;
