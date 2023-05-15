import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      // type: "ease",
      // type: "ease",
    },
  },
  out: {
    opacity: 0,
    scale: 0.99,
    transition: {
      duration: 0.2,
      // type: "ease",
      // type: "ease",
    },
  },
};

export const Transition = ({ children }: { children: ReactNode }) => {
  const { asPath } = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={asPath}
        variants={variants}
        animate="in"
        initial="out"
        exit="out"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default Transition;
