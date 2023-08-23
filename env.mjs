import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),

    DATABASE_URL: z.string().min(1),

    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GITHUB_ACCESS_TOKEN: z.string().optional(),

    STRIPE_API_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),

    RESEND_WEB_EMAIL_ADDRESS: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
  },
  client: {
    // NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_API_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },
  experimental__runtimeEnv: {},
  // runtimeEnv: {
  //   NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  //   NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

  //   GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  //   GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  //   GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  //   GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  //   GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,

  //   DATABASE_URL: process.env.DATABASE_URL,
  //   STRIPE_API_KEY: process.env.STRIPE_API_KEY,
  //   STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  //   NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  // },
});
