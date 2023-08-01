import LoadingCard from "@/components/dashboard/LoadingCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    categories,
    false
  );

  if (!BillingData || !snapshots || !selectedSnapshots || !data)
    return <LoadingCard />;

  const dailyCosts = BillingData.daily_costs;

  const totalUsage = dailyCosts[dailyCosts.length - 1].line_items.reduce(
    (acc, cv) =>
      acc + (new Set(categories).has(cv.name as Model) ? cv.cost : 0),
    0
  );

  return (
    <Card className="shadow-none">
      <CardHeader>
        <Flex alignItems="start">
          <div>
            <Title>Cost</Title>
            <Metric>$ {(totalUsage / 100).toFixed(2)}</Metric>
            <Text>today so far</Text>
          </div>
        </Flex>
      </CardHeader>
      <CardContent>
        {data.length > 0 && (
          <BarChart
            className="h-32 mt-6"
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
      </CardContent>
    </Card>
  );
};

export default CostChart;
