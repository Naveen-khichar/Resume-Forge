import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Preserve original dev origin configurations at root level
  allowedDevOrigins: ["172.16.0.2"],
} as any;

export default nextConfig;
