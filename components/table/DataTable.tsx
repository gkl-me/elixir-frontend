"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ReactNode } from "react";

export interface TableFetchParams {
  search: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;

  // State
  pageIndex: number;
  pageSize: number;
  search: string;
  sorting: SortingState;

  // Handlers
  onPageChange: (newPageIndex: number) => void;
  onSearchChange: (newSearch: string) => void;
  onSortingChange: (newSorting: SortingState) => void;

  // Slots
  renderFilters?: () => ReactNode;

  title?: string;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pageIndex,
  pageSize,
  search,
  sorting,
  onPageChange,
  onSearchChange,
  onSortingChange,
  renderFilters,
  title,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
      globalFilter: search,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    onPaginationChange: (updater) => {
      // Handle both functional updates and direct values for pagination
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      onPageChange(newState.pageIndex);
    },
    onSortingChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(sorting) : updater;
      onSortingChange(newState);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-6">
      {title && (
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-white">{title}</h2>
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-purple to-purpleDark"></div>
        </div>
      )}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
        {/* Search Input */}
        <div className="relative w-full min-w-[180px] flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            className="border-purple/30 bg-blueDark/50 pl-10 text-white transition-all duration-300 placeholder:text-gray-400 hover:border-purple/50 focus:border-purple focus:ring-purple/20"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records..."
          />
        </div>

        {/* Generic Filters Slot */}
        {renderFilters && (
          <div className="flex flex-wrap gap-4">{renderFilters()}</div>
        )}
      </div>

      {/* Table Container */}
      <div className="scrollbar-hide overflow-x-auto rounded-xl border-2 border-purple/30 bg-gradient-to-b from-navy/50 to-navyDark/50 shadow-2xl backdrop-blur-sm">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-b border-purple/20 bg-gradient-to-r from-navy via-blueDark to-navy transition-all duration-300 hover:bg-gradient-to-r hover:from-purple/10 hover:via-purpleDark/10 hover:to-purple/10"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap border-r border-purple/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white last:border-r-0 md:px-6 md:py-4"
                    >
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-purple"></div>
                    <div className="h-4 w-4 animate-pulse rounded-full bg-purple delay-75"></div>
                    <div className="h-4 w-4 animate-pulse rounded-full bg-purple delay-150"></div>
                    <span className="ml-3 text-white/70">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={`border-b border-navy/30 transition-all duration-300 hover:border-purple/30 hover:bg-gradient-to-r hover:from-purple/10 hover:via-purpleDark/10 hover:to-purple/10 hover:shadow-lg ${index % 2 === 0 ? "bg-navyDark/20" : "bg-navy/20"} `}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-r border-navy/10 px-6 py-4 text-white/90 last:border-r-0"
                    >
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
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple/20 to-purpleDark/20">
                      <Search className="h-8 w-8 text-purple/60" />
                    </div>
                    <div className="text-lg font-medium text-white/70">
                      No results found
                    </div>
                    <div className="text-sm text-white/50">
                      Try adjusting your search or filters
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-purple/30 bg-navy/50 text-white transition-all duration-300 hover:border-purple hover:bg-purple/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="rounded-md bg-gradient-to-r from-purple to-purpleDark px-3 py-1 text-sm font-medium text-white">
              {pageIndex + 1}
            </span>
            {table.getPageCount() > 0 && (
              <span className="text-sm font-medium text-gray-400">
                of {table.getPageCount()}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-purple/30 bg-navy/50 text-white transition-all duration-300 hover:border-purple hover:bg-purple/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
