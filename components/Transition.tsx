"use client";

import { m } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    // x: 0,
    transition: {
      duration: 0.1,
      // type: "ease",
      // type: "ease",
    },
  },
  out: {
    opacity: 0,
    // x: 10,
    scale: 0.994,
    transition: {
      duration: 0.1,
      // type: "ease",
      // type: "ease",
    },
  },
};

export const Transition = ({ children }: { children: ReactNode }) => {
  const path = usePathname();

  return (
    <m.div key={path} variants={variants} animate="in" initial="out" exit="out">
      {children}
    </m.div>
  );
};

export default Transition;
