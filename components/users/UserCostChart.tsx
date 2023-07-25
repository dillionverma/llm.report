import useDebounce from "@/lib/use-debounce";
import { currencyFormat } from "@/lib/utils";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { BarChart } from "@tremor/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const dataFormatter = (number: number) => {
  return `$ ${Intl.NumberFormat("us").format(number).toString()}`;
};

const UserCostChart = () => {
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
    pageSize: 20,
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
    });

    const apiUrl = `/api/v1/users?${params.toString()}`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setUsers(
          data.users.map((user: any) => ({ ...user, cost: user.total_cost }))
        );
        setTotalCount(data.totalCount);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [debouncedSearch, pageIndex, pageSize, sorting]);

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
