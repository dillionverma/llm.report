import CTA from "@/components/landing/CTA";
import ChartFeature from "@/components/landing/ChartFeature";
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
          <CTA />
          {/* <Dashboard /> */}
          {/* <TrustedBy /> */}
          <ChartFeature />
          <Testimonials />
        </>
      )}
    </>
  );
}
