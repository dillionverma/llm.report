import usageDay1 from "@/fixtures/openai/usage-day-1.json";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import openai from "@/lib/services/openai";
import { Category } from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import { dateRange } from "@/lib/utils";
import { AreaChart, Flex, Metric, Text, Title } from "@tremor/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const TokenChart = ({
  startDate,
  endDate,
  categories,
  defaultLoading,
  demo,
}: {
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  categories: Category[];
  defaultLoading?: boolean;
  demo?: boolean;
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [key] = useLocalStorage<string>(LOCAL_STORAGE_KEY);

  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading(true);

      const dates = dateRange(startDate, endDate);

      openai.setKey(key);

      let data;
      try {
        if (demo) {
          data = usageDay1;
        } else {
          data = await Promise.all(dates.map((date) => openai.getUsage(date)));
        }
      } catch (e) {
        console.error(e);
        return;
      }

      // Group data by aggregation_timestamp and calculate costs
      const groupedData = data
        .flatMap((day) => day.data)
        .reduce((acc, cur) => {
          const date = format(
            new Date(cur.aggregation_timestamp * 1000),
            "h:mm a"
          );

          acc.push({
            date: date,
            context: cur.n_context_tokens_total,
            generated: cur.n_generated_tokens_total,
            requests: cur.n_requests,
          });

          return acc;
        }, [] as { [key: string]: any });

      const totalCount = Object.values(groupedData).reduce(
        (acc, cur) => acc + cur.context,
        0
      );

      setTotal(totalCount);

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

      setData(chartData);
      setLoading(false);
    })();
  }, [startDate, endDate, key, session, demo]);

  if (defaultLoading || loading) {
    return (
      <div className="flex flex-col h-56">
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
        {/* <LoadingChart /> */}
        <div className="flex flex-1" />
        <div className="flex mt-3 bg-gray-200 rounded-full  w-full h-4 mb-2.5 "></div>
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
          // stack
          index="date"
          categories={["context"]}
          colors={["blue"]}
          showLegend={false}
          showYAxis={false}
          // showXAxis={false}
          showGridLines={false}
          startEndOnly
          showAnimation={false}
          connectNulls
          // valueFormatter={dataFormatter}
        />
      )}
    </>
  );
};

export default TokenChart;
