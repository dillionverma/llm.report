import Meta from "@/components/Meta";
import SignInModal, { DialogProvider } from "@/components/SignInModal";
import "@/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <DialogProvider>
        <Meta />
        <Component {...pageProps} />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              maxWidth: 500,
            },
          }}
        />
        <SignInModal />
      </DialogProvider>
    </SessionProvider>
  );
}
