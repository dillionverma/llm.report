import {
  AUDIO_MODELS,
  CHAT_GPT3_MODELS,
  CHAT_GPT4_MODELS,
  COMPLETION_MODELS,
  EMBEDDING_MODELS,
  FINE_TUNED_MODELS,
  IMAGE_MODEL_COST,
  IMAGE_RESOLUTIONS,
  MODEL_COST,
} from "@/lib/constants";
import { useUsageData } from "@/lib/hooks/api/useUsageData";
import { Category, ImageResolution, Snapshot } from "@/lib/types";
import { format } from "date-fns";

export const useCostChartData = (
  startDate: Date,
  endDate: Date,
  categories: Category[],
  rateLimitingEnabled: boolean = true
) => {
  const query = useUsageData(startDate, endDate, rateLimitingEnabled);

  if (query.some((result) => result.isLoading || result.isError)) {
    return { data: [], loading: true };
  }

  const data = query.map((result) => result.data);

  // Group data by aggregation_timestamp and calculate costs
  const groupedData = data
    .flatMap((day) => day!.data)
    .reduce((acc, cur) => {
      const date = format(
        new Date(cur.aggregation_timestamp * 1000),
        "MMMM d, yyyy h:mm a"
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

  const groupedDalleData = data
    .flatMap((day) => day!.dalle_api_data)
    .reduce((acc, cur) => {
      const date = format(
        new Date(cur.timestamp * 1000),
        "MMMM d, yyyy h:mm a"
      );

      // console.log("date", date);

      if (!acc[date]) {
        acc[date] = {};
      }

      const cost =
        IMAGE_MODEL_COST[cur.image_size as ImageResolution] * cur.num_images;

      if (!acc[date][cur.image_size]) {
        acc[date][cur.image_size] = cost;
      } else {
        acc[date][cur.image_size] += cost;
      }

      return acc;
    }, {} as { [key: string]: any });

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

  // // grouped by snapshot_id
  const groupedData1 = data
    .flatMap((day) => day!.data)
    .reduce((acc, cur) => {
      const snapshotId = cur.snapshot_id;
      if (!acc[snapshotId]) {
        acc[snapshotId] = [];
      }
      return acc;
    }, {} as { [key: string]: any });

  const groupedDalleData1 = data
    .flatMap((day) => day!.dalle_api_data)
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

  const selectedSnapshots = categories.flatMap((category) => {
    switch (category) {
      case "Audio models":
        return AUDIO_MODELS;
      case "GPT-3.5 Turbo":
        return CHAT_GPT3_MODELS;
      case "Embedding models":
        return EMBEDDING_MODELS;
      case "Fine-tuning models":
        return FINE_TUNED_MODELS;
      case "GPT-4":
        return CHAT_GPT4_MODELS;
      case "GPT-4 Turbo":
        return CHAT_GPT4_MODELS;
      case "Image models":
        return IMAGE_RESOLUTIONS;
      case "InstructGPT":
        return COMPLETION_MODELS;
      default:
        return [];
    }
  });

  console.log({ chartData, snapshots, selectedSnapshots });
  return {
    data: chartData,
    snapshots,
    selectedSnapshots,
  };
};
