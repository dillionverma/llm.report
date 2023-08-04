// app/providers.tsx
"use client";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  posthog.init("phc_9bFbacVl5VErRxnadh05Rt2Kv8ccYWFgaVtmfjAek60", {
    api_host: "https://app.posthog.com",
  });
}

export function PostHogPageview(): JSX.Element {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (session?.user) {
      posthog.identify(session?.user.id, {
        email: session?.user.email,
        name: session?.user.name,
      });
    }
  }, [session?.user]);

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <></>;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
