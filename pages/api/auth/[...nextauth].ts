import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
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
        isAdmin: user.isAdmin,
      };
      return Promise.resolve(session);
    },
  },
  events: {
    createUser: async (message) => {
      if (process.env.NODE_ENV !== "production") return;
      // await axios.post(
      //   "https://hooks.slack.com/services/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",
      //   {
      //     text: `${message.user.email} just signed up! 🎉`,
      //   }
      // );
    },
  },
};

export default NextAuth(authOptions);
