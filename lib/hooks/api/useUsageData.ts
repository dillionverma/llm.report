import openai from "@/lib/services/openai";
import { dateRange } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { format } from "date-fns";

export const useUsageData = (startDate: Date, endDate: Date) => {
  const dates = dateRange(startDate, endDate);

  return useQueries({
    queries: dates.map((date) => ({
      queryKey: ["usage", format(date, "yyyy-MM-dd")],
      queryFn: () => openai.getUsage(date),
      // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      // staleTime: 1000 * 60 * 5, // 5 minutes
    })),
  });
};
