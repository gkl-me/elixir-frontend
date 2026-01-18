"use client"

import { DataTable } from "@/components/table/DataTable"
import { getUserColumns, User } from "./UserColumns"
import { useCallback, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SortingState } from "@tanstack/react-table"

// Mock Data for demonstration
const MOCK_USERS: User[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `user-${i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'company' : 'user',
    isBlocked: i % 5 === 0,
    image: undefined
}))

export default function UsersListForm() {
    const [data, setData] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [totalCount, setTotalCount] = useState(0)

    // Table State
    const [search, setSearch] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize] = useState(8)
    const [sorting, setSorting] = useState<SortingState>([])
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [roleFilter, setRoleFilter] = useState<string>("")

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))

        let filtered = [...MOCK_USERS]

        // 1. Search
        if (search) {
            filtered = filtered.filter(u => 
                u.name.toLowerCase().includes(search.toLowerCase()) || 
                u.email.toLowerCase().includes(search.toLowerCase())
            )
        }

        // 2. Filter
        if (statusFilter) {
            const isBlocked = statusFilter === 'blocked'
            filtered = filtered.filter(u => u.isBlocked === isBlocked)
        }
        if (roleFilter) {
            filtered = filtered.filter(u => u.role === roleFilter)
        }

        // 3. Sort
        if (sorting.length > 0) {
            const { id, desc } = sorting[0]
            filtered.sort((a, b) => {
                const valA = a[id as keyof User]
                const valB = b[id as keyof User]
                if (valA! < valB!) return desc ? 1 : -1
                if (valA! > valB!) return desc ? -1 : 1
                return 0
            })
        }

        setTotalCount(filtered.length)

        // 4. Paginate
        const start = pageIndex * pageSize
        const end = start + pageSize
        setData(filtered.slice(start, end))

        setIsLoading(false)
    }, [search, pageIndex, pageSize, sorting, statusFilter, roleFilter])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Reset page when filters change
    useEffect(() => {
        setPageIndex(0)
    }, [search, statusFilter, roleFilter])


    const handleToggleBlock = async (id: string) => {
        // Optimistic update for demo
        setData(prev => prev.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u))
        // In real app: call API here
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

            <div className="relative min-w-[150px]">
                <Select value={roleFilter || "_clear_"} onValueChange={(value) => {
                    setRoleFilter(value === '_clear_' ? "" : value)
                }}>
                    <SelectTrigger className="border-purple/30 pl-3 bg-navy/50 text-white focus:border-purple focus:ring-purple/20 transition-all duration-300 hover:border-purple/50">
                        <SelectValue placeholder="Filter by Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-navy/50 text-white">
                        <SelectItem value="_clear_" className="cursor-pointer focus:bg-purple/20 focus:text-white">All Roles</SelectItem>
                        <SelectItem value="user" className="cursor-pointer focus:bg-purple/20 focus:text-white">User</SelectItem>
                        <SelectItem value="company" className="cursor-pointer focus:bg-purple/20 focus:text-white">Company</SelectItem>
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
}
