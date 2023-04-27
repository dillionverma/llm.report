import { CATEGORY_TO_COLOR } from "@/src/constants";
import {
  BillingSubscriptionResponse,
  BillingUsageResponse,
  Category,
} from "@/src/types";
import {
  DonutChart,
  Flex,
  Metric,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MonthlyUsage = ({
  startDate,
  endDate,
  categories,
}: {
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categories: Category[];
}) => {
  const [subscription, setSubscription] =
    useState<BillingSubscriptionResponse>();
  const [currentUsage, setCurrentUsage] = useState<number>(0);
  const [data, setData] = useState<any[]>();

  const [loading, setLoading] = useState<boolean>(false);

  const percentage = subscription
    ? (currentUsage / 100) * (subscription.hard_limit / 10000)
    : 0;

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);
      const subscription = await axios.get<BillingSubscriptionResponse>(
        `https://api.openai.com/dashboard/billing/subscription`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      const query = {
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      };

      const usage = await axios.get<BillingUsageResponse>(
        `https://api.openai.com/dashboard/billing/usage?${new URLSearchParams(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      const cumulativeTotalCost = usage.data.daily_costs.reduce(
        (acc, { line_items }) =>
          line_items.reduce((innerAcc, { name, cost }) => {
            // @ts-ignore
            if (!innerAcc[name]) {
              // @ts-ignore
              innerAcc[name] = 0;
            }
            // @ts-ignore
            innerAcc[name] += cost;
            return innerAcc;
          }, acc),
        {}
      );

      const data = Object.entries(cumulativeTotalCost).map(([name, cost]) => ({
        name,
        cost: (cost as number) / 100,
      }));

      setLoading(false);
      setData(data);
      setSubscription(subscription.data);
      setCurrentUsage(usage.data.total_usage);
    })();
  }, [startDate, endDate]);

  if (
    loading ||
    !subscription ||
    !currentUsage ||
    !percentage ||
    !data ||
    data?.length === 0
  ) {
    return (
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
        className="animate-pulse flex flex-col justify-between h-full w-full"
      >
        <div>
          <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[7rem] h-3 mb-2.5 "></div>
          <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[8rem] h-8 mb-2.5 "></div>
        </div>
        <div className="rounded-full bg-slate-200 h-[10rem] w-[10rem] flex self-center"></div>
        <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full h-4 mb-2.5 "></div>
      </motion.div>
    );
  }

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
      <Flex alignItems="start">
        <Title>Cost</Title>
        {/* <BadgeDelta deltaType="moderateIncrease">23.1%</BadgeDelta> */}
      </Flex>

      <Metric>$ {(currentUsage / 100).toFixed(2)}</Metric>
      <DonutChart
        className="mt-6"
        data={data}
        category="cost"
        index="name"
        valueFormatter={(v) => `$ ${v.toFixed(2)}`}
        colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
      />
      <Flex className="mt-4">
        <Text className="truncate">{`${(percentage / 100).toFixed(
          2
        )}% of hard limit`}</Text>
        <Text>$ {(subscription.hard_limit / 10000).toFixed(2)}</Text>
      </Flex>
      <ProgressBar percentageValue={percentage / 100} className="mt-2" />
    </motion.div>
  );
};

export default MonthlyUsage;
