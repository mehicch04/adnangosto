import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async redirects() {
    return [
      {
        source: "/prijava/klasicni-coaching",
        destination: "/prijava/online-coaching",
        permanent: true,
      },
      {
        source: "/prijava/edukacija-za-trenere",
        destination: "/prijava/coaching-i-edukacija",
        permanent: true,
      },
      { source: "/paketi", destination: "/#saradnja", permanent: false },
      { source: "/prijava", destination: "/#saradnja", permanent: false },
    ];
  },
};

export default nextConfig;
