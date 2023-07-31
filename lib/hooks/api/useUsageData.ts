import usageDay1 from "@/fixtures/openai/usage-day-1.json";
import { rateLimitQuery } from "@/lib/rateLimit";
import openai, { OpenAI } from "@/lib/services/openai";
import { dateRange } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

export const useUsageData = (
  startDate: Date,
  endDate: Date,
  rateLimitingEnabled: Boolean = true
) => {
  const dates = dateRange(startDate, endDate);
  const { status } = useSession();

  return useQueries({
    // Reverse the dates so that the most recent date is first
    queries: dates.reverse().map((date) => ({
      queryKey: ["usage", format(date, "yyyy-MM-dd")],

      // Rate limit requests to 5 per minute
      queryFn: () =>
        rateLimitingEnabled
          ? rateLimitQuery(openai.getUsage, date)
          : openai.getUsage(date),

      // stale time of 5 minutes if day is today, otherwise infinity
      staleTime:
        format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
          ? 1000 * 60 * 5
          : Infinity,

      enabled: OpenAI.hasKey() && status === "authenticated",
      placeholderData: status === "unauthenticated" ? usageDay1[0] : undefined,
    })),
  });
};
