import { animationVariant } from "@/lib/constants";
import useInterval from "@/lib/use-interval";
import { motion } from "framer-motion";
import { useState } from "react";

const LoadingChart = () => {
  const loadingBarHeights = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const getRandomHeight = () => {
    return loadingBarHeights[
      Math.floor(Math.random() * loadingBarHeights.length)
    ];
  };
  const [heights, setHeights] = useState<number[]>(
    new Array(30).fill(0).map((_) => getRandomHeight())
  );

  useInterval(() => {
    setHeights((heights) => {
      return heights.map((height) => {
        return getRandomHeight();
      });
    });
  }, 1500);

  return (
    <div className="animate-pulse">
      {/* <div className="h-2.5 bg-gray-200 rounded-full  w-32 mb-2.5"></div>
      <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full "></div> */}
      <motion.div
        className="flex items-end mt-4 space-x-1 h-[300px]"
        variants={animationVariant}
        initial="hidden"
        whileInView="show"
        animate="show"
      >
        {heights.map((value, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scaleY: 0, originY: 1 },
              show: { opacity: 1, scaleY: 1, originY: 1 },
            }}
            className={`w-full bg-gray-200 rounded-t-md transition-all duration-500 ease-in-out`}
            style={{
              height: `${value}%`,
            }}
          ></motion.div>
        ))}
      </motion.div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingChart;
