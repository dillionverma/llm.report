import { rateLimitQuery } from "@/lib/rateLimit";
import openai from "@/lib/services/openai";
import { dateRange } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { format } from "date-fns";

export const useUsageData = (startDate: Date, endDate: Date) => {
  const dates = dateRange(startDate, endDate);

  return useQueries({
    // Reverse the dates so that the most recent date is first
    queries: dates.reverse().map((date) => ({
      queryKey: ["usage", format(date, "yyyy-MM-dd")],

      // Rate limit requests to 5 per minute
      queryFn: () => rateLimitQuery(openai.getUsage, date),

      // stale time of 5 minutes if day is today, otherwise infinity
      staleTime:
        format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
          ? 1000 * 60 * 5
          : Infinity,
    })),
  });
};
