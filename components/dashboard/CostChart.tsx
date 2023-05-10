import usageDay1 from "@/fixtures/openai/usage-day-1.json";
import usageRange from "@/fixtures/openai/usage-range.json";
import {
  AUDIO_MODELS,
  CHAT_GPT3_MODELS,
  CHAT_GPT4_MODELS,
  COMPLETION_MODELS,
  EMBEDDING_MODELS,
  FINE_TUNED_MODELS,
  IMAGE_MODEL_COST,
  LOCAL_STORAGE_KEY,
  MODEL_COST,
  MODEL_TO_COLOR,
  RESOLUTIONS,
  SELECTION_KEY,
} from "@/lib/constants";
import openai from "@/lib/services/openai";
import {
  BillingUsageResponse,
  Category,
  Resolution,
  Snapshot,
} from "@/lib/types";
import useLocalStorage from "@/lib/use-local-storage";
import { dateRange } from "@/lib/utils";
import { BarChart, Flex, Metric, Text, Title } from "@tremor/react";
import { add, format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const dataFormatter = (number: number) => {
  return "$ " + Intl.NumberFormat("us").format(number).toString();
};

type Select = "minute" | "day" | "cumulative";

const CostChart = ({
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
  const [dailyCosts, setDailyCosts] = useState<
    BillingUsageResponse["daily_costs"]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [totalUsage, setTotalUsage] = useState(0);
  const [key, setKey] = useLocalStorage<string>(LOCAL_STORAGE_KEY);
  const [selection, setSelection] = useLocalStorage<Select>(
    SELECTION_KEY,
    "day"
  );

  const [firstLoad, setFirstLoad] = useLocalStorage<boolean>(
    "first-load",
    true
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

      let response;
      if (demo) {
        response = usageRange as BillingUsageResponse;
      } else {
        if (firstLoad) {
          toast.loading(
            "Fetching data from OpenAI... (this may take up to 30 seconds)",
            {
              duration: 10000,
            }
          );
          setFirstLoad(false);
        }

        openai.setKey(key);

        let d = endDate;

        // if same day, add 1 day to endDate
        if (startDate.toDateString() === endDate.toDateString()) {
          d = add(endDate, { days: 1 });
        }
        response = await openai.getBillingUsage(startDate, d);
      }

      // console.log(response);
      const daily_costs = response.daily_costs;
      setDailyCosts(daily_costs);
      setLoading(false);
    })();
  }, [startDate, endDate, key, session]);

  const [data2, setData2] = useState<{ time: string; cost: number }[]>([]);

  useEffect(() => {
    (async () => {
      if (!startDate || !endDate) {
        return;
      }

      setLoading2(true);

      const dates = dateRange(startDate, endDate);

      openai.setKey(key);

      let data2;
      try {
        console.log("DEMOOOO", demo);
        if (demo) {
          data2 = usageDay1;
        } else {
          data2 = await Promise.all(dates.map((date) => openai.getUsage(date)));
        }
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
            "h:mm a"
          );

          if (!acc[date]) {
            acc[date] = {};
          }

          const cost =
            MODEL_COST[cur.snapshot_id as Snapshot]! *
            (cur.n_generated_tokens_total + cur.n_context_tokens_total);

          if (!acc[date][cur.snapshot_id]) {
            acc[date][cur.snapshot_id] = cost;
          } else {
            acc[date][cur.snapshot_id] += cost;
          }

          return acc;
        }, {} as { [key: string]: any });

      const groupedDalleData = data2
        .flatMap((day) => day.dalle_api_data)
        .reduce((acc, cur) => {
          const date = format(
            new Date(cur.timestamp * 1000),
            "MMMM d, yyyy h:mm a"
          );

          if (!acc[date]) {
            acc[date] = {};
          }

          const cost =
            IMAGE_MODEL_COST[cur.image_size as Resolution] * cur.num_images;

          if (!acc[date][cur.image_size]) {
            acc[date][cur.image_size] = cost;
          } else {
            acc[date][cur.image_size] += cost;
          }

          return acc;
        }, {} as { [key: string]: any });

      console.log("groupedDalleData", groupedDalleData);

      const chartData = [
        ...Object.entries(groupedData),
        ...Object.entries(groupedDalleData),
      ]
        .map(([date, snapshotCosts]) => {
          return {
            date,
            ...snapshotCosts,
          };
        })
        .sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

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

      const groupedDalleData1 = data2
        .flatMap((day) => day.dalle_api_data)
        .reduce((acc, cur) => {
          const snapshotId = cur.image_size;
          if (!acc[snapshotId]) {
            acc[snapshotId] = [];
          }
          return acc;
        }, {} as { [key: string]: any });

      const snapshots = [
        ...Object.keys(groupedData1),
        ...Object.keys(groupedDalleData1),
      ];

      // @ts-ignore
      setSnapshots(snapshots);
      // @ts-ignore

      const selectedSnapshots = categories.flatMap((category) => {
        switch (category) {
          case "Audio models":
            return AUDIO_MODELS;
          case "Chat models":
            return CHAT_GPT3_MODELS;
          case "Embedding models":
            return EMBEDDING_MODELS;
          case "Fine-tuned models":
            return FINE_TUNED_MODELS;
          case "GPT-4":
            return CHAT_GPT4_MODELS;
          case "Image models":
            return RESOLUTIONS;
          case "Instruct models":
            return COMPLETION_MODELS;
          default:
            return [];
        }
      });

      setSelectedSnapshots(selectedSnapshots);

      setLoading2(false);
    })();
  }, [startDate, endDate, key, session, selection, categories, demo]);

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedSnapshots, setSelectedSnapshots] = useState<Snapshot[]>([]);

  console.log("loading", loading, loading2);
  if (defaultLoading || loading || loading2) {
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
      <Flex alignItems="start">
        <div>
          <Title>Cost</Title>
          <Metric>$ {(totalUsage / 100).toFixed(2)}</Metric>
          <Text>today so far</Text>
        </div>
      </Flex>
      {data2.length > 0 && (
        <BarChart
          className="mt-6 h-32"
          data={data2}
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
