"use client"

import { DataTable } from "@/components/table/DataTable"
import { getUserColumns, User } from "./UserColumns"
import { useCallback, useEffect, useRef, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SortingState } from "@tanstack/react-table"
import { toggleUserStatusAction } from "@/app/actions/user.action"
import { toastHandler } from "@/lib/toastHandler"
import { useApi } from "@/hooks/useApi"
import { NEXT_API_ROUTES } from "@/constants/routeHandler"

<<<<<<< Updated upstream
=======
import { DataTable } from "@/components/table/DataTable";
import { getUserColumns, User } from "./UserColumns";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortingState } from "@tanstack/react-table";
import { toggleUserStatusAction } from "@/app/actions/user.action";
import { toastHandler } from "@/lib/toastHandler";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useDebounce } from "@/hooks/useDebounce";
import { ToggleUserBlockModal } from "./ToggleUserBlockModal";
>>>>>>> Stashed changes

export default function UserDataTable({
    initialData,
    initialTotalCount
}:{
    initialData:User[],
    initialTotalCount:number
}) {
    const [data, setData] = useState<User[]>(initialData)
    const [totalCount, setTotalCount] = useState(initialTotalCount)

    // Table State
    const [search, setSearch] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize] = useState(8)
    const [sorting, setSorting] = useState<SortingState>([])
    const [statusFilter, setStatusFilter] = useState<string>("")

    //api hook called
    const {execute,isLoading} = useApi({
        url:NEXT_API_ROUTES.USERS_LIST_API,
        method:"GET"
    })

    const isFirstRendered = useRef(true)

    // fetch data from client side
    const fetchData = useCallback(async () => {

        const sort = sorting[0]

        const res = await execute({
            params:{
                search,
                status:statusFilter,
                page:pageIndex+1,
                limit:pageSize,
                sortBy:sort?.id,
                sortOrder:sort?.desc ? "desc" : 'asc'
            }
        })

        console.log("fetch is called")

        setData(res.data.users)
        setTotalCount(res.data.totalCount)

    }, [search, pageIndex, pageSize, sorting, statusFilter,execute])

    useEffect(() => {
        if(isFirstRendered.current){
            isFirstRendered.current = false
            return 
        }
        fetchData()
    },[fetchData])

    // Reset page when filters change
    useEffect(() => {
        setPageIndex(0)
    }, [search, statusFilter,])


    const handleToggleBlock = async (id: string) => {
        const res = await toggleUserStatusAction(id)
        fetchData()
        toastHandler(res)
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

<<<<<<< Updated upstream
    return (
        <div className="w-full">
            <DataTable
                title="Users"
                columns={getUserColumns(handleToggleBlock)}
                data={data}
                totalCount={totalCount}
                isLoading={isLoading}
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
=======
  const confirmToggleBlock = () => {
    if (!selectedUser) {
      return;
    }
    handleToggleBlock(selectedUser.id);
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const renderFilters = () => (
    <>
      <div className="relative min-w-[150px]">
        <Select
          value={statusFilter || "_clear_"}
          onValueChange={(value) => {
            setStatusFilter(value === "_clear_" ? "" : value);
          }}
        >
          <SelectTrigger className="border-purple/30 bg-navy/50 pl-3 text-white transition-all duration-300 hover:border-purple/50 focus:border-purple focus:ring-purple/20">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent className="border-navy/50 bg-navy text-white">
            <SelectItem
              value="_clear_"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              All Status
            </SelectItem>
            <SelectItem
              value="active"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Active
            </SelectItem>
            <SelectItem
              value="blocked"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Blocked
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="w-full">
      <DataTable
        title="Users"
        columns={getUserColumns(openModal)}
        data={data}
        totalCount={totalCount}
        isLoading={isLoading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        search={search}
        sorting={sorting}
        onPageChange={setPageIndex}
        onSearchChange={setSearch}
        onSortingChange={setSorting}
        renderFilters={renderFilters}
      />
      <ToggleUserBlockModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmToggleBlock}
      />
    </div>
  );
>>>>>>> Stashed changes
}
