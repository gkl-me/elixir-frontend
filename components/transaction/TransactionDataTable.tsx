"use client";

import { DataTable } from "@/components/table/DataTable";
import { getTransactionColumns } from "./TransactionColumns";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { toastHandler } from "@/lib/toastHandler";
import { AdminTransaction } from "@/data/demoData";


import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

export default function TransactionDataTable({
  intialData,
  intialTotalCount = 0,
}: {
  intialData: AdminTransaction[];
  intialTotalCount: number;
}) {
  const [data, setData] = useState<AdminTransaction[]>(intialData);
  const [totalCount, setTotalCount] = useState(intialTotalCount);

  // Table State
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<AdminTransaction | null>(null);

  const { execute, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_ALL_TRANSACTION,
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

      setData(res.data.subscriptions);
      setTotalCount(res.data.totalCount);

      toastHandler(res);
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
  }, [debouncedSearch, statusFilter]);

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
    const txn = data.find((t) => t.id === id);
    if (!txn) {return;}
    setSelectedTxn(txn);
    setIsModalOpen(true);
  };

  const renderFilters = () => (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status Filter */}
      <div className="relative min-w-[140px]">
        <Select
          value={statusFilter || "_clear_"}
          onValueChange={(val) => {
            setStatusFilter(val === "_clear_" ? "" : val);
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="border-purple/30 bg-navy/50 pl-3 text-white transition-all duration-300 hover:border-purple/50 focus:border-purple focus:ring-purple/20">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="border-navy/50 bg-navy text-white">
            <SelectItem
              value="_clear_"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              All Status
            </SelectItem>
            <SelectItem
              value="success"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Success
            </SelectItem>
            <SelectItem
              value="pending"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Pending
            </SelectItem>
            <SelectItem
              value="failed"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Failed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* ── KPI Overview Cards ───────────────────────────── */}

      {/* ── Table Section ─────────────────────────────────── */}
      <DataTable
        title="Transactions"
        columns={getTransactionColumns(openDetailsModal)}
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

      <TransactionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTxn}
      />
    </div>
  );
}
