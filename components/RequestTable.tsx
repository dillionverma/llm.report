"use client";

import { DataTableViewOptions } from "@/components/DataTableViewOptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Operator, QueryBuilder, RuleGroupType } from "react-querybuilder";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useDebounce from "@/lib/use-debounce";
import {
  cn,
  currencyFormat,
  numberFormat,
  truncate,
  truncateEmail,
} from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/solid";
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
import { Tab, TabGroup, TabList } from "@tremor/react";
import { format } from "date-fns";
import { CurlyBraces, LucideMessageCircle, MoreHorizontal } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTablePagination } from "./DataTablePagination";
import { RequestExportButton } from "./RequestExportButton";
import { Input } from "./ui/input";

const RenderMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      className="overflow-x-auto text-sm prose text-black whitespace-normal max-w-none"
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
};

interface TableRowProps {
  label: string;
  value: string;
}

const TR: React.FC<TableRowProps> = ({ label, value }) => {
  const cellClasses = "px-6 py-2";

  return (
    <tr>
      <td className="px-6 font-medium text-right text-gray-500">{label}</td>
      <td className={cellClasses}>{value}</td>
    </tr>
  );
};

type TabState = "pretty" | "raw";
const TabStates: TabState[] = ["pretty", "raw"];

const RequestDialog = ({
  request,
  isOpen,
  closeModal,
}: {
  request: any;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const [tab, setTab] = useState<TabState>("pretty");

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {request && (
            <>
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-300 sm:duration-500"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transform transition ease-in-out duration-300 sm:duration-500"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="relative w-screen max-w-[50vw] pointer-events-auto">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-in-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in-out duration-300"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                            <button
                              type="button"
                              className="text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white "
                              onClick={closeModal}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="w-6 h-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </Transition.Child>
                        <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                          <div className="px-4 sm:px-6">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Log
                            </Dialog.Title>
                          </div>
                          {/* <pre>
                        <code>{JSON.stringify(request, null, 2)}</code>
                      </pre> */}
                          <div className="flex-1 px-4 mt-6 sm:px-6">
                            <table className="min-w-full divide-y divide-gray-200">
                              <tbody className="bg-white divide-y divide-gray-200">
                                <TR
                                  label="created at"
                                  value={new Date(
                                    request.createdAt
                                  ).toLocaleString()}
                                />
                                <TR label="id" value={request.openai_id} />
                                <TR label="url" value={request.url} />
                                <TR label="ip" value={request.ip} />
                                <TR label="method" value={request.method} />
                                <TR label="status" value={request.status} />
                                <TR label="model" value={request.model} />
                                <TR
                                  label="cost"
                                  value={currencyFormat(request.cost, "USD", 6)}
                                />
                                <TR
                                  label="prompt tokens"
                                  value={numberFormat(request.prompt_tokens)}
                                />
                                <TR
                                  label="completion tokens"
                                  value={numberFormat(
                                    request.completion_tokens
                                  )}
                                />

                                <TR
                                  label="cached"
                                  value={request.cached ? "true" : "false"}
                                />
                                <TR
                                  label="streamed"
                                  value={request.streamed ? "true" : "false"}
                                />
                                <TR
                                  label="user id"
                                  value={truncateEmail(request.user_id)}
                                />
                                <TR
                                  label="app id"
                                  value={truncateEmail(request.app_id)}
                                />

                                {/* <TableRow
                              label="Request"
                              value={JSON.stringify(
                                request.request_body,
                                null,
                                2
                              )}
                              preformatted
                            />
                            <TableRow
                              label="Response"
                              value={JSON.stringify(
                                request.response_body,
                                null,
                                2
                              )}
                              preformatted
                            /> */}
                              </tbody>
                            </table>
                            <TabGroup
                              defaultIndex={0}
                              onIndexChange={(value) =>
                                setTab(TabStates[value])
                              }
                            >
                              <TabList className="mt-6">
                                <Tab value="pretty" icon={SparklesIcon}>
                                  Pretty
                                </Tab>
                                <Tab value="raw" icon={CurlyBraces}>
                                  Raw
                                </Tab>
                              </TabList>
                            </TabGroup>

                            <div className="mt-4">
                              {tab === "pretty" && (
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Prompt
                                  </h3>
                                  <div className="p-4 text-sm whitespace-pre-wrap border border-gray-200 rounded-lg bg-gray-50">
                                    {new URL(request.url).pathname ===
                                      "/v1/completions" && (
                                      <RenderMarkdown>
                                        {request.request_body.prompt}
                                      </RenderMarkdown>
                                    )}
                                    {new URL(request.url).pathname ===
                                      "/v1/chat/completions" && (
                                      <RenderMarkdown>
                                        {request.request_body.messages
                                          .map(
                                            (message: any) =>
                                              `**${message.role}**: ${message.content}`
                                          )
                                          .join("\n\n")}
                                      </RenderMarkdown>
                                    )}
                                  </div>
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Completion
                                  </h3>
                                  <div className="p-4 text-sm border border-gray-200 rounded-lg bg-gray-50">
                                    {new URL(request.url).pathname ===
                                      "/v1/completions" && (
                                      <>
                                        {request.response_body.choices?.[0]
                                          .text || request.completion}
                                      </>
                                    )}
                                    {new URL(request.url).pathname ===
                                      "/v1/chat/completions" &&
                                      !request.streamed && (
                                        <RenderMarkdown>
                                          {request.response_body.choices?.[0]
                                            .message.content ||
                                            request.completion}
                                        </RenderMarkdown>
                                      )}
                                    {new URL(request.url).pathname ===
                                      "/v1/chat/completions" &&
                                      request.streamed && (
                                        <RenderMarkdown>
                                          {request.completion}
                                        </RenderMarkdown>
                                      )}
                                  </div>
                                </div>
                              )}

                              {tab === "raw" && (
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Request
                                  </h3>
                                  <pre className="p-4 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded-lg">
                                    <code>
                                      {JSON.stringify(
                                        request.request_body,
                                        null,
                                        2
                                      )}
                                    </code>
                                  </pre>
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Response
                                  </h3>
                                  <pre className="p-4 overflow-auto text-sm whitespace-pre-wrap bg-gray-100 rounded-lg">
                                    <code>
                                      {!request.streamed && (
                                        <>
                                          {JSON.stringify(
                                            request.response_body,
                                            null,
                                            2
                                          )}
                                        </>
                                      )}

                                      {request.streamed && (
                                        <RenderMarkdown>
                                          {request.streamed_response_body}
                                        </RenderMarkdown>
                                      )}
                                    </code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </div>
            </>
          )}
        </Dialog>
      </Transition.Root>
    </>
  );
};

const columns: ColumnDef<Request>[] = [
  // {
  //   accessorKey: "id",
  //   header: "ID",
  // },

  {
    accessorKey: "createdAt",
    // header: "Time",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Time" />

        // <Button
        //   variant="ghost"
        //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        // >
        //   Time
        //   <ArrowUpDown className="w-4 h-4 ml-2" />
        // </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div>{format(new Date(date), "MMM dd, p")}</div>;
      // ")}</div>;
    },
  },

  {
    accessorKey: "url",
    header: "API",
    cell: ({ row }) => {
      const url = row.getValue("url") as string;
      return (
        <div className="overflow-x-auto whitespace-pre-wrap">
          <pre>{new URL(url).pathname}</pre>
        </div>
      );
    },
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const value = row.getValue("cost") as number;
      return <div>{currencyFormat(value, "USD", 4)}</div>;
    },
  },
  {
    accessorKey: "cached",
    header: "Cached",
    cell: ({ row }) => {
      const value = (row.getValue("cached") ? "✅" : "❌") as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: "streamed",
    header: "Streamed",
    cell: ({ row }) => {
      const value = (row.getValue("streamed") ? "✅" : "❌") as string;
      return <div>{value}</div>;
    },
  },
  {
    accessorKey: "request_headers",
    header: "Metadata",
    cell: ({ row, cell }) => {
      const value = row.getValue("request_headers") as any;
      // filter out non- x-metadata- headers
      const metadata = Object.entries(value)
        .filter(([key, _]) => key.startsWith("x-metadata"))
        .map(([key, value], i) => (
          <Badge key={i} variant="outline">
            {key.replace("x-metadata-", "")}:{value as string}
          </Badge>
        ));

      return metadata;
    },
  },
  {
    accessorKey: "request_body",
    header: "Prompt",
    cell: ({ row }) => {
      const body = row.getValue("request_body") as any;
      const url = row.getValue("url") as string;
      const path = new URL(url).pathname;

      if (path === "/v1/completions") {
        return <div>{body.prompt}</div>;
      } else if (path === "/v1/chat/completions") {
        return <div>{truncate(body.messages[0].content, 50)}</div>;
      }

      // const prompt = body.messages
      //   .map((message: any) => `${message.role}: ${message.content}`)
      //   .join("\n");
    },
  },
  {
    accessorKey: "completion",
    header: "Completion",
    cell: ({ row }) => {
      const value = row.getValue("completion") as any;
      return <div>{truncate(value, 50)}</div>;
    },
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => {
      const value = row.getValue("user_id") as string;
      return <div>{truncateEmail(value)}</div>;
    },
  },
  {
    accessorKey: "app_id",
    header: "App ID",
    cell: ({ row }) => {
      const value = row.getValue("app_id") as string;
      return <div>{truncateEmail(value)}</div>;
    },
  },

  // {
  //   accessorKey: "response_body",
  //   header: "Completion",
  //   cell: ({ row }) => {
  //     const body = row.getValue("response_body") as any;
  //     const url = row.getValue("url") as string;
  //     const path = new URL(url).pathname;

  //     if (path === "/v1/completions") {
  //       return (
  //         // <div className="whitespace-pre-wrap">
  //         //   <pre>{body.choices[0].text}</pre>
  //         // </div>
  //         <>{truncate(body.choices[0].text, 50)}</>
  //       );
  //     } else if (path === "/v1/chat/completions") {
  //       if (row.original.streamed) {
  //         return truncate(
  //           getCompletionFromStream(row.original.streamed_response_body!),
  //           50
  //         );
  //       }
  //       return (
  //         <>{truncate(body.choices[0].message.content, 50)}</>
  //         // <div className="whitespace-pre-wrap">
  //         //   <pre>{truncate(body.choices[0].message.content, 30)}</pre>
  //         // </div>
  //       );
  //     } else {
  //       return "N/A";
  //     }
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

      const url = row.getValue("url") as string;
      const path = new URL(url).pathname;

      let completion: string = row.getValue("completion");
      let prompt = "";

      // if (path === "/v1/completions") {
      //   completion = (row.getValue("response_body") as any)?.choices[0].text;
      // } else if (path === "/v1/chat/completions") {
      //   if (row.original.streamed) {
      //     completion = getCompletionFromStream(
      //       row.original.streamed_response_body!
      //     );
      //   } else {
      //     completion = (row.getValue("response_body") as any)?.choices[0]
      //       .message.content;
      //   }
      // }

      if (path === "/v1/completions") {
        prompt = (row.getValue("request_body") as any)?.prompt;
      } else if (path === "/v1/chat/completions") {
        prompt = (row.getValue("request_body") as any)?.messages
          .map((message: any) => `${message.content}`)
          .join("\n");
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(prompt);
              }}
            >
              Copy Prompt
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(completion);
              }}
            >
              Copy Completion
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();

                navigator.clipboard.writeText(
                  JSON.stringify(request.request_body)
                );
              }}
            >
              Copy Request (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                if (request.streamed) {
                  navigator.clipboard.writeText(
                    JSON.stringify(request.streamed_response_body)
                  );
                } else {
                  navigator.clipboard.writeText(
                    JSON.stringify(request.response_body)
                  );
                }
              }}
            >
              Copy Response (JSON)
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },

  // {
  //   accessorKey: "method",
  //   header: "Method",
  // },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  // },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="font-medium text-right">{formatted}</div>;
  //   },
  // },
];

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
// }

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

