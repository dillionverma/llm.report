import { MODEL_TO_COLOR } from "@/lib/constants";
import { useBillingData } from "@/lib/hooks/api/useBillingData";
import { useCostChartData } from "@/lib/hooks/charts/useCostChartData";
import { Category, Model } from "@/lib/types";
import { BarChart, Flex, Metric, Text, Title } from "@tremor/react";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

interface CostChartProps {
  startDate: Date;
  endDate: Date;
  categories: Category[];
}

const CostChart = ({ startDate, endDate, categories }: CostChartProps) => {
  // need to add a day here since this only needs billing data for current day
  const { data: BillingData } = useBillingData(startDate, endDate);
  const { snapshots, selectedSnapshots, data, loading } = useCostChartData(
    startDate,
    endDate,
    categories
  );

  if (!BillingData || !snapshots || !selectedSnapshots || !data)
    return (
      <div className="flex flex-col h-56">
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="mt-3 bg-gray-200 rounded-full w-[7rem] h-3 mb-2.5 "></div>
            <div className="mt-3 bg-gray-200 rounded-full w-[8rem] h-8 mb-2.5 "></div>
          </div>
          <div className="bg-gray-200 rounded-full w-[10rem] h-8 mb-2.5"></div>
        </div>
        {/* <div className="flex flex-col items-end">
        <div className="bg-gray-200 rounded-full  w-[8rem] h-8 mb-2.5"></div>
      </div> */}
        {/* <LoadingChart /> */}
        <div className="flex flex-1" />
        <div className="flex mt-3 bg-gray-200 rounded-full w-full h-4 mb-2.5 "></div>
      </div>
    );

  const dailyCosts = BillingData.daily_costs;

  const totalUsage = dailyCosts[dailyCosts.length - 1].line_items.reduce(
    (acc, cv) =>
      acc + (new Set(categories).has(cv.name as Model) ? cv.cost : 0),
    0
  );

  return (
    <>
      <Flex alignItems="start">
        <div>
          <Title>Cost</Title>
          <Metric>$ {(totalUsage / 100).toFixed(2)}</Metric>
          <Text>today so far</Text>
        </div>
      </Flex>
      {data.length > 0 && (
        <BarChart
          className="mt-6 h-32"
          data={data}
          stack
          index="date"
          categories={selectedSnapshots}
          colors={selectedSnapshots.map((s) => MODEL_TO_COLOR[s])}
          showLegend={false}
          showYAxis={false}
          // showXAxis={false}
          showGridLines={false}
          showAnimation={false}
          startEndOnly
          // connectNulls
          valueFormatter={dataFormatter}
        />
      )}
    </>
  );
};

export default CostChart;
