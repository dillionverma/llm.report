"use client";

import Script from "next/script";
import posthog from "posthog-js";

posthog.init("phc_9bFbacVl5VErRxnadh05Rt2Kv8ccYWFgaVtmfjAek60", {
  api_host: "https://app.posthog.com",
});

export function Analytics() {
  return (
    <>
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
    </>
  );
}
