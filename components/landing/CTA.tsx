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
            delayChildren: 0.5,
          },
        },
      }}
    >
      {/* <div className="absolute top-0 left-0 w-full h-full opacity-40"></div> */}
      <div className="relative z-10 gap-5 items-center">
        <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-lg ">
          <motion.h3
            className="text-3xl text-gray-800 font-semibold md:text-4xl"
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
            Know exactly what&apos;s happening in your AI app with realtime
            dashboards, usage reports, and alerts.
          </motion.p>
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
              <span className="relative">Get started</span>

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
            <div className="mt-4">
              <JoinUsers />
            </div>
          </motion.div>
        </div>

        <div className="flex-1 mt-5 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
          {/* <img
            src="https://i.postimg.cc/kgd4WhyS/container.png"
            alt=""
            className="w-full"
          /> */}
        </div>
      </div>

      {/* <style jsx>{`
        .cta-sec {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style> */}
    </motion.section>
  );
};

export default CTA;
