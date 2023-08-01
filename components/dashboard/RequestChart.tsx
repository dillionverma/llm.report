import LoadingCard from "@/components/dashboard/LoadingCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  if (loading) return <LoadingCard />;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <Flex>
          <div>
            <Title>Requests</Title>
            <Metric>{total.toLocaleString()}</Metric>
            <Text>today so far</Text>
          </div>
        </Flex>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default RequestChart;
