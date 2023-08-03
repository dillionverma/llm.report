"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { endOfMonth, format, startOfMonth } from "date-fns";

export const useLogCount = ({
  start = startOfMonth(new Date()),
  end = endOfMonth(new Date()),
}: {
  start?: Date;
  end?: Date;
}) => {
  const params = new URLSearchParams({
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  });

  return useQuery({
    queryKey: ["logCount"],
    queryFn: async () =>
      (await axios.get(`/api/v1/requests/count?${params.toString()}`)).data,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 60,
    staleTime: 0,
    cacheTime: 0,
    retry: 3,
  });
};
