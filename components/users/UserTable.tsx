"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/lib/use-debounce";
import { cn, currencyFormat, numberFormat, truncateEmail } from "@/lib/utils";
import { Request } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, EyeOff, LucideMessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DataTablePagination } from "../DataTablePagination";
import { Input } from "../ui/input";
import Link from "next/link";
import { Button } from "../ui/button";

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "user_id",
    header: "User Id",
    cell: ({ row }) => {
      const value = row.getValue("user_id") as string;
      const [showEmail, setShowEmail] = useState(false);
      const toggleEmail = (event: any) => {
        event.stopPropagation();
        setShowEmail(!showEmail);
      };
      return (
        <div>
          <Button variant={"ghost"} onClick={toggleEmail}>
            {showEmail ? (
              <>
                <div className="flex items-center w-fit">
                  <Link
                    href={`/users/${row.original.user_id}`}
                    className="hover:text-indigo-600"
                  >
                    {value}
                  </Link>{" "}
                  <Button variant={"ghost"} onClick={toggleEmail}>
                    <EyeOff className="w-4 h-4 ml-3 hover:text-indigo-500" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center w-fit">
                {truncateEmail(value)}{" "}
                <Button variant={"ghost"} onClick={toggleEmail}>
                  <Eye className="w-4 h-4 ml-3 hover:text-indigo-500" />
                </Button>
              </div>
            )}
          </Button>
          {showEmail && <div>{row.getValue("email")}</div>}
        </div>
      );
    },
  },
  {
    accessorKey: "total_requests",
    header: "# Requests",
    cell: ({ row }) => {
      const value = row.getValue("total_requests") as number;
      return <div>{numberFormat(value)}</div>;
    },
  },
  {
    accessorKey: "total_prompt_tokens",
    header: "Total Prompt Tokens",
    cell: ({ row }) => {
      const value = row.getValue("total_prompt_tokens") as number;
      return <div>{numberFormat(value)}</div>;
    },
  },
  {
    accessorKey: "total_completion_tokens",
    header: "Total Completion Tokens",
    cell: ({ row }) => {
      const value = row.getValue("total_completion_tokens") as number;
      return <div>{numberFormat(value)}</div>;
    },
  },
  {
    accessorKey: "total_cost",
    header: "Total Cost ($)",
    cell: ({ row }) => {
      const cost = row.getValue("total_cost") as number;
      return <div>{currencyFormat(cost, "USD", 4)}</div>;
    },
  },
];

export const endpoints = [
  {
    label: "/chat/completions",
    value: "/chat/completions",
    icon: LucideMessageCircle,
  },
  {
    label: "/completions",
    value: "/completions",
    icon: LucideMessageCircle,
  },
];

interface UserTableProps {
  from: Date | undefined;
  to: Date | undefined;
}

export function UserTable({ from, to }: UserTableProps) {
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

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    manualSorting: true,
    onSortingChange: setSorting,

    manualPagination: true,
    onPaginationChange: setPagination,

    manualFiltering: true,
    onGlobalFilterChange: setSearch,

    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter: search,
    },
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
        console.log("Data fetched:", data.users);
        setUsers(data.users);
        setTotalCount(data.totalCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedSearch, pageIndex, pageSize, sorting, from, to]);

  // const isFiltered =
  //   table.getPreFilteredRowModel().rows.length >
  //   table.getFilteredRowModel().rows.length;

  return (
    <div>
      <div className="flex items-center justify-between py-4 space-x-2">
        <Input
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        {/* {table.getColumn("url") && (
          <DataTableFacetedFilter
            column={table.getColumn("url")}
            title="API"
            options={endpoints}
          />
        )} */}
        {/* {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="w-4 h-4 ml-2" />
          </Button>
        )} */}
        {/* <div className="flex flex-row space-x-2">
          <CSVLink
            filename={`logs-${new Date().getTime()}.csv`}
            // enclosingCharacter={`"`}
            data={requests.map((log: any) => {
              return {
                createdAt: log.createdAt,
                id: log.id,
                ip: log.ip,
                url: log.url,
                method: log.method,
                status: log.status,
                cached: log.cached,
                streamed: log.streamed,
                prompt:
                  new URL(log.url).pathname === "/v1/completions"
                    ? `"${log.prompt}"`
                    : `"${log.request_body.messages.map(
                        (m: any) => `${m.role}:\n ${m.content}\n `
                      )}"`.replace(/"/g, '""'),
                completion: log.completion,
              };
            })}
          >
            <Button variant="outline" size="sm">
              Export
              <Download className="w-4 h-4 ml-2" />
            </Button>
          </CSVLink>
        </div> */}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className={cn({
              "blur-sm": isLoading,
            })}
          >
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    router.push(`/users/${row.original.user_id}`);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="py-4">
        <DataTablePagination table={table} totalCount={totalCount} />
      </div>
    </div>
  );
}

export default UserTable;
