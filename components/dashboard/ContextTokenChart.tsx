import LoadingCard from "@/components/dashboard/LoadingCard";
import { useUsageDataCharts } from "@/lib/hooks/charts/useUsageDataCharts";
import { AreaChart, Flex, Metric, Text, Title } from "@tremor/react";

interface TokenChartProps {
  startDate: Date;
  endDate: Date;
}

const TokenChart = ({ startDate, endDate }: TokenChartProps) => {
  const {
    totalCountContext: total,
    data,
    loading,
  } = useUsageDataCharts(startDate, endDate);

  if (loading) return <LoadingCard />;

  return (
    <>
      <Flex>
        <div>
          <Title>Context Tokens</Title>
          <Metric>{total.toLocaleString()}</Metric>
          <Text>today so far</Text>
        </div>
      </Flex>
      {data.length > 0 && (
        <AreaChart
          className="mt-6 h-32"
          data={data}
          index="date"
          categories={["context"]}
          colors={["blue"]}
          showLegend={false}
          showYAxis={false}
          showGridLines={false}
          startEndOnly
          showAnimation={false}
          connectNulls
        />
      )}
    </>
  );
};

export default TokenChart;
