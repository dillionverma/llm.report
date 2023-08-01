"use client";

import { LazyMotion, domAnimation } from "framer-motion";

export interface MotionProvider {
  children: React.ReactNode;
}

export default function MotionProvider({ children }: MotionProvider) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