export function RequestTable({ userId }: { userId?: string }) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Debounce the search
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: requests,
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

  const defaultQuery: RuleGroupType = { combinator: "and", rules: [] };
  const defaultOperators: Operator[] = [{ name: "=", label: "=" }];
  const [metadata, setMetadata] = useState<{ label: string; name: string }[]>(
    []
  );
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    (async () => {
      try {
        const apiUrl = `/api/v1/requests/metadata`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        const metadata = data?.map((d: any) => ({ label: d, name: d }));
        setMetadata(metadata);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

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
      filter: JSON.stringify(query),
    });

    const apiUrl = `/api/v1/requests?${params.toString()}`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests);
        setTotalCount(data.totalCount);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedSearch, pageIndex, pageSize, sorting, userId, query]);

  // const isFiltered =
  //   table.getPreFilteredRowModel().rows.length >
  //   table.getFilteredRowModel().rows.length;

  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-row space-x-2 items-center justify-center">
          <Input
            placeholder="Search prompts or completions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[250px]"
          />

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
        </div>

        <div className="flex flex-row space-x-2">
          <DataTableViewOptions table={table} />
          <RequestExportButton />
        </div>
      </div>

      <div className="flex flex-col w-full py-4">
        <QueryBuilder
          fields={metadata}
          defaultQuery={defaultQuery}
          operators={defaultOperators}
          onQueryChange={(q) => setQuery(q)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup, idx1) => (
              <TableRow key={idx1}>
                {headerGroup.headers.map((header, idx2) => {
                  return (
                    <TableHead key={idx2}>
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
              table.getRowModel().rows.map((row, idx1) => (
                <TableRow
                  key={idx1}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    setSelectedRequest(row.original);
                    setIsOpen(true);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell, idx2) => (
                    <TableCell key={idx2} className="py-2 whitespace-nowrap">
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

      <RequestDialog
        request={selectedRequest}
        isOpen={isOpen}
        closeModal={closeModal}
      />

      <div className="py-4">
        <DataTablePagination table={table} totalCount={totalCount} />
      </div>
    </>
  );
}

export default RequestTable;
