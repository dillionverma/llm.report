import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import axios from "axios";
import { NextAuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { sendWebVerificationRequest } from "./resend/emails/sendVerificationRequest";
import { PrismaClient } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    EmailProvider({
      name: "email",
      type: "email",
      id: "email",
      server: "",
      from: process.env.RESEND_WEB_EMAIL_ADDRESS,
      sendVerificationRequest: sendWebVerificationRequest,
    }),
    ...(process.env.NODE_ENV === "development"
      ? [
          CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              email: {
                label: "Username",
                type: "email",
                placeholder: "jsmith@gmail.com",
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

              const isValid = await bcrypt.compare(
                credentials.password,
                existingUser.password
              );

              // const res = await fetch("/your/endpoint", {
              //   method: "POST",
              //   body: JSON.stringify(credentials),
              //   headers: { "Content-Type": "application/json" },
              // });
              // const user = await res.json();

              // If no error and we have user data, return it
              if (res.ok && user) {
                return user;
              }
              // Return null if user data could not be retrieved
              return null;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    session: async ({
      session,
      user,
    }: {
      session: Session;
      user: AdapterUser;
    }) => {
      session.user = {
        ...session.user,
        id: user.id,
        // @ts-ignore
        isAdmin: user.role === "ADMIN",
      };
      return Promise.resolve(session);
    },
  },
  events: {
    signIn: async ({ profile, account, user }) => {
      console.log("SIGN IN", profile, account, user);
      if (account?.provider === "github" && profile) {
        const res = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `token ${account.access_token}` },
        });

        const emails = await res.json();

        if (emails?.length > 0) {
          profile.email = emails.sort(
            (a: any, b: any) => b.primary - a.primary
          )[0].email;

          const updatedUser = await prisma.user.upsert({
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
