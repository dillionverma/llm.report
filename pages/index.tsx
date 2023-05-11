import CTA from "@/components/landing/CTA";
import ChartFeature from "@/components/landing/ChartFeature";
import Testimonials from "@/components/landing/Testimonials";
import { motion } from "framer-motion";
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
          {/* <TrustedBy /> */}
          <motion.div
            className="rounded-lg p-4 border"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-lg shadow-lg"
              src="/demo.mp4"
            ></video>
          </motion.div>
          <ChartFeature />
          <Testimonials />
        </>
      )}
    </>
  );
}
