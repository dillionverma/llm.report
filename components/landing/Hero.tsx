"use client";

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
      className="py-14"
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
      <div className="relative z-10 gap-5 items-center">
        <div className="mx-2 md:mx-6 max-w-screen min-w-fit mb-4 mt-8 sm:mt-8 flex flex-col items-center">
          <m.h1
            className="flex flex-col md:flex-row text-5xl md:text-7xl font-bold justify-center text-center md:h-max"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <span className="text-primary-50 leading-none md:pb-4 tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                Open Source
              </span>{" "}
              LLM Ops
            </span>
          </m.h1>
          <m.p
            className="text-gray-500 leading-relaxed mt-3"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            {/* Know exactly what&apos;s happening in your AI app with realtime
            dashboards, usage reports, and alerts. */}
            {/* Just enter your OpenAI API key, and we fetch your data from the
            OpenAI API directly to create a dashboard. No need to install
            anything. */}
            End-to-end platform to build, test, monitor and deploy your llm
            apps.
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
            <button
              className="group px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600  text-sm md:text-lg text-white font-medium bg-indigo-50 rounded-full inline-flex items-center relative"
              // onClick={() => openDialog()}
              onClick={() => {
                router.push("/login");
              }}
            >
              <span className="absolute top-0 left-0 w-full h-full rounded-full opacity-50 filter  bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 filter group-active:opacity-0 rounded-full opacity-50 bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded-full shadow-xl filter group-active:opacity-0 group-hover:blur-sm bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded-full bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="relative text-lg tracking-tighter">
                Get started for free
              </span>
              <ChevronRight className="h-6 w-6 ml-1 duration-150 ease-in-out transform group-hover:translate-x-1" />
              {/* your dashboard for free in &lt; 1min */}

              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-1 duration-150 ease-in-out transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg> */}
            </button>

            {/* <Link
              className="mt-4 group px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600  text-white font-medium bg-indigo-50 rounded-full inline-flex items-center relative"
              href="/demo"
            >
              <span className="absolute top-0 left-0 w-full h-full rounded-full opacity-50 filter  bg-gradient-to-r from-blue-600 to-cyan-600"></span>
              <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 filter group-active:opacity-0 rounded-full opacity-50 bg-gradient-to-r from-blue-600 to-cyan-600"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded-full shadow-xl filter group-active:opacity-0 group-hover:blur-sm bg-gradient-to-r from-blue-600 to-cyan-600"></span>
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"></span>
              <span className="relative">See Live Demo</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-1 duration-150 ease-in-out transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link> */}

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
                >
                  <img
                    src="/accelerator-badge-dark.png"
                    alt="Backed by Vercel AI Accelerator"
                    className="w-40"
                  />
                </Link>

                <Link href="https://buildspace.so/sf1" target="_blank">
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
          {/* </m.div> */}
          {/* <img
            src="https://i.postimg.cc/kgd4WhyS/container.png"
            alt=""
            className="w-full"
          /> */}
        </div>
      </div>
    </m.section>
  );
};

export default Hero;
