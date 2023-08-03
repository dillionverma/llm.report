"use client";

import { calculateCost } from "@/lib/llm/calculateCost";
import useDebounce from "@/lib/use-debounce";
import { currencyFormat } from "@/lib/utils";
import { Request } from "@prisma/client";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { BarChart } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const dataFormatter = (number: number) => {
  return `$ ${Intl.NumberFormat("us").format(number).toString()}`;
};

const UserCostPerDayChart = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Debounce the search
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10000,
  });

  useEffect(() => {
    const params = new URLSearchParams({
      ...(userId && {
        user_id: userId,
      }),
      search: debouncedSearch,
      pageNumber: (pageIndex + 1).toString(),
      pageSize: pageSize.toString(),
      ...(sorting.length > 0 && {
        sortBy: sorting[0].id,
        sortOrder: sorting[0].desc ? "desc" : "asc",
      }),
    });

    const apiUrl = `/api/v1/requests?${params.toString()}`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests);

        // group by date and sum the cost
        const grouped: Record<
          string,
          { completion_tokens: number; prompt_tokens: number; cost: number }
        > = data.requests
          .filter(
            (request: Request) =>
              request.user_id !== null &&
              request.user_id !== "" &&
              request.model !== null &&
              request.prompt_tokens !== null &&
              request.completion_tokens !== null
          )
          .reduce((acc: any, curr: Request) => {
            const date = new Date(curr.createdAt).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = {
                completion_tokens: 0,
                prompt_tokens: 0,
                cost: 0,
              };
            }
            acc[date].completion_tokens += curr.completion_tokens;
            acc[date].prompt_tokens += curr.prompt_tokens;
            acc[date].cost += calculateCost({
              model: curr.model!,
              input: curr.completion_tokens!,
              output: curr.prompt_tokens!,
            });
            return acc;
          }, {} as Record<string, { completion_tokens: number; prompt_tokens: number; cost: number }>);

        const groupedArray = Object.entries(grouped).map(
          ([date, { completion_tokens, prompt_tokens, cost }]) => ({
            createdAt: date,
            completion_tokens,
            prompt_tokens,
            cost,
          })
        );
        setRequests(groupedArray);
        setTotalCount(data.totalCount);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [debouncedSearch, pageIndex, pageSize, sorting, userId]);

  return (
    <BarChart
      data={requests}
      index="createdAt"
      categories={["cost"]}
      colors={["amber"]}
      valueFormatter={(value) => currencyFormat(value, "USD", 2)}
    />
  );
};

export default UserCostPerDayChart;
