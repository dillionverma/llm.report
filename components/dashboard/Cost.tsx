import { useSubscriptionData } from "@/lib/hooks/api/useSubscriptionData";
import { useCostDonutChartData } from "@/lib/hooks/charts/useCostDonutChartData";
import { Category } from "@/lib/types";
import {
  DonutChart,
  Flex,
  Metric,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";
import { motion } from "framer-motion";

interface MonthlyCostChartProps {
  startDate: Date;
  endDate: Date;
  categories: Category[];
}
const MonthlyCostChart = ({
  startDate,
  endDate,
  categories,
}: MonthlyCostChartProps) => {
  const { data: subscription } = useSubscriptionData();
  const { chartData, billing, isLoading } = useCostDonutChartData(
    startDate,
    endDate,
    categories
  );

  if (!subscription || !chartData || !billing)
    return (
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
        className="animate-pulse flex flex-col justify-between h-full w-full"
      >
        <div>
          <div className="mt-3 bg-gray-200 rounded-full w-[7rem] h-3 mb-2.5 "></div>
          <div className="mt-3 bg-gray-200 rounded-full w-[8rem] h-8 mb-2.5 "></div>
        </div>
        <div className="rounded-full bg-slate-200 h-[10rem] w-[10rem] flex self-center"></div>
        <div className="mt-3 bg-gray-200 rounded-full w-full h-4 mb-2.5 "></div>
      </motion.div>
    );

  const getPercentage = () => billing.total_usage / subscription.hard_limit_usd;

  return (
    <>
      <Flex alignItems="start">
        <Title>Cost</Title>
        {/* <BadgeDelta deltaType="moderateIncrease">23.1%</BadgeDelta> */}
      </Flex>

      <Metric>
        {chartData.reduce((acc, { cost }) => acc + cost, 0).toFixed(2)}
      </Metric>
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
        <DonutChart
          className="mt-6"
          data={chartData}
          showAnimation={false}
          category="cost"
          index="name"
          valueFormatter={(v) => `$ ${v.toFixed(2)}`}
          colors={chartData.map(({ color }) => color)}
        />
      </motion.div>
      <Flex className="mt-4">
        <Text className="truncate">{`${getPercentage().toFixed(
          2
        )}% of hard limit`}</Text>
        <Text>$ {subscription.hard_limit_usd.toFixed(2)}</Text>
      </Flex>
      <ProgressBar percentageValue={getPercentage()} className="mt-2" />
    </>
  );
};

export default MonthlyCostChart;
