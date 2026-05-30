"use client"

import { DataTable } from "@/components/table/DataTable"
import { getWorkspaceColumns, Workspace } from "./WorkspaceColumns"
import { useCallback, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SortingState } from "@tanstack/react-table"
import { useDebounce } from "@/hooks/useDebounce"
import { CustomModal } from "@/components/modal/CustomModal"
import { ConfirmationModal } from "@/components/modal/ConfirmationModal"
import { toastHandler } from "@/lib/toastHandler"
import { AxiosErrorHandler } from "@/lib/errorHandler"

// Dummy data for initial dev
const DUMMY_WORKSPACES: Workspace[] = [
    { id: "1", name: "Acme Corp", ownerEmail: "admin@acme.com", plan: "enterprise", status: "active", userCount: 42, createdAt: "2024-01-10" },
    { id: "2", name: "Freelancer Hub", ownerEmail: "john@freelancer.com", plan: "pro", status: "active", userCount: 1, createdAt: "2024-02-15" },
    { id: "3", name: "Startup Inc", ownerEmail: "founder@startup.io", plan: "free", status: "suspended", userCount: 5, createdAt: "2024-03-01" },
    { id: "4", name: "Beta Testers", ownerEmail: "beta@test.com", plan: "free", status: "active", userCount: 10, createdAt: "2024-03-05" },
    { id: "5", name: "Global Reach", ownerEmail: "ceo@globalreach.net", plan: "enterprise", status: "blocked", userCount: 120, createdAt: "2023-11-20" },
]

export default function WorkspaceDataTable() {
    const [data, setData] = useState<Workspace[]>(DUMMY_WORKSPACES)
    const [totalCount, setTotalCount] = useState(DUMMY_WORKSPACES.length)

    // Table State
    const [search, setSearch] = useState("")
    const [pageIndex, setPageIndex] = useState(0)
    const [pageSize] = useState(8)
    const [sorting, setSorting] = useState<SortingState>([])
    const [statusFilter, setStatusFilter] = useState<string>("")
    const debouncedSearch = useDebounce(search, 500)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
    const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false)
    const [workspaceToSuspend, setWorkspaceToSuspend] = useState<Workspace | null>(null)

    const isLoading = false // Mock loading state for now

    const fetchData = useCallback(async () => {
        // Mocking API fetch with dummy data filtering
        let filtered = [...DUMMY_WORKSPACES]

        if (debouncedSearch) {
            filtered = filtered.filter(w => w.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
        }

        if (statusFilter) {
            filtered = filtered.filter(w => w.status === statusFilter)
        }

        setData(filtered)
        setTotalCount(filtered.length)
    }, [debouncedSearch, statusFilter]) // Simplified deps since it's mock data

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        setPageIndex(0)
    }, [debouncedSearch, statusFilter])

    const openDetailsModal = (id: string) => {
        const workspace = data.find(w => w.id === id)
        if (!workspace) { return }

        setSelectedWorkspace(workspace)
        setIsModalOpen(true)
    }

    const openSuspendModal = (workspace: Workspace) => {
        setWorkspaceToSuspend(workspace)
        setIsSuspendModalOpen(true)
    }

    const handleSuspend = async () => {
        if (!workspaceToSuspend) { return };

        try {
            // Mock API call to toggle status
            const newStatus = workspaceToSuspend.status === 'suspended' || workspaceToSuspend.status === 'blocked' ? 'active' : 'suspended'
            const updated = data.map(w => w.id === workspaceToSuspend.id ? { ...w, status: newStatus as 'active' | 'suspended' | 'blocked' } : w)
            setData(updated)

            toastHandler({ success: true, message: `Workspace successfully ${newStatus === 'active' ? 'activated' : 'suspended'}.` })
            setIsSuspendModalOpen(false)
        } catch (error) {
            const err = AxiosErrorHandler(error)
            toastHandler({ success: false, error: err.message })
        }
    }

    const renderFilters = () => (
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
                    <SelectItem value="suspended" className="cursor-pointer focus:bg-purple/20 focus:text-white">Suspended</SelectItem>
                    <SelectItem value="blocked" className="cursor-pointer focus:bg-purple/20 focus:text-white">Blocked</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )

    return (
        <div className="w-full">
            <DataTable
                title="Workspaces"
                columns={getWorkspaceColumns(openDetailsModal, openSuspendModal)}
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

            <CustomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Workspace Details"
                description={`Viewing details for ${selectedWorkspace?.name}`}
            >
                {selectedWorkspace && (
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-navy/50 p-3 rounded-lg border border-purple/20">
                                <span className="text-gray-400 block mb-1">Workspace Name</span>
                                <span className="text-white font-medium">{selectedWorkspace.name}</span>
                            </div>
                            <div className="bg-navy/50 p-3 rounded-lg border border-purple/20">
                                <span className="text-gray-400 block mb-1">Status</span>
                                <span className="text-white font-medium capitalize">{selectedWorkspace.status}</span>
                            </div>
                            <div className="bg-navy/50 p-3 rounded-lg border border-purple/20">
                                <span className="text-gray-400 block mb-1">Owner Email</span>
                                <span className="text-white font-medium">{selectedWorkspace.ownerEmail}</span>
                            </div>
                            <div className="bg-navy/50 p-3 rounded-lg border border-purple/20">
                                <span className="text-gray-400 block mb-1">Current Plan</span>
                                <span className="text-white font-medium capitalize">{selectedWorkspace.plan}</span>
                            </div>
                            <div className="bg-navy/50 p-3 rounded-lg border border-purple/20">
                                <span className="text-gray-400 block mb-1">User Count</span>
                                <span className="text-white font-medium">{selectedWorkspace.userCount}</span>
                            </div>
                            <div className="bg-navy/50 p-3 rounded-lg border border-purple/20">
                                <span className="text-gray-400 block mb-1">Created At</span>
                                <span className="text-white font-medium">{selectedWorkspace.createdAt}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CustomModal>

            <ConfirmationModal
                isOpen={isSuspendModalOpen}
                onClose={() => setIsSuspendModalOpen(false)}
                onConfirm={handleSuspend}
                title={workspaceToSuspend?.status === 'blocked' || workspaceToSuspend?.status === 'suspended' ? "Activate Workspace" : "Suspend Workspace"}
                description={`Are you sure you want to ${workspaceToSuspend?.status === 'blocked' || workspaceToSuspend?.status === 'suspended' ? "activate" : "suspend"} the workspace "${workspaceToSuspend?.name}"? ${workspaceToSuspend?.status !== 'blocked' && workspaceToSuspend?.status !== 'suspended' ? "All users in this workspace will lose access." : ""}`}
                confirmText={workspaceToSuspend?.status === 'blocked' || workspaceToSuspend?.status === 'suspended' ? "Yes, Activate" : "Yes, Suspend"}
                cancelText="Cancel"
            />
        </div>
    )
}
