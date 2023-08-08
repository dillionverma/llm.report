import usageRange from "@/fixtures/openai/usage-range.json";
import openai, { OpenAI } from "@/lib/services/openai";
import { useQuery } from "@tanstack/react-query";
import { add, format } from "date-fns";
import { useSession } from "next-auth/react";

export const useBillingData = (startDate: Date, endDate: Date) => {
  const { status } = useSession();

  // Add one day to endDate if startDate and endDate are the same
  // if (format(startDate, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd")) {
  endDate = add(endDate, { days: 1 });
  // }

  const queryKey = [
    "billing",
    format(startDate, "yyyy-MM-dd"),
    format(endDate, "yyyy-MM-dd"),
  ];

  return useQuery({
    queryKey,

    // Rate limit requests to 5 per minute
    // queryFn: () => rateLimitQuery(openai.getBillingUsage, startDate, endDate),
    queryFn: () => openai.getBillingUsage(startDate, endDate),

    // stale time of 5 minutes if day is today, otherwise infinity
    staleTime:
      format(endDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
        ? 1000 * 60 * 5
        : Infinity,

    enabled: OpenAI.hasKey() && status === "authenticated",
    placeholderData: status === "unauthenticated" ? usageRange : undefined,
  });
};
