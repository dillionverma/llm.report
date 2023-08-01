"use client";

import FeatureGrid from "@/components/landing/FeatureGrid";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { Tweet } from "react-tweet/api";

export default function LandingPage({ tweets }: { tweets: Tweet[] }) {
  const { status } = useSession();
  return (
    <Suspense fallback={<></>}>
      {status === "unauthenticated" && (
        <>
          <Hero />
          {/* <Dashboard /> */}
          {/* <TrustedBy /> */}
          <FeatureGrid />
          <Testimonials tweets={tweets} />
        </>
      )}
    </Suspense>
  );
}
