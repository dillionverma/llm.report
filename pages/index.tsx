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
          <motion.section
            initial="hidden"
            whileInView="show"
            animate="show"
            variants={{
              hidden: { opacity: 0, y: 100 },
              show: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.5,
                  duration: 1,
                },
              },
            }}
          >
            <Dashboard />
          </motion.section>
          {/* <TrustedBy /> */}
          <Testimonials />
        </>
      )}
    </>
  );
}
