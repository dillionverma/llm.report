import { useUsageData } from "@/lib/hooks/api/useUsageData";
import { UsageResponse } from "@/lib/types";

export const useUsageDataCumulative = (startDate: Date, endDate: Date) => {
  const query = useUsageData(startDate, endDate);

  if (query.some((result) => result.isLoading || result.isError)) {
    return {
      contextTokenData: [],
      generatedTokenData: [],
      totalTokenData: [],
      requestData: [],
      loading: true,
    };
  }

  const data = query.map((result) => result.data as UsageResponse);

  const undefined = data.some((result) => typeof result === "undefined");

  if (undefined) {
    return {
      contextTokenData: [],
      generatedTokenData: [],
      totalTokenData: [],
      requestData: [],
      loading: true,
    };
  }

  const cumulativeUsage = data.reduce(
    (acc, cv) => {
      return {
        ...acc,
        total: acc.total + cv.data.reduce((acc, cv) => acc + cv.n_requests, 0),
        requests: cv.data.reduce((acc, cv) => {
          return {
            ...acc,
            [cv.snapshot_id]:
              // @ts-ignore
              (acc[cv.snapshot_id] || 0) + cv.n_requests,
          };
        }, acc.requests),

        contextTokens: cv.data.reduce((acc, cv) => {
          return {
            ...acc,
            [cv.snapshot_id]:
              // @ts-ignore
              (acc[cv.snapshot_id] || 0) + cv.n_context_tokens_total,
          };
        }, acc.contextTokens),
        generatedTokens: cv.data.reduce((acc, cv) => {
          return {
            ...acc,
            [cv.snapshot_id]:
              // @ts-ignore
              (acc[cv.snapshot_id] || 0) + cv.n_generated_tokens_total,
          };
        }, acc.generatedTokens),
      };
    },
    { total: 0, requests: {}, contextTokens: {}, generatedTokens: {} }
  );

  const contextTokenData = Object.entries(cumulativeUsage.contextTokens)
    .map(([name, value]): { name: string; value: number } => ({
      name,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value);

  const generatedTokenData = Object.entries(cumulativeUsage.generatedTokens)
    .map(([name, value]): { name: string; value: number } => ({
      name,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value);

  const totalTokenData = [
    ...Object.entries(cumulativeUsage.contextTokens).map(
      ([name, value]): { name: string; value: number } => ({
        name,
        value: value as number,
      })
    ),
    ...Object.entries(cumulativeUsage.generatedTokens).map(
      ([name, value]): { name: string; value: number } => ({
        name,
        value: value as number,
      })
    ),
  ]
    .reduce((acc, obj) => {
      const found = acc.find((item) => item.name === obj.name);
      if (found) {
        found.value += obj.value;
      } else {
        acc.push(obj);
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.value - a.value);

  const requestData = Object.entries(cumulativeUsage.requests)
    .map(([name, value]): { name: string; value: number } => ({
      name,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    contextTokenData,
    generatedTokenData,
    totalTokenData,
    requestData,
    loading: false,
  };
};
