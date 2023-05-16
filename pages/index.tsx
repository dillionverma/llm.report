import FeatureGrid from "@/components/landing/FeatureGrid";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import Dashboard from "../components/dashboard";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      {session?.user ? (
        <Suspense fallback={<></>}>
          <Dashboard />
        </Suspense>
      ) : (
        <Suspense fallback={<></>}>
          <Hero />
          {/* <Dashboard /> */}
          {/* <TrustedBy /> */}
          <FeatureGrid />
          <Testimonials />
        </Suspense>
      )}
    </>
  );
}
