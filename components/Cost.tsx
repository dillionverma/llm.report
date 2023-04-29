import { CATEGORY_TO_COLOR, LOCAL_STORAGE_KEY } from "@/lib/constants";
import {
  BillingSubscriptionResponse,
  BillingUsageResponse,
  Category,
} from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
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
  defaultLoading,
}: {
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categories: Category[];
  defaultLoading?: boolean;
}) => {
  const [subscription, setSubscription] =
    useState<BillingSubscriptionResponse>();
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);

  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);

      let subscriptionResponse;
      let usageResponse;

      try {
        subscriptionResponse = await axios.get<BillingSubscriptionResponse>(
          `https://api.openai.com/dashboard/billing/subscription`,
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        );
        const query = {
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
        };

        usageResponse = await axios.get<BillingUsageResponse>(
          `https://api.openai.com/dashboard/billing/usage?${new URLSearchParams(
            query
          )}`,
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        );
      } catch (e: any) {
        // toast.error(e.response.data.error.message);
        // setLoading(false);
        return;
      }

      const cumulativeTotalCost = usageResponse.data.daily_costs.reduce(
        (acc, { line_items }) =>
          line_items.reduce((innerAcc, { name, cost }) => {
            if (!categories.includes(name as Category)) {
              return innerAcc;
            }
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

      const data = Object.entries(cumulativeTotalCost)
        .map(([name, cost]) => ({
          name,
          cost: (cost as number) / 100,
          color: CATEGORY_TO_COLOR[name as Category],
        }))
        .filter(({ name }) => categories.includes(name as Category));

      setPercentage(
        subscriptionResponse
          ? (usageResponse.data.total_usage / 100) *
              (subscriptionResponse.data.hard_limit / 10000)
          : 0
      );
      setLoading(false);
      setData(data);
      setSubscription(subscriptionResponse.data);
    })();
  }, [startDate, endDate, categories, key]);

  if (
    defaultLoading ||
    loading ||
    !subscription ||
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
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
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
    <>
      <Flex alignItems="start">
        <Title>Cost</Title>
        {/* <BadgeDelta deltaType="moderateIncrease">23.1%</BadgeDelta> */}
      </Flex>

      <Metric>
        $ {data.reduce((acc, { cost }) => acc + cost, 0).toFixed(2)}
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
          data={data}
          category="cost"
          index="name"
          valueFormatter={(v) => `$ ${v.toFixed(2)}`}
          colors={data.map(({ color }) => color)}
        />
      </motion.div>
      <Flex className="mt-4">
        <Text className="truncate">{`${(percentage / 100).toFixed(
          2
        )}% of hard limit`}</Text>
        <Text>$ {(subscription.hard_limit / 10000).toFixed(2)}</Text>
      </Flex>
      <ProgressBar percentageValue={percentage / 100} className="mt-2" />
    </>
  );
};

export default MonthlyUsage;
