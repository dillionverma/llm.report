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
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "https://docs.llm.report",
        permanent: true,
      },
      {
        source: "/discord",
        destination: "https://discord.gg/eVtDPmRWXm",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  transpilePackages: ["react-tweet"],
};

module.exports = nextConfig;
