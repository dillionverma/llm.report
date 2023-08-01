import FeatureGrid from "@/components/landing/FeatureGrid";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Tweet } from "react-tweet/api";

export default function LandingPage({ tweets }: { tweets: Tweet[] }) {
  return (
    <Suspense fallback={<></>}>
      <Hero />
      {/* <Dashboard /> */}
      {/* <TrustedBy /> */}
      <FeatureGrid />
      <Testimonials tweets={tweets} />
      {/* Top Ellipse Gradient */}
      <div className="pointer-events-none absolute inset-0 h-screen dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
      {/* Grid Pattern */}
      <GridPattern
        width={80}
        height={80}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-screen w-screen fill-black/10 stroke-black/10 dark:fill-white/90 dark:stroke-white/90",
          "-z-50 [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
          "inset-x-0 -top-[1rem] -z-50 h-[80%] skew-y-12"
        )}
      />
      {/* Linear Gradient */}
      {/* <LinearGradient
        className="h-screen w-screen"
        from="rgba(120,119,198,0.1)"
        to="rgba(0,0,0,0.0)"
        direction="bottom right"
      /> */}
    </Suspense>
  );
}
