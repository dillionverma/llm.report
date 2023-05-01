import Meta from "@/components/Meta";
import SettingsModal, { DialogProvider } from "@/components/SettingsModal";
import "@/styles/globals.css";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      {/* <!-- Google tag (gtag.js) --> */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-YWRE5VL6F8"
        strategy="afterInteractive"
      ></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-YWRE5VL6F8');
          `}
      </Script>

      <Script id="crisp-chat">
        {`
          window.$crisp=[];window.CRISP_WEBSITE_ID="81153c9f-1d41-4e46-9742-a579fc85b458";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
        `}
      </Script>

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
        <SettingsModal />
      </DialogProvider>
    </SessionProvider>
  );
}
