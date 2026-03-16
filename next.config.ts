import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "cdn.simpleicons.org", pathname: "/**" },
      { protocol: "https", hostname: "readme.lk", pathname: "/**" },
      {
        protocol: "https",
        hostname: "scontent-sjc3-1.xx.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
