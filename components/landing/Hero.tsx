"use client";

import ShimmerButton from "@/components/magicui/shimmer-button";
import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Dashboard from "../dashboard";
import JoinUsers from "./JoinUsers";

const Hero = () => {
  const router = useRouter();

  return (
    <m.section
      className="py-20"
      initial="hidden"
      whileInView="show"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.04,
            // delayChildren: 0.5,
          },
        },
      }}
    >
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-40"></div> */}
      <div className="relative z-10 items-center">
        <div className="max-w-screen min-w-fit flex flex-col items-center py-20">
          <m.h1
            className="flex flex-col md:flex-row text-5xl md:text-7xl font-bold justify-center text-center md:h-max"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <span className="text-primary-50 leading-none md:pb-4 tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                Monitoring and Analytics
                {/* Open Source */}
              </span>{" "}
              for OpenAI
              {/* LLM Ops */}
            </span>
          </m.h1>
          <m.p
            className="text-gray-500 leading-relaxed mt-3 text-xl"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            Know exactly what&apos;s happening in your AI app with realtime
            analytics, usage reports, and alerts.
            {/* Just enter your OpenAI API key, and we fetch your data from the
            OpenAI API directly to create a dashboard. No need to install
            anything. */}
            {/* End-to-end platform to build, test, monitor and deploy your llm
            based apps. */}
          </m.p>
          <m.p
            className="text-gray-500 leading-relaxed mt-3 text-sm"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          ></m.p>

          <m.div
            className="flex flex-col items-center justify-center space-x-4 mt-4"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <ShimmerButton
              shadowEnabled={false}
              className="inline-flex items-center shadow-2xl transition-all  hover:shadow-[0_0_40px_8px_rgba(185,28,28,0.5)]"
              background="radial-gradient(ellipse 80% 70% at 50% 120%, #f59e0b, #B91C1C)"
              onClick={() => {
                router.push("/login");
              }}
            >
              <span className="whitespace-pre-wrap bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-2xl font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-transparent">
                Get started for free
              </span>
              <ChevronRight className="h-6 w-6 duration-150 ease-in-out transform group-hover:translate-x-3" />
            </ShimmerButton>

            <div className="mt-6">
              <JoinUsers />
            </div>

            <div className="mt-6 flex flex-col gap-4 justify-center items-center">
              <div>
                <h3 className="font-semibold text-sm text-gray-600 text-center">
                  Backed by the best in the industry
                </h3>
              </div>

              <div className="flex flex-row gap-4">
                <Link
                  href="https://vercel.com/blog/ai-accelerator-participants"
                  target="_blank"
                  className="group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-sm"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-60"></span>

                  <img
                    src="/accelerator-badge-dark.png"
                    alt="Backed by Vercel AI Accelerator"
                    className="w-40"
                  />
                </Link>

                <Link
                  href="https://buildspace.so/sf1"
                  target="_blank"
                  className="group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-sm"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-60"></span>

                  <img
                    src="/buildspace-badge-dark.png"
                    alt="Backed by Buildspace"
                    className="w-40"
                  />
                </Link>
              </div>
            </div>
          </m.div>
        </div>

        <div className="flex-1 mt-5 mx-auto sm:w-11/12 lg:mt-14 lg:w-auto">
          <Dashboard />
        </div>
      </div>
    </m.section>
  );
};

export default Hero;
