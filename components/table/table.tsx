'use client'

import { ColumnDef, flexRender, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { toast } from "sonner"
import { AxiosErrorHandler } from "@/lib/errorHandler"

export interface TableFetchParams {
    search:string,
    limit:number,
    page:number,
    status:string,
    sortBy:string,
    sortOrder:string
}


interface DataTableProps<TData,TValue>{
    columns:ColumnDef<TData,TValue>[],
    pageSize:number,
    fetchData:(params:TableFetchParams) => Promise<{data:TData[],totalCount:number}>
    statusOptions?:{label:string,value:string}[]
    title:string,
    isLoading:boolean,
    isFetching:boolean
}

export function DataTable<TData,TValue>({
    columns,
    pageSize,
    statusOptions,
    title,
    fetchData,
    isLoading,
    isFetching
}:DataTableProps<TData,TValue>){
    const [data,setData] = useState<TData[]>([])
    const [totalCount,setTotalCount] = useState(0)
    
    const [pageIndex,setPageIndex] = useState(0)
    const [sorting,setSorting] = useState<SortingState>([])
    const [globalFilter,setGlobalFilter] = useState("")
    const [statusFilter,setStatusFilter] = useState("")

    useEffect(() => {

      (async () => {
        try {

          const sort = sorting[0]||{}
          const sortBy = sort.id || ""
          const sortOrder:'asc'|'desc' = sort.desc ? "desc":'asc'

          if(!isLoading && !isFetching){
            const res = await fetchData({
              page:pageIndex,
              limit:pageSize,
              search:globalFilter,
              status:statusFilter,
              sortBy,
              sortOrder
            })
            //state update
            setData(res.data)
            setTotalCount(res.totalCount)
          }
          

        } catch (error) {
          toast.error(AxiosErrorHandler(error))
        }
      })()

      //need to do rtk call and unwrap to check the data
    },[pageIndex,pageSize,globalFilter,statusFilter,sorting,isLoading,isFetching,fetchData])

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.floor(totalCount/pageSize),
        state:{
            pagination:{
                pageIndex,
                pageSize
            },
            sorting,
            globalFilter
        },
        onPaginationChange:(updater) => {
            const newState = typeof updater === 'function' ? updater({pageIndex,pageSize}): updater
            setPageIndex(newState.pageIndex)
        },
        onSortingChange:setSorting,
        onGlobalFilterChange:setGlobalFilter,
        manualSorting:true,
        manualPagination:true,
        manualFiltering:true,
        getCoreRowModel:getCoreRowModel(),
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
                <div className="relative flex-1 md:max-w-sm min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                      className="pl-10 bg-blueDark/50 border-purple/30 text-white placeholder:text-gray-400 
                              focus:border-purple focus:ring-purple/20 transition-all duration-300
                              hover:border-purple/50 "
                      type="text"
                      value={globalFilter}
                      onChange={(e) => setGlobalFilter(e.target.value)}
                      placeholder="Search records..."
                  />
                </div>
                {/* Status Filter */}
                {statusOptions && statusOptions?.length > 0 && (
                    <div className="relative min-w-[180px]">
                        <Select value={statusFilter||"_clear_"} onValueChange={(value) => {
                            if(value==='_clear_') setStatusFilter("")
                            else setStatusFilter(value)
                        }}>
                            <SelectTrigger className="border-purple/30 pl-10 bg-navy/50  !text-white focus:!border-purple focus:!ring-purple/20 transition-all duration-300 hover:!border-purple/50">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="!bg-navy !border-navy/50">
                                <SelectItem value="_clear_" className="cursor-pointer aria-selected:!bg-purple/30 !text-white hover:!bg-purple/20">
                                    All Status
                                </SelectItem>
                                {statusOptions.map((option) => (
                                    <SelectItem 
                                        key={option.label} 
                                        value={option.value}
                                        className="!text-white aria-selected:!bg-purple/30 hover:!bg-purple/20 cursor-pointer"
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
          </div>
    {/* Table Container */}
    <div className="scrollbar-hide overflow-hidden rounded-xl border-2 border-purple/30 shadow-2xl bg-gradient-to-b from-navy/50 to-navyDark/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow 
            className="border-b border-purple/20 bg-gradient-to-r from-navy via-blueDark to-navy hover:bg-gradient-to-r hover:from-purple/10 hover:via-purpleDark/10 hover:to-purple/10 transition-all duration-300"
            key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}
                  className="text-white font-semibold text-sm uppercase tracking-wider py-2 md:py-4  px-4 md:px-6 border-r border-purple/10 last:border-r-0">  
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
            table.getRowModel().rows.map((row,index) => (
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
                  <TableCell key={cell.id}
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