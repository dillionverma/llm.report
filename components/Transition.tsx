import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const variants = {
  in: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      // type: "ease",
    },
  },
  out: {
    opacity: 0,
    x: 5,
    transition: {
      duration: 0.2,
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
