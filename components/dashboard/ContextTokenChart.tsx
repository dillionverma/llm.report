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

  if (loading) {
    return (
      <div className="flex flex-col h-56">
        <div className="flex flex-row justify-between items-center">
          <div>
            <div className="mt-3 bg-gray-200 rounded-full w-[7rem] h-3 mb-2.5 "></div>
            <div className="mt-3 bg-gray-200 rounded-full w-[8rem] h-8 mb-2.5 "></div>
          </div>
          <div className="bg-gray-200 rounded-full w-[10rem] h-8 mb-2.5"></div>
        </div>
        <div className="flex flex-1" />
        <div className="flex mt-3 bg-gray-200 rounded-full w-full h-4 mb-2.5 "></div>
      </div>
    );
  }

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
