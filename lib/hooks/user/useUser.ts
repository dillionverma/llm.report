import { fetcher } from "@/lib/utils";
import { Payment, Subscription, User } from "@prisma/client";
import useSWR from "swr";

interface UserWithSubscriptions extends User {
  subscriptions: Subscription[];
  payments: Payment[];
}
export const useUser = () => {
  const { data, isLoading } = useSWR<{ user: UserWithSubscriptions }>(
    "/api/v1/me",
    fetcher
  );

  return {
    user: data?.user,
    isLoading,
    subscribed: data?.user?.subscriptions.some(
      (sub) => sub.status === "active"
    ),
  };
};
