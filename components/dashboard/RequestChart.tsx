import { useUsageDataCharts } from "@/lib/hooks/charts/useUsageDataCharts";
import { AreaChart, Flex, Metric, Text, Title } from "@tremor/react";

interface RequestChartProps {
  startDate: Date;
  endDate: Date;
}

const RequestChart = ({ startDate, endDate }: RequestChartProps) => {
  const {
    totalCountRequests: total,
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
          <Title>Requests</Title>
          <Metric>{total.toLocaleString()}</Metric>
          <Text>today so far</Text>
        </div>
      </Flex>
      {data.length > 0 && (
        <AreaChart
          className="mt-6 h-32"
          data={data}
          index="date"
          categories={["requests"]}
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

export default RequestChart;
