/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize HeroUI imports
  transpilePackages: ["@heroui/react", "@heroui/styles"],

  // Fix workspace root warning
  outputFileTracingRoot: import.meta.dirname,

  // React 19 compiler
  reactCompiler: true,

  // Optimize bundle size
  experimental: {
    optimizePackageImports: ["@heroui/react", "react-icons", "framer-motion"],
  },

  // Image optimization for Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
