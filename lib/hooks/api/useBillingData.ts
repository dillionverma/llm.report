import openai from "@/lib/services/openai";
import { useQuery } from "@tanstack/react-query";

export const useBillingData = (startDate: Date, endDate: Date) =>
  useQuery({
    queryKey: ["billing"],
    queryFn: () => openai.getBillingUsage(startDate, endDate),
  });
