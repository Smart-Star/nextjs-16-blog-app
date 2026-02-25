import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "ceaseless-zebra-651.convex.cloud",
        protocol: "https",
        port: "",
      },
      {
        hostname: "wry-anaconda-338.eu-west-1.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
