import openai from "@/lib/services/openai";
import { useQuery } from "@tanstack/react-query";

export const useSubscriptionData = () =>
  useQuery({
    queryKey: ["subscription"],
    queryFn: openai.getSubscription,
  });
