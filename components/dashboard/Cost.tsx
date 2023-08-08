import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      <Card className="shadow-none">
        <CardContent>
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
        </CardContent>
      </Card>
    );

  const getPercentage = () => billing.total_usage / subscription.hard_limit_usd;

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
    >
      <Card className="shadow-none">
        <CardHeader>
          <Flex alignItems="start">
            <Title>Cost</Title>
          </Flex>

          <Metric>
            {/* @ts-ignore */}${" "}
            {chartData.reduce((acc, { cost }) => acc + cost, 0).toFixed(2)}
          </Metric>
        </CardHeader>
        <CardContent>
          <DonutChart
            className="mt-6"
            data={chartData}
            showAnimation={false}
            category="cost"
            index="name"
            valueFormatter={(v) => `$ ${v.toFixed(2)}`}
            colors={chartData.map(({ color }) => color)}
          />

          <div className="flex flex-1" />
          <Flex className="mt-4">
            <Text className="truncate">{`${getPercentage().toFixed(
              2
            )}% of hard limit`}</Text>
            <Text>$ {subscription.hard_limit_usd.toFixed(2)}</Text>
          </Flex>
          <ProgressBar value={getPercentage()} className="mt-2" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyCostChart;
