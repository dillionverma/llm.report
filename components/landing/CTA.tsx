import { motion } from "framer-motion";
import { useDialog } from "../SettingsModal";
import JoinUsers from "./JoinUsers";

const CTA = () => {
  const { isOpen, openDialog, closeDialog } = useDialog();

  return (
    <motion.section
      className="relative max-w-screen-xl mx-auto py-14 px-4 md:px-8"
      initial="hidden"
      whileInView="show"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.1,
            // delayChildren: 0.5,
          },
        },
      }}
    >
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-40"></div> */}
      <div className="relative z-10 gap-5 items-center">
        <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-lg ">
          <motion.h3
            className="text-4xl text-gray-800 font-semibold md:text-5xl"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            A better way to monitor your{" "}
            <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              {" "}
              OpenAI API usage
            </span>
          </motion.h3>
          <motion.p
            className="text-gray-500 leading-relaxed mt-3"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            {/* Know exactly what&apos;s happening in your AI app with realtime
            dashboards, usage reports, and alerts. */}
            Just enter your OpenAI API key, and we fetch your data from the
            OpenAI API directly. No need to install anything.
          </motion.p>
          <motion.p
            className="text-gray-500 leading-relaxed mt-3 text-sm"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          ></motion.p>

          <motion.div
            className="flex flex-col items-center justify-center space-x-4 mt-4"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <button
              className="group px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600  text-white font-medium bg-indigo-50 rounded-full inline-flex items-center relative"
              onClick={() => openDialog()}
            >
              <span className="absolute top-0 left-0 w-full h-full rounded-full opacity-50 filter  bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="h-full w-full inset-0 absolute mt-0.5 ml-0.5 filter group-active:opacity-0 rounded-full opacity-50 bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded-full shadow-xl filter group-active:opacity-0 group-hover:blur-sm bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="absolute inset-0 w-full h-full transition duration-200 ease-out rounded-full bg-gradient-to-r from-red-600 to-amber-600"></span>
              <span className="relative">
                Get your dashboard for free in &lt; 1min
              </span>

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
            </button>

            <div className="mt-6">
              <JoinUsers />
            </div>
          </motion.div>
        </div>

        <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
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
          {/* <img
            src="https://i.postimg.cc/kgd4WhyS/container.png"
            alt=""
            className="w-full"
          /> */}
        </div>
      </div>
    </motion.section>
  );
};

export default CTA;
