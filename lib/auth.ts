import { env } from "@/env.mjs";
import prisma from "@/lib/prisma";
import { sendVerificationRequest } from "@/lib/resend/emails/sendVerificationRequest";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    EmailProvider({
      type: "email",
      server: "",
      from: env.RESEND_FROM_ADDRESS,
      sendVerificationRequest,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Only enable credentials auth in development mode
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: {
                label: "Username",
                type: "email",
                placeholder: "johndoe@gmail.com",
              },
              password: { label: "Password", type: "password" },
            },
            async authorize(
              credentials: Record<"email" | "password", string> | undefined,
              req
            ) {
              if (credentials === undefined) return null;
              const existingUser = await prisma?.user.findUnique({
                where: { email: credentials.email.toLowerCase() },
              });

              if (!existingUser) return null;

              const isValid = credentials.password === existingUser.password;

              if (!isValid) return null;

              return existingUser;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma?.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
  events: {
    signIn: async ({ profile, account, user }) => {
      if (account?.provider === "github" && profile) {
        const res = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `token ${account.access_token}` },
        });

        const emails = await res.json();

        if (emails?.length > 0) {
          profile.email = emails.sort(
            (a: any, b: any) => b.primary - a.primary
          )[0].email;

          const updatedUser = await prisma?.user.upsert({
            where: { id: user.id },
            update: {
              email: profile.email,
            },
            create: {
              email: profile.email,
            },
          });
        }
      }
    },
    createUser: async (message) => {
      // await createOrRetrieveCustomer({
      //   uuid: message.user.id as string,
      //   email: message.user.email || "",
      // });

      if (process.env.NODE_ENV !== "production") return;
      await axios.post(
        "https://hooks.slack.com/services/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",
        {
          text: `${message.user.email} just signed up! 🎉`,
        }
      );
    },
  },
};
