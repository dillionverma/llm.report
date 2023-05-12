import FeatureGrid from "@/components/landing/FeatureGrid";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import { useSession } from "next-auth/react";
import Dashboard from "../components/dashboard";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      {session?.user ? (
        <Dashboard />
      ) : (
        <>
          <Hero />
          {/* <Dashboard /> */}
          {/* <TrustedBy /> */}
          <FeatureGrid />
          <Testimonials />
        </>
      )}
    </>
  );
}
