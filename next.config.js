/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...(process.env.NODE_ENV === "production" && {
    compiler: {
      removeConsole: {
        exclude: ["error"],
      },
    },
  }),

  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  transpilePackages: ["react-tweet"],
};

module.exports = nextConfig;
