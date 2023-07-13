import { useUsageData } from "@/lib/hooks/api/useUsageData";
import { format } from "date-fns";

export const useUsageDataCharts = (startDate: Date, endDate: Date) => {
  const query = useUsageData(startDate, endDate);

  if (query.some((result) => result.isLoading || result.isError)) {
    return { data: [], loading: true };
  }

  const data = query.map((result) => result.data);

  const groupedData = data
    .flatMap((day) => day!.data)
    .reduce((acc, cur) => {
      const date = format(new Date(cur.aggregation_timestamp * 1000), "h:mm a");

      acc.push({
        date: date,
        context: cur.n_context_tokens_total,
        generated: cur.n_generated_tokens_total,
        requests: cur.n_requests,
      });

      return acc;
    }, [] as { [key: string]: any });

  const totalCountContext = Object.values(groupedData).reduce(
    (acc, cur) => acc + cur.context,
    0
  );

  const totalCountGenerated = Object.values(groupedData).reduce(
    (acc, cur) => acc + cur.generated,
    0
  );

  const totalCountRequests = Object.values(groupedData).reduce(
    (acc, cur) => acc + cur.requests,
    0
  );

  const chartData = [...Object.entries(groupedData)]
    .map(([date, snapshotCosts]) => {
      return {
        date,
        ...snapshotCosts,
      };
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return {
    data: chartData,
    totalCountContext,
    totalCountGenerated,
    totalCountRequests,
    loading: false,
  };
};
