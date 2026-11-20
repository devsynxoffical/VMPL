import type { NextConfig } from "next";

// Static export for Hostinger (shared hosting): `npm run build` writes the
// whole site to ./out — upload its contents to public_html.
// Cache headers live in public/.htaccess (next.config headers() is not
// supported with static export).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
