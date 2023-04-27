import { BillingSubscriptionResponse, BillingUsageResponse } from "@/src/types";
import { DonutChart, Title } from "@tremor/react";
import axios from "axios";
import { format, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const cities = [
  {
    name: "New York",
    sales: 9800,
  },
  {
    name: "London",
    sales: 4567,
  },
  {
    name: "Hong Kong",
    sales: 3908,
  },
  {
    name: "San Francisco",
    sales: 2400,
  },
  {
    name: "Singapore",
    sales: 1908,
  },
  {
    name: "Zurich",
    sales: 1398,
  },
];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

const MonthlyPie = ({}) => {
  const [subscription, setSubscription] =
    useState<BillingSubscriptionResponse>();
  const [currentUsage, setCurrentUsage] = useState<number>(0);

  const percentage = subscription
    ? (currentUsage / 100) * (subscription.hard_limit / 10000)
    : 0;

  useEffect(() => {
    (async () => {
      const subscription = await axios.get<BillingSubscriptionResponse>(
        `https://api.openai.com/dashboard/billing/subscription`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      const query = {
        start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        end_date: format(new Date(), "yyyy-MM-dd"),
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
      setSubscription(subscription.data);
      setCurrentUsage(usage.data.total_usage);
    })();
  }, []);

  if (!subscription || !currentUsage || !percentage) {
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
        className="animate-pulse transition-all duration-500 ease-in-out flex flex-col justify-between h-full w-full"
      >
        <div>
          <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[7rem] h-3 mb-2.5 "></div>
          <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[8rem]  h-8 mb-2.5 "></div>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full h-4 mb-2.5 "></div>
      </motion.div>
    );
  }

  return (
    <>
      <Title>Sales</Title>
      <DonutChart
        className="mt-6"
        data={cities}
        category="sales"
        index="name"
        valueFormatter={valueFormatter}
        colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
      />

      {/* <Text>Monthly Pie</Text>
      <Metric>$ {(currentUsage / 100).toFixed(2)}</Metric>
      <Flex className="mt-4">
        <Text className="truncate">{`${(percentage / 100).toFixed(2)}%`}</Text>
        <Text>$ {(subscription.hard_limit / 10000).toFixed(2)}</Text>
      </Flex>
      <ProgressBar percentageValue={percentage / 100} className="mt-2" /> */}
    </>
  );
};

export default MonthlyPie;
