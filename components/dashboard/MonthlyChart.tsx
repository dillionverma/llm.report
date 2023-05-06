import {
  CATEGORIES,
  CATEGORY_TO_COLOR,
  LOCAL_STORAGE_KEY,
  MODEL_COST,
  MODEL_TO_COLOR,
  SELECTION_KEY,
} from "@/lib/constants";
import { addMock, enableMocking } from "@/lib/mock-axios";
import {
  BillingUsageResponse,
  Category,
  Snapshot,
  UsageResponse,
} from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import { dateFormat, dateRange } from "@/lib/utils";
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
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import usageDay1 from "../../fixtures/openai/usage-day-1.json";
import usageRange from "../../fixtures/openai/usage-range.json";
import LoadingChart from "./LoadingChart";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

type Select = "minute" | "day" | "cumulative";

const MonthlyChart = ({
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
  const [cumulativeData, setCumulativeData] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  // const [selectedValue, setSelectedValue] = useState<Select>("day");
  const [dailyCosts, setDailyCosts] = useState<
    BillingUsageResponse["daily_costs"]
  >([]);
  const [loading, setLoading] = useState(false);
  const [totalUsage, setTotalUsage] = useState(0);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);
  const [selection, setSelection] = useLocalStorage<Select>(
    SELECTION_KEY,
    "day"
  );
  const { data: session } = useSession();

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

      if (!session?.user) {
        addMock(
          `https://api.openai.com/dashboard/billing/usage?start_date=${format(
            startDate,
            "yyyy-MM-dd"
          )}&end_date=${format(endDate, "yyyy-MM-dd")}`,
          { data: usageRange, status: 200 }
        );
        enableMocking(true);
      } else {
        enableMocking(false);
      }

      const response = await axios.get<BillingUsageResponse>(
        `https://api.openai.com/dashboard/billing/usage?${new URLSearchParams(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        }
      );

      // console.log(response);
      const daily_costs = response.data.daily_costs;
      setDailyCosts(daily_costs);
      // setTotalUsage(response.data.total_usage);

      // console.log(daily_costs);

      const totalUsage = daily_costs.reduce((acc, cv) => {
        return (
          acc +
          cv.line_items.reduce(
            (acc, cv) => acc + (new Set(categories).has(cv.name) ? cv.cost : 0),
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
        .filter((day) => parse(day.date, "MMM d", new Date()) < new Date());

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
                    acc + cv.line_items.reduce((acc, cv) => acc + cv.cost, 0),
                  0
                ) / 100
            ).toFixed(2),
          };
        })
        .filter((day) => parse(day.date, "MMM d", new Date()) < new Date());

      setCumulativeData(cumulativeData);
      setData(data);
      setLoading(false);
    })();
  }, [startDate, endDate, key, session, selection]);

  const [data2, setData2] = useState<{ time: string; cost: number }[]>([]);

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);

      const dates = dateRange(startDate, endDate);

      if (!session?.user) {
        for (const date of dates) {
          const d = format(date, "yyyy-MM-dd");
          addMock(`https://api.openai.com/v1/usage?date=${d}`, {
            data: usageDay1,
            status: 200,
          });
        }
        enableMocking(true);
      } else {
        enableMocking(false);
      }

      let data2;
      try {
        data2 = await Promise.all(
          dates.map(async (date) => {
            const query = {
              // ...query,
              date: format(date, "yyyy-MM-dd"),
            };

            const res = await axios.get<UsageResponse>(
              `https://api.openai.com/v1/usage?${new URLSearchParams(query)}`,
              {
                headers: {
                  Authorization: `Bearer ${key}`,
                },
              }
            );

            return res.data;
          })
        );
      } catch (e) {
        console.error(e);
        return;
      }

      // Group data by aggregation_timestamp and calculate costs
      const groupedData = data2
        .flatMap((day) => day.data)
        .reduce((acc, cur) => {
          const date = format(
            new Date(cur.aggregation_timestamp * 1000),
            "MMMM d, yyyy h:mm a"
          );

          if (!acc[date]) {
            acc[date] = {};
          }

          const cost =
            MODEL_COST[cur.snapshot_id as Snapshot] *
            (cur.n_generated_tokens_total + cur.n_context_tokens_total);

          if (!acc[date][cur.snapshot_id]) {
            acc[date][cur.snapshot_id] = cost;
          } else {
            acc[date][cur.snapshot_id] += cost;
          }

          return acc;
        }, {} as { [key: string]: any });

      // Transform the grouped data into chartData format
      const chartData = Object.entries(groupedData).map(
        ([date, snapshotCosts]) => {
          return {
            date,
            ...snapshotCosts,
          };
        }
      );

      setData2(chartData);

      // // grouped by snapshot_id
      const groupedData1 = data2
        .flatMap((day) => day.data)
        .reduce((acc, cur) => {
          const snapshotId = cur.snapshot_id;
          if (!acc[snapshotId]) {
            acc[snapshotId] = [];
          }
          return acc;
        }, {} as { [key: string]: any });

      // @ts-ignore
      setSnapshots(Object.keys(groupedData1));
      // @ts-ignore
      setSelectedSnapshots(Object.keys(groupedData1));

      setLoading(false);
    })();
  }, [startDate, endDate, key, session, selection]);

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshots, setSelectedSnapshots] = useState<Snapshot[]>([]);

  if (defaultLoading || loading) {
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
            <div className="mt-3 bg-gray-200 rounded-full  w-[7rem] h-3 mb-2.5 "></div>
            <div className="mt-3 bg-gray-200 rounded-full  w-[8rem] h-8 mb-2.5 "></div>
          </div>
          <div className="bg-gray-200 rounded-full  w-[10rem] h-8 mb-2.5"></div>
        </div>
        {/* <div className="flex flex-col items-end">
          <div className="bg-gray-200 rounded-full  w-[8rem] h-8 mb-2.5"></div>
        </div> */}
        <LoadingChart />
        <div className="mt-3 bg-gray-200 rounded-full  w-full h-4 mb-2.5 "></div>
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
          defaultValue={selection!}
          onValueChange={(value) => setSelection(value as Select)}
        >
          <ToggleItem value="minute" text="Minute" />
          <ToggleItem value="day" text="Day" />
          <ToggleItem value="cumulative" text="Cumulative" />
        </Toggle>
      </Flex>

      {selection === "minute" && data2.length > 0 && (
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
            data={data2}
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
      )}

      {selection === "day" && data.length > 0 && (
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
            showAnimation={false}
          />
          <Legend
            className="mt-4 mr-2.5"
            categories={categories}
            colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
          />
        </motion.div>
      )}

      {selection === "cumulative" && cumulativeData.length > 0 && (
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
            showAnimation={false}
            maxValue={Math.max(
              ...cumulativeData.map((d) =>
                Math.max(...categories.map((c) => d[c]))
              )
            )}
          />
          <Legend
            className="mt-4 mr-2.5"
            categories={categories}
            colors={categories.map((category) => CATEGORY_TO_COLOR[category])}
          />
        </motion.div>
      )}
    </>
  );
};

export default MonthlyChart;
