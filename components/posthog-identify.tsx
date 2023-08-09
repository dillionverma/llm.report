"use client";
import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

// const posthogEnabled = env.NEXT_PUBLIC_POSTHOG_API_KEY && env.NEXT_PUBLIC_POSTHOG_API_HOST;

export default function PosthogIdentify() {
  const posthog = usePostHog();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    if (session.user && posthog) {
      posthog.identify(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
      // if (session.user.teams?.length > 0) {
      //   posthog?.group("team", session.user.teams[0].id);
      // }
    }
  }, [session, posthog]);

  return null;
}
