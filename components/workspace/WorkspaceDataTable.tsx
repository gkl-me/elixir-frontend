"use client";

import { DataTable } from "@/components/table/DataTable";
import { getWorkspaceColumns, Workspace } from "./WorkspaceColumns";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import { WorkspaceDetailsModal } from "./modals/WorkspaceDetailsModal";
import { SuspendWorkspaceModal } from "./modals/SuspendWorkspaceModal";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { toggleWorkspaceStatusAction } from "@/app/actions/workspace.action";

export default function WorkspaceDataTable({
  intialData,
  intialTotalCount = 0,
}: {
  intialData: Workspace[];
  intialTotalCount: number;
}) {
  const [data, setData] = useState<Workspace[]>(intialData);
  const [totalCount, setTotalCount] = useState(intialTotalCount);

  // Table State
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [workspaceToSuspend, setWorkspaceToSuspend] =
    useState<Workspace | null>(null);

  const { execute, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_ALL_WORKSPACE,
    method: "GET",
  });

  const isFirstRendered = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await execute({
        params: {
          search: debouncedSearch,
          status: statusFilter,
          page: pageIndex + 1,
          limit: pageSize,
        },
      });


      setData(res.data.workspaces);
      setTotalCount(res.data.totalCount);

      toastHandler({
        success: res.success,
        message: res.message,
      });
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
  }, [debouncedSearch, statusFilter]); // Simplified deps since it's mock data

  useEffect(() => {
    if (isFirstRendered.current) {
      isFirstRendered.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, statusFilter]);

  const openDetailsModal = (id: string) => {
    const workspace = data.find((w) => w.id === id);
    if (!workspace) {
      return;
    }

    setSelectedWorkspace(workspace);
    setIsModalOpen(true);
  };

  const openSuspendModal = (workspace: Workspace) => {
    setWorkspaceToSuspend(workspace);
    setIsSuspendModalOpen(true);
  };

  const handleSuspend = async () => {
    if (!workspaceToSuspend) {
      return;
    }

    try {
      const res = await toggleWorkspaceStatusAction({
        workspaceId: workspaceToSuspend.id,
      });
      toastHandler(res);
      fetchData();
      setIsSuspendModalOpen(false);
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
  };

  const renderFilters = () => (
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
            value="suspended"
            className="cursor-pointer focus:bg-purple/20 focus:text-white"
          >
            Suspended
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

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

      <WorkspaceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workspace={selectedWorkspace}
      />

      <SuspendWorkspaceModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleSuspend}
        workspace={workspaceToSuspend}
      />
    </div>
  );
}
