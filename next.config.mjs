/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";
import TerserPlugin from "terser-webpack-plugin";

const isProd = process.env.NODE_ENV === "production";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = bundleAnalyzer({
  compress: true,
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_UPLOADTHING_APP_ID}/*`,
      },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ["image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
  webpack(config, { isServer }) {
    if (isProd && !isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: true,
              passes: 2,
            },
            mangle: true,
          },
          extractComments: false,
        })
      );
    }
    return config;
  },
});

export default nextConfig;
