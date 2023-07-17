import openai from "@/lib/services/openai";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const useBillingData = (startDate: Date, endDate: Date) =>
  useQuery({
    queryKey: [
      "billing",
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd"),
    ],
    queryFn: () => openai.getBillingUsage(startDate, endDate),
  });
