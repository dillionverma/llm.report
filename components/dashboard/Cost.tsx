import { CATEGORY_TO_COLOR, LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/services/openai";
import { BillingSubscriptionResponse, Category } from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import {
  DonutChart,
  Flex,
  Metric,
  ProgressBar,
  Text,
  Title,
} from "@tremor/react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import subscriptionData from "../../fixtures/openai/subscription.json";
import usageRange from "../../fixtures/openai/usage-range.json";

const MonthlyUsage = ({
  startDate,
  endDate,
  categories,
  defaultLoading,
  demo,
}: {
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categories: Category[];
  defaultLoading?: boolean;
  demo?: boolean;
}) => {
  const [subscription, setSubscription] =
    useState<BillingSubscriptionResponse>();
  const [data, setData] = useState<any[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(0);
  const { data: session } = useSession();
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);

      let subscriptionResponse;
      let usageResponse;

      // if (!session?.user) {
      //   addMock(
      //     `https://api.openai.com/dashboard/billing/usage?start_date=${format(
      //       startDate,
      //       "yyyy-MM-dd"
      //     )}&end_date=${format(endDate, "yyyy-MM-dd")}`,
      //     { data: usageRange, status: 200 }
      //   );
      //   addMock("https://api.openai.com/dashboard/billing/subscription", {
      //     data: subscriptionData,
      //     status: 200,
      //   });
      //   enableMocking(true);
      // } else {
      //   enableMocking(false);
      // }

      try {
        if (demo) {
          subscriptionResponse =
            subscriptionData as BillingSubscriptionResponse;
          usageResponse = usageRange;
        } else {
          openai.setKey(key);
          subscriptionResponse = await openai.getSubscription();
          usageResponse = await openai.getBillingUsage(startDate, endDate);
        }
      } catch (e: any) {
        // toast.error(e.response.data.error.message);
        // setLoading(false);
        return;
      }

      if (!usageResponse) return;
      if (!subscriptionResponse) return;

      const cumulativeTotalCost = usageResponse.daily_costs.reduce(
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
          ? (usageResponse.total_usage / 100) *
              (subscriptionResponse.hard_limit / 10000)
          : 0
      );
      setLoading(false);
      setData(data);
      setSubscription(subscriptionResponse);
    })();
  }, [startDate, endDate, categories, key, session, demo]);

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
          <div className="mt-3 bg-gray-200 rounded-full w-[7rem] h-3 mb-2.5 "></div>
          <div className="mt-3 bg-gray-200 rounded-full w-[8rem] h-8 mb-2.5 "></div>
        </div>
        <div className="rounded-full bg-slate-200 h-[10rem] w-[10rem] flex self-center"></div>
        <div className="mt-3 bg-gray-200 rounded-full w-full h-4 mb-2.5 "></div>
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
          showAnimation={false}
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
