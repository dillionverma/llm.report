"use client";

import Script from "next/script";

export function CrispChat() {
  return (
    <Script id="crisp-chat">
      {`
  window.$crisp=[];window.CRISP_WEBSITE_ID="81153c9f-1d41-4e46-9742-a579fc85b458";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
`}
    </Script>
  );
}
