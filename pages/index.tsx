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
            // initial={{ opacity: 0, y: 100 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ duration: 1, delay: 0.5 }}
          >
            <Dashboard />
          </motion.div>
          <ChartFeature />
          <Testimonials />
        </>
      )}
    </>
  );
}
