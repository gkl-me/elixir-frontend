"use client"

import { DataTable } from "@/components/table/DataTable"
import { getUserColumns, User } from "./UserColumns"
import { useCallback, useEffect, useState, useTransition } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SortingState } from "@tanstack/react-table"
import { getAllUserAction, toggleUserStatusAction } from "@/app/actions/user.action"
import { toastHandler } from "@/lib/toastHandler"


export default function UserDataTable() {
    const [data, setData] = useState<User[]>([])
    const [totalCount, setTotalCount] = useState(0)

    // Table State
    const [search, setSearch] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize] = useState(8)
    const [sorting, setSorting] = useState<SortingState>([])
    const [statusFilter, setStatusFilter] = useState<string>("")

    const [isPending,startTransition] = useTransition()

    const fetchData = useCallback(async () => {

        const sort = sorting[0]

        startTransition(async () => {
            const res = await getAllUserAction(
                search,
                statusFilter,
                pageIndex+1,
                pageSize,
                sort?.id,
                sort?.desc ? 'desc' : 'asc'
            )

            //on success
            if(res.success){
                setData(res.data.users)
                setTotalCount(res.data.totalCount)
            }

            if(!res.success){
                toastHandler({
                    success:res.success,
                    error:res.error
                })
            }

        })

    }, [search, pageIndex, pageSize, sorting, statusFilter,])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Reset page when filters change
    useEffect(() => {
        setPageIndex(0)
    }, [search, statusFilter,])


    const handleToggleBlock = async (id: string) => {
        const res = await toggleUserStatusAction(id)
        toastHandler(res)
        fetchData()
    }

    const renderFilters = () => (
        <>
             <div className="relative min-w-[150px]">
                <Select value={statusFilter || "_clear_"} onValueChange={(value) => {
                    setStatusFilter(value === '_clear_' ? "" : value)
                }}>
                    <SelectTrigger className="border-purple/30 pl-3 bg-navy/50 text-white focus:border-purple focus:ring-purple/20 transition-all duration-300 hover:border-purple/50">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-navy/50 text-white">
                        <SelectItem value="_clear_" className="cursor-pointer focus:bg-purple/20 focus:text-white">All Status</SelectItem>
                        <SelectItem value="active" className="cursor-pointer focus:bg-purple/20 focus:text-white">Active</SelectItem>
                        <SelectItem value="blocked" className="cursor-pointer focus:bg-purple/20 focus:text-white">Blocked</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </>
    )

    return (
        <div className="w-full">
            <DataTable
                title="Users"
                columns={getUserColumns(handleToggleBlock)}
                data={data}
                totalCount={totalCount}
                isLoading={isPending}
                pageIndex={pageIndex}
                pageSize={pageSize}
                search={search}
                sorting={sorting}
                onPageChange={setPageIndex}
                onSearchChange={setSearch}
                onSortingChange={setSorting}
                renderFilters={renderFilters}
            />
        </div>
    )
}
