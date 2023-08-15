"use client";

import ShimmerButton from "@/components/magicui/shimmer-button";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Dashboard from "../dashboard";

const BackedBy = () => (
  <div className="mt-12 flex flex-col gap-4 justify-center items-center">
    <div>
      <h3 className="font-semibold text-sm text-gray-600 text-center">
        Backed by the best in the industry
      </h3>
    </div>

    <div className="flex flex-row gap-4">
      <Link
        href="https://vercel.com/blog/ai-accelerator-participants"
        target="_blank"
        className="group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-md"
      >
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>

        <img
          src="/accelerator-badge-dark.png"
          alt="Backed by Vercel AI Accelerator"
          className="w-36"
        />
      </Link>

      <Link
        href="https://buildspace.so/sf1"
        target="_blank"
        className="group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-md"
      >
        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>

        <img
          src="/buildspace-badge-dark.png"
          alt="Backed by Buildspace"
          className="w-36"
        />
      </Link>
    </div>
  </div>
);
const Hero = () => {
  const router = useRouter();

  return (
    <m.section
      id="hero"
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
      <div className="py-20 min-h-screen">
        <div className="max-w-screen flex flex-col items-center py-20">
          <m.h1
            className="flex flex-col md:flex-row text-5xl md:text-7xl font-bold justify-center text-center md:h-max"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <span className="text-primary-50 leading-none md:pb-4 tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                Logging and Analytics
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
            logging, analytics, usage reports, and alerts.
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
            className="flex md:flex-col items-center justify-center space-x-4 mt-4 w-[500px]"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 place-items-center">
              <ShimmerButton
                className="flex items-center justify-center shadow-2xl transition-all hover:shadow-[0_0_40px_8px_rgba(185,28,28,0.5)]"
                background="radial-gradient(ellipse 80% 70% at 50% 120%, #f59e0b, #B91C1C)"
                onClick={() => {
                  router.push("/login");
                }}
              >
                <span className="whitespace-pre bg-gradient-to-b from-black from-30% to-gray-300/80 bg-clip-text text-center text-sm lg:text-2xl font-semibold leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 dark:text-transparent z-10">
                  Get started for free
                </span>
                <ChevronRight className="h-6 w-6 duration-150 ease-in-out transform group-hover:translate-x-1 m-auto" />
              </ShimmerButton>

              <Link
                className={cn(
                  buttonVariants({
                    size: "lg",
                  }),
                  "gap-2 whitespace-pre flex",
                  "group relative justify-center gap-2 w-full transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 rounded-sm"
                )}
                href={siteConfig.links.cal}
                target="_blank"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
                <Phone className="h-4 w-4 fill-current" />
                Schedule a call
              </Link>
            </div>

            {/* <div className="mt-6">
              <JoinUsers />
            </div> */}
          </m.div>
          <m.div
            className="flex md:flex-col items-center justify-center space-x-4 mt-4 w-[500px]"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <BackedBy />
          </m.div>
        </div>

        <div className="mx-auto max-w-[1200px]">
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        </div>
      </div>
    </m.section>
  );
};

export default Hero;
