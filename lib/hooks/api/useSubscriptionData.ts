import subscriptionResponse from "@/fixtures/openai/subscription.json";
import openai, { OpenAI } from "@/lib/services/openai";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useSubscriptionData = () => {
  const { status } = useSession();

  return useQuery({
    // @ts-ignore
    queryKey: ["subscription"],
    queryFn: openai.getSubscription,
    enabled: OpenAI.hasKey() && status === "authenticated",
    placeholderData:
      status === "unauthenticated" ? subscriptionResponse : undefined,
  });
};
