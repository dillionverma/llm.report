import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      name: string | null | undefined;
      email: string;
      image?: string | null | undefined;
      isAdmin: boolean;
    };
  }
}
