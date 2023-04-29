import {
  CATEGORIES,
  CATEGORY_TO_COLOR,
  LOCAL_STORAGE_KEY,
  animationVariant,
} from "@/lib/constants";
import { BillingUsageResponse, Category } from "@/lib/types";
import useInterval from "@/lib/use-interval";
import { dateFormat } from "@/lib/utils";
import {
  AreaChart,
  BarChart,
  Flex,
  Legend,
  Metric,
  Title,
  Toggle,
  ToggleItem,
} from "@tremor/react";
import axios from "axios";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

type Select = "daily" | "cumulative";

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
      {/* <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5"></div>
      <div className="w-48 h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div> */}
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
            className={`w-full bg-gray-200 rounded-t-md dark:bg-gray-700 transition-all duration-500 ease-in-out`}
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

const MonthlyChart = ({
  startDate,
  endDate,
  categories,
  demo,
}: {
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categories: Category[];
  demo?: boolean;
}) => {
  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<Select>("daily");
  const [dailyCosts, setDailyCosts] = useState<
    BillingUsageResponse["daily_costs"]
  >([]);
  const [loading, setLoading] = useState(false);
  const [totalUsage, setTotalUsage] = useState(0);

  useEffect(() => {
    const totalUsage = dailyCosts.reduce((acc, cv) => {
      return (
        acc +
        cv.line_items.reduce(
          (acc, cv) => acc + (new Set(categories).has(cv.name) ? cv.cost : 0),
          0
        )
      );
    }, 0);

    setTotalUsage(totalUsage);
  }, [categories, dailyCosts]);

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);

      let query: {
        start_date: string;
        end_date: string;
      } = {
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
      };

      const key = localStorage.getItem(LOCAL_STORAGE_KEY) || "";
      toast.promise(
        axios.get<BillingUsageResponse>(
          `https://api.openai.com/dashboard/billing/usage?${new URLSearchParams(
            query
          )}`,
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        ),
        {
          loading: "Loading...",
          success: (response) => {
            console.log(response);
            const daily_costs = response.data.daily_costs;
            setDailyCosts(daily_costs);
            // setTotalUsage(response.data.total_usage);

            // console.log(daily_costs);

            const totalUsage = daily_costs.reduce((acc, cv) => {
              return (
                acc +
                cv.line_items.reduce(
                  (acc, cv) =>
                    acc + (new Set(categories).has(cv.name) ? cv.cost : 0),
                  0
                )
              );
            }, 0);

            setTotalUsage(totalUsage);

            const data = daily_costs
              .map((day) => {
                return {
                  date: dateFormat(day.timestamp),
                  ...day.line_items.reduce((acc, cv) => {
                    return {
                      ...acc,
                      [cv.name]: (cv.cost / 100).toFixed(2),
                    };
                  }, {}),
                  "Total Cost ($)": (
                    day.line_items.reduce((acc, cv) => acc + cv.cost, 0) / 100
                  ).toFixed(2),
                };
              })
              .filter(
                (day) => parse(day.date, "MMM d", new Date()) < new Date()
              );

            const cumulativeData = daily_costs
              .map((day, index) => {
                return {
                  date: dateFormat(day.timestamp),
                  ...day.line_items.reduce((acc, cv) => {
                    return {
                      ...acc,
                      [cv.name]: (cv.cost / 100).toFixed(2),
                    };
                  }, {}),
                  ...CATEGORIES.map((category) => {
                    return {
                      [category]: (
                        daily_costs
                          .slice(0, index + 1)
                          .reduce(
                            (acc, cv) =>
                              acc +
                              cv.line_items.reduce(
                                (acc, cv) =>
                                  acc + (cv.name === category ? cv.cost : 0),
                                0
                              ),
                            0
                          ) / 100
                      ).toFixed(2),
                    };
                  }).reduce((acc, value) => {
                    return {
                      ...acc,
                      ...value,
                    };
                  }, {}),
                  "Total Cost ($)": (
                    daily_costs
                      .slice(0, index + 1)
                      .reduce(
                        (acc, cv) =>
                          acc +
                          cv.line_items.reduce((acc, cv) => acc + cv.cost, 0),
                        0
                      ) / 100
                  ).toFixed(2),
                };
              })
              .filter(
                (day) => parse(day.date, "MMM d", new Date()) < new Date()
              );

            console.log(cumulativeData);
            setCumulativeData(cumulativeData);
            setData(data);
            setLoading(false);
            return "Ready!";
          },
          error: (err) => {
            setLoading(false);
            return err.response.data.error.message;
          },
        }
      );
    })();
  }, [startDate, endDate]);

  if (loading || demo) {
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
        className="animate-pulse flex flex-col h-full w-full"
      >
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[7rem] h-3 mb-2.5 "></div>
            <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[8rem] h-8 mb-2.5 "></div>
          </div>
          <div className="bg-gray-200 rounded-full dark:bg-gray-700 w-[10rem] h-8 mb-2.5"></div>
        </div>
        {/* <div className="flex flex-col items-end">
          <div className="bg-gray-200 rounded-full dark:bg-gray-700 w-[8rem] h-8 mb-2.5"></div>
        </div> */}
        <LoadingChart />
        <div className="mt-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full h-4 mb-2.5 "></div>
      </motion.div>
    );
  }

  return (
    <>
      <Flex>
        <div>
          <Title>Daily Usage (USD)</Title>
          <Metric>$ {(totalUsage / 100).toFixed(2)}</Metric>
        </div>
        <Toggle
          className="max-w-fit mt-2 mb-2 md:mt-0"
          color="zinc"
          defaultValue="daily"
          onValueChange={(value) => setSelectedValue(value as Select)}
        >
          <ToggleItem value="daily" text="Daily" />
          <ToggleItem value="cumulative" text="Cumulative" />
        </Toggle>
      </Flex>

      {selectedValue === "daily" && data.length > 0 && (
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
            data={data}
            index="date"
            categories={categories}
            colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
            valueFormatter={dataFormatter}
            startEndOnly
            stack
            showLegend={false}
            yAxisWidth={48}
            showYAxis={true}
          />
          <Legend
            className="mt-4 space-x-2"
            categories={categories}
            colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
          />
        </motion.div>
      )}

      {selectedValue === "cumulative" && cumulativeData.length > 0 && (
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
          <AreaChart
            className="mt-6"
            data={cumulativeData}
            categories={categories}
            index="date"
            colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
            valueFormatter={dataFormatter}
            startEndOnly
            // stack={view === "relative"}
            showLegend={false}
          />
          <Legend
            className="mt-4 space-x-2"
            categories={categories}
            colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
          />
        </motion.div>
      )}
    </>
  );
};

export default MonthlyChart;
