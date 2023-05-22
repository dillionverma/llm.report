"use client";

import { Button } from "@/components/ui/button";
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
import { truncate } from "@/lib/utils";
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
import { Tab, TabList } from "@tremor/react";
import { format } from "date-fns";
import {
  CurlyBraces,
  Download,
  LucideMessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTablePagination } from "./DataTablePagination";
import { Input } from "./ui/input";

const RenderMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      className="prose max-w-none text-sm text-black overflow-x-auto"
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
};

interface TableRowProps {
  label: string;
  value: string;
  preformatted?: boolean;
}

const TR: React.FC<TableRowProps> = ({ label, value, preformatted }) => {
  const cellClasses = "px-6 py-2";

  return (
    <tr>
      <td className="font-medium text-gray-500 text-right px-6">{label}</td>
      <td className={cellClasses}>
        {preformatted ? (
          <pre className="overflow-auto whitespace-pre-wrap">
            <code>{value}</code>
          </pre>
        ) : (
          value
        )}
      </td>
    </tr>
  );
};

const RequestDialog = ({
  request,
  isOpen,
  closeModal,
}: {
  request: any;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  type TabState = "pretty" | "raw";
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
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-300 sm:duration-500"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transform transition ease-in-out duration-300 sm:duration-500"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="pointer-events-auto relative w-screen max-w-xl">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-in-out duration-300"
                          enterFrom="opacity-0"
                          enterTo="opacity-100"
                          leave="ease-in-out duration-300"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                            <button
                              type="button"
                              className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white
                          "
                              onClick={closeModal}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </Transition.Child>
                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                          <div className="px-4 sm:px-6">
                            <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                              Request
                            </Dialog.Title>
                          </div>
                          {/* <pre>
                        <code>{JSON.stringify(request, null, 2)}</code>
                      </pre> */}
                          <div className="mt-6 flex-1 px-4 sm:px-6">
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
                                <TR
                                  label="cached"
                                  value={request.cached ? "true" : "false"}
                                />
                                <TR
                                  label="streamed"
                                  value={request.streamed ? "true" : "false"}
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
                            <TabList
                              defaultValue="pretty"
                              onValueChange={(value) =>
                                setTab(value as TabState)
                              }
                              className="mt-6"
                            >
                              <Tab
                                value="pretty"
                                text="Pretty"
                                icon={SparklesIcon}
                              />
                              <Tab value="raw" text="Raw" icon={CurlyBraces} />
                            </TabList>

                            <div className="mt-4">
                              {tab === "pretty" && (
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Prompt
                                  </h3>
                                  <div className="text-sm border border-gray-200 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
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
                                              `${message.content}`
                                          )
                                          .join("\n")}
                                      </RenderMarkdown>
                                    )}
                                  </div>
                                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    Completion
                                  </h3>
                                  <div className="text-sm border border-gray-200 bg-gray-50 rounded-lg p-4">
                                    {new URL(request.url).pathname ===
                                      "/v1/completions" && (
                                      <>
                                        {request.response_body.choices[0].text}
                                      </>
                                    )}
                                    {new URL(request.url).pathname ===
                                      "/v1/chat/completions" &&
                                      !request.streamed && (
                                        <RenderMarkdown>
                                          {
                                            request.response_body.choices[0]
                                              .message.content
                                          }
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
                                  <pre className="overflow-auto whitespace-pre-wrap text-sm bg-gray-100 rounded-lg p-4">
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
                                  <pre className="overflow-auto whitespace-pre-wrap text-sm bg-gray-100 rounded-lg p-4">
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
                                        <ReactMarkdown
                                          remarkPlugins={[remarkGfm]}
                                        >
                                          {request.streamed_response_body}
                                        </ReactMarkdown>
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
        //   <ArrowUpDown className="ml-2 h-4 w-4" />
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
        <div className="whitespace-pre-wrap overflow-x-auto">
          <pre>{new URL(url).pathname}</pre>
        </div>
      );
    },
  },
  {
    accessorKey: "request_body",
    header: "Model",
    cell: ({ row }) => {
      const model = row.getValue("request_body") as any;
      return <div>{model.model}</div>;
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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
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

  //     return <div className="text-right font-medium">{formatted}</div>;
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

export function RequestTable() {
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

    const apiUrl = `/api/v1/requests?${params.toString()}`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests);
        setTotalCount(data.totalCount);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [debouncedSearch, pageIndex, pageSize, sorting]);

  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div>
      <div className="flex items-center justify-between py-4 space-x-2">
        <Input
          placeholder="Search prompts or completions..."
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
            <X className="ml-2 h-4 w-4" />
          </Button>
        )} */}
        <div className="flex flex-row space-x-2">
          {/* <DataTableViewOptions table={table} /> */}
          <CSVLink
            filename={`logs-${new Date().getTime()}.csv`}
            enclosingCharacter={`"`}
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
                      )}"`,
                completion: log.completion,
              };
            })}
          >
            <Button variant="outline" size="sm">
              Export
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </CSVLink>
        </div>
      </div>

      <div className="rounded-md border">
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    setSelectedRequest(row.original);
                    setIsOpen(true);
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap py-2">
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
    </div>
  );
}

export default RequestTable;
