import OnboardingDashboard from "@/components/OnboardingDashboard";
import FeatureGrid from "@/components/landing/FeatureGrid";
import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/services/openai";
import useLocalStorage from "@/lib/use-local-storage";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import Dashboard from "../components/dashboard";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [validKey, setValidKey] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [session]);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY, "", true);
  useEffect(() => {
    (async () => setValidKey(await openai.isValidKey(key)))();
  }, [key]);

  return (
    <Suspense fallback={<></>}>
      <>
        {status === "authenticated" && session?.user && (
          <>
            {(!key || !validKey) && <OnboardingDashboard />}
            {key && validKey && <Dashboard key={key} />}
          </>
        )}
        {status === "unauthenticated" && (
          <>
            <Hero />
            {/* <Dashboard /> */}
            {/* <TrustedBy /> */}
            <FeatureGrid />
            <Testimonials />
          </>
        )}
      </>
    </Suspense>
  );
}
