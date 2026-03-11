'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { ReactNode } from "react"

export interface TableFetchParams {
    search: string
    page: number
    limit: number
    sortBy: string
    sortOrder: string
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    totalCount: number

    // State
    pageIndex: number
    pageSize: number
    search: string
    sorting: SortingState

    // Handlers
    onPageChange: (newPageIndex: number) => void
    onSearchChange: (newSearch: string) => void
    onSortingChange: (newSorting: SortingState) => void

    // Slots
    renderFilters?: () => ReactNode

    title?: string
    isLoading?: boolean
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
    isLoading
}: DataTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(totalCount / pageSize),
        state: {
            pagination: {
                pageIndex,
                pageSize
            },
            sorting,
            globalFilter: search
        },
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onPaginationChange: (updater) => {
            // Handle both functional updates and direct values for pagination
            const newState = typeof updater === 'function'
                ? updater({ pageIndex, pageSize })
                : updater
            onPageChange(newState.pageIndex)
        },
        onSortingChange: (updater) => {
            const newState = typeof updater === 'function'
                ? updater(sorting)
                : updater
            onSortingChange(newState)
        },
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full space-y-6">
            {title && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple to-purpleDark rounded-full"></div>
                </div>
            )}

            <div className="flex flex-col justify-between sm:flex-row gap-4 mb-6">
                {/* Search Input */}
                <div className="relative w-full flex-1 md:max-w-sm min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        className="pl-10 bg-blueDark/50 border-purple/30 text-white placeholder:text-gray-400 
                                  focus:border-purple focus:ring-purple/20 transition-all duration-300
                                  hover:border-purple/50"
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search records..."
                    />
                </div>

                {/* Generic Filters Slot */}
                {renderFilters && (
                    <div className="flex flex-wrap gap-4">
                        {renderFilters()}
                    </div>
                )}
            </div>

            {/* Table Container */}
            <div className="scrollbar-hide overflow-x-auto rounded-xl border-2 border-purple/30 shadow-2xl bg-gradient-to-b from-navy/50 to-navyDark/50 backdrop-blur-sm">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                className="border-b border-purple/20 bg-gradient-to-r from-navy via-blueDark to-navy hover:bg-gradient-to-r hover:from-purple/10 hover:via-purpleDark/10 hover:to-purple/10 transition-all duration-300"
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="text-white font-semibold text-sm uppercase tracking-wider py-2 md:py-4 px-4 md:px-6 border-r border-purple/10 last:border-r-0 whitespace-nowrap"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 bg-purple rounded-full animate-pulse"></div>
                                        <div className="w-4 h-4 bg-purple rounded-full animate-pulse delay-75"></div>
                                        <div className="w-4 h-4 bg-purple rounded-full animate-pulse delay-150"></div>
                                        <span className="text-white/70 ml-3">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    className={`
                                        border-b border-navy/30 transition-all duration-300
                                        hover:bg-gradient-to-r hover:from-purple/10 hover:via-purpleDark/10 hover:to-purple/10
                                        hover:shadow-lg hover:border-purple/30
                                        ${index % 2 === 0 ? 'bg-navyDark/20' : 'bg-navy/20'}
                                    `}
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-white/90 py-4 px-6 border-r border-navy/10 last:border-r-0"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple/20 to-purpleDark/20 
                                                      rounded-full flex items-center justify-center">
                                            <Search className="w-8 h-8 text-purple/60" />
                                        </div>
                                        <div className="text-white/70 text-lg font-medium">No results found</div>
                                        <div className="text-white/50 text-sm">Try adjusting your search or filters</div>
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
                        className="bg-navy/50 border-purple/30 text-white hover:bg-purple/20 
                                  hover:border-purple disabled:opacity-50 disabled:cursor-not-allowed
                                  transition-all duration-300"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                        <span className="px-3 py-1 bg-gradient-to-r from-purple to-purpleDark 
                                      text-white text-sm font-medium rounded-md">
                            {pageIndex + 1}
                        </span>
                        {table.getPageCount() > 0 && (
                            <span className="text-gray-400 text-sm font-medium">
                                of {table.getPageCount()}
                            </span>
                        )}
                    </div>
                    <Button
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="bg-navy/50 border-purple/30 text-white hover:bg-purple/20 
                                  hover:border-purple disabled:opacity-50 disabled:cursor-not-allowed
                                  transition-all duration-300"
                    >
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
