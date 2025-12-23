// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export", // 👈 Disabled to support Server Actions/API Routes for Database
  // trailingSlash: true, // 👈 ensures relative path routing works on GitHub Pages
  images: {
    unoptimized: true, // 👈 Avoid using Next.js Image optimization (not supported in static export)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // basePath: isProd ? "/my-portfolio" : "", // 👈 your repo name here
  // assetPrefix: isProd ? "/my-portfolio/" : "",
};

export default nextConfig;