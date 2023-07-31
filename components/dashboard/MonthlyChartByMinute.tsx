import { CATEGORY_TO_COLOR, MODEL_TO_COLOR } from "@/lib/constants";
import { useCostChartData } from "@/lib/hooks/charts/useCostChartData";
import { motion } from "framer-motion";
import { MonthlyChartProps } from "@/components/dashboard/MonthlyChart";
import { BarChart, Legend, Title, Text } from "@tremor/react";
import { format } from "date-fns";
import LoadingChart from "@/components/dashboard/LoadingChart";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

const MonthlyChartLoading = () => (
  <motion.div
    initial="hidden"
    whileInView="show"
    animate="show"
    variants={{
      hidden: { opacity: 0, originX: 1 },
      show: {
        opacity: 1,
        originX: 1,
      },
    }}
    className="flex flex-col w-full h-full animate-pulse"
  >
    <div className="mt-3 bg-gray-200 rounded-full  w-[7rem] h-3 mb-2.5 "></div>
    <div className="mt-3 bg-gray-200 rounded-full  w-[8rem] h-8 mb-2.5 "></div>
    <LoadingChart />
    <div className="mt-3 bg-gray-200 rounded-full  w-full h-4 mb-2.5 "></div>
  </motion.div>
);

const MonthlyChartByMinute = ({
  startDate,
  endDate,
  categories,
}: MonthlyChartProps) => {
  const {
    snapshots,
    selectedSnapshots,
    data: costChartData,
  } = useCostChartData(startDate, endDate, categories);

  if (!snapshots || !selectedSnapshots || !costChartData)
    return <MonthlyChartLoading />;

  return (
    <div>
      <div>
        <Title>By Minute</Title>
        <Text>
          {startDate &&
            endDate &&
            `from ${format(startDate, "MMM d")} to ${format(endDate, "MMM d")}`}
        </Text>
      </div>
      <motion.div
        initial="hidden"
        whileInView="show"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
          },
        }}
      >
        <BarChart
          className="mt-6"
          data={costChartData}
          stack
          index="date"
          categories={selectedSnapshots}
          colors={selectedSnapshots.map((s) => MODEL_TO_COLOR[s])}
          showLegend={false}
          showAnimation={false}
          // connectNulls
          valueFormatter={dataFormatter}
        />
        <Legend
          className="mt-4 mr-2.5"
          categories={categories}
          colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
        />
      </motion.div>
    </div>
  );
};

export default MonthlyChartByMinute;
