import useDebounce from "@/lib/use-debounce";
import { currencyFormat, truncateEmail } from "@/lib/utils";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { BarChart } from "@tremor/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const dataFormatter = (number: number) => {
  return `$ ${Intl.NumberFormat("us").format(number).toString()}`;
};

interface UserCostChartProps {
  from: Date | undefined;
  to: Date | undefined;
}

const UserCostChart = ({ from, to }: UserCostChartProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Debounce the search
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const params = new URLSearchParams({
      search: debouncedSearch,
      pageNumber: (pageIndex + 1).toString(),
      pageSize: pageSize.toString(),
      ...(sorting.length > 0 && {
        sortBy: sorting[0].id,
        sortOrder: sorting[0].desc ? "desc" : "asc",
      }),
      ...(from && { start: format(from, "yyyy-MM-dd") }),
      ...(to && { end: format(to, "yyyy-MM-dd") }),
    });

    const apiUrl = `/api/v1/users?${params.toString()}`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setUsers(
          data.users.map((user: any) => ({
            ...user,
            cost: user.total_cost,
            user_id: truncateEmail(user.user_id),
          }))
        );
        setTotalCount(data.totalCount);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [debouncedSearch, pageIndex, pageSize, sorting, from, to]);

  return (
    <BarChart
      data={users}
      index="user_id"
      categories={["cost"]}
      colors={["amber"]}
      valueFormatter={(value) => currencyFormat(value, "USD", 2)}
    />
  );
};

export default UserCostChart;
