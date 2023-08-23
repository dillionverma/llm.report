/** @type {import('next').NextConfig} */

require("dotenv").config({ path: "./.env" });

if (!process.env.NEXTAUTH_SECRET)
  throw new Error(
    "Please set NEXTAUTH_SECRET in your .env file. Use `openssl rand -base64 32` to generate a secret."
  );
if (process.env.VERCEL_URL && !process.env.NEXT_PUBLIC_SITE_URL) {
  // this means into a preview deployment
  process.env.NEXT_PUBLIC_SITE_URL = "https://" + process.env.VERCEL_URL;
}

process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
console.log("NEXTAUTH_URL", process.env.NEXTAUTH_URL);

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
      {
        source: "/star",
        destination: "https://github.com/dillionverma/llm.report",
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
