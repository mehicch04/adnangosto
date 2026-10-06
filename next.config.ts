import type { NextConfig } from "next";

// Slike iz Supabase Storage-a (transformacije, sponzori) prolaze kroz next/image,
// koji ih smanji i pretvori u moderni format. Za to Next mora znati da je domena sigurna.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  images: {
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
};

export default nextConfig;
