import {
  CATEGORIES,
  CATEGORY_TO_COLOR,
  MODEL_TO_COLOR,
  SELECTION_KEY,
} from "@/lib/constants";
import { useBillingData } from "@/lib/hooks/api/useBillingData";
import { useCostChartData } from "@/lib/hooks/charts/useCostChartData";
import { Category } from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import { dateFormat } from "@/lib/utils";
import {
  AreaChart,
  BarChart,
  Flex,
  Legend,
  Metric,
  Text,
  Title,
  Toggle,
  ToggleItem,
} from "@tremor/react";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import LoadingChart from "./LoadingChart";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

type Select = "minute" | "day" | "cumulative";

const Loading = () => (
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

interface MonthlyChartProps {
  startDate: Date;
  endDate: Date;
  categories: Category[];
}

const MonthlyChart = ({
  startDate,
  endDate,
  categories,
}: MonthlyChartProps) => {
  const [selection, setSelection] = useLocalStorage<Select>(
    SELECTION_KEY,
    "day"
  );

  const { data: billingData } = useBillingData(startDate, endDate);
  const {
    snapshots,
    selectedSnapshots,
    data: costChartData,
  } = useCostChartData(startDate, endDate, categories);

  if (!billingData || !snapshots || !selectedSnapshots) return <Loading />;

  const dailyCosts = billingData.daily_costs;

  const totalUsage = dailyCosts.reduce((acc, cv) => {
    return (
      acc +
      cv.line_items.reduce(
        (acc, cv) => acc + (new Set(categories).has(cv.name) ? cv.cost : 0),
        0
      )
    );
  }, 0);

  const data = dailyCosts
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
    .filter((day) => parse(day.date, "MMM d", new Date()) > startDate);

  const cumulativeData = dailyCosts
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
              dailyCosts
                .slice(0, index + 1)
                .reduce(
                  (acc, cv) =>
                    acc +
                    cv.line_items.reduce(
                      (acc, cv) => acc + (cv.name === category ? cv.cost : 0),
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
          dailyCosts
            .slice(0, index + 1)
            .reduce(
              (acc, cv) =>
                acc + cv.line_items.reduce((acc, cv) => acc + cv.cost, 0),
              0
            ) / 100
        ).toFixed(2),
      };
    })
    .filter((day) => parse(day.date, "MMM d", new Date()) > startDate);

  return (
    <>
      <Flex>
        <div>
          <Title>Cost</Title>
          <Metric>$ {(totalUsage / 100).toFixed(2)}</Metric>
          <Text>
            {startDate &&
              endDate &&
              `from a ${format(startDate, "MMM d")} to ${format(
                endDate,
                "MMM d"
              )}`}
          </Text>
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

      {selection === "minute" && data.length > 0 && (
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
              ...cumulativeData.map((d: any) =>
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
