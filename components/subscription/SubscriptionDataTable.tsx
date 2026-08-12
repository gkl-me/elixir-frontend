"use client";

import { DataTable } from "@/components/table/DataTable";
import { getSubscriptionColumns } from "./SubscriptionColumns";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortingState } from "@tanstack/react-table";
import { useDebounce } from "@/hooks/useDebounce";
import { SubscriptionDetailsModal } from "./SubscriptionDetailsModal";
import { CancelSubscriptionModal } from "./CancelSubscriptionModal";
import { toastHandler } from "@/lib/toastHandler";
import { AdminSubscription } from "@/data/demoData";

import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import {
  cancelSubscriptionAction,
  reactivateSubscriptionAction,
} from "@/app/actions/subscription.action";

export default function SubscriptionDataTable({
  intialData,
  intialTotalCount = 0,
}: {
  intialData: AdminSubscription[];
  intialTotalCount: number;
}) {
  const [data, setData] = useState<AdminSubscription[]>(intialData);
  const [totalCount, setTotalCount] = useState(intialTotalCount);

  // Table State
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<AdminSubscription | null>(
    null
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [subToCancel, setSubToCancel] = useState<AdminSubscription | null>(
    null
  );

  // KPI Overview Metrics
  // const metrics = useMemo(() => {
  //   const total = data.length;
  //   const activeSubs = data.filter((s) => s.status === "active");
  //   const activeCount = activeSubs.length;

  //   // Calculate MRR (monthly normalized)
  //   const mrrCents = data.reduce((acc, s) => {
  //     if (s.status !== "active") return acc;
  //     if (s.billingCycle === "yearly") {
  //       return acc + Math.round(s.price / 12);
  //     }
  //     return acc + s.price;
  //   }, 0);

  //   const issuesCount = data.filter(
  //     (s) => s.status === "past_due" || s.status === "canceled"
  //   ).length;

  //   return {
  //     total,
  //     activeCount,
  //     mrrFormatted: `$${(mrrCents / 100).toFixed(2)}`,
  //     issuesCount,
  //   };
  // }, [data]);

  const { execute, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_ALL_SUBSCRIPTION,
    method: "GET",
  });

  const isFirstRendered = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await execute({
        params: {
          search: debouncedSearch,
          status: statusFilter,
          plan: planFilter,
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
  }, [debouncedSearch, statusFilter, planFilter]);

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
    const sub = data.find((s) => s.id === id);
    if (!sub) {
      return;
    }
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const openCancelModal = (sub: AdminSubscription) => {
    setSubToCancel(sub);
    setIsCancelModalOpen(true);
  };

  const handleCancelToggle = async (mode: "period_end" | "immediate") => {
    if (!subToCancel) {
      return;
    }

    try {
      const isReactivating =
        subToCancel.status === "canceled" ||
        (subToCancel.status === "active" && subToCancel.cancelAtPeriodEnd);
      let res;
      if (isReactivating) {
        res = await reactivateSubscriptionAction({
          subscriptionId: subToCancel.id,
        });
      } else {
        res = await cancelSubscriptionAction({
          subscriptionId: subToCancel.id,
          cancelMode: mode,
        });
      }

      toastHandler(res);
      fetchData();
      setIsCancelModalOpen(false);
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
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
              value="active"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Active
            </SelectItem>
            <SelectItem
              value="past_due"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Past Due
            </SelectItem>
            <SelectItem
              value="paused"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Paused
            </SelectItem>
            <SelectItem
              value="canceled"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Canceled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Plan Filter */}
      <div className="relative min-w-[140px]">
        <Select
          value={planFilter || "_clear_"}
          onValueChange={(val) => {
            setPlanFilter(val === "_clear_" ? "" : val);
            setPageIndex(0);
          }}
        >
          <SelectTrigger className="border-purple/30 bg-navy/50 pl-3 text-white transition-all duration-300 hover:border-purple/50 focus:border-purple focus:ring-purple/20">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent className="border-navy/50 bg-navy text-white">
            <SelectItem
              value="_clear_"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              All Plans
            </SelectItem>
            <SelectItem
              value="Free"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Free Plan
            </SelectItem>
            <SelectItem
              value="Pro"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Pro Plan
            </SelectItem>
            <SelectItem
              value="Enterprice"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Enterprise
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
        title="Subscriptions"
        columns={getSubscriptionColumns(openDetailsModal, openCancelModal)}
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

      <SubscriptionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subscription={selectedSub}
      />

      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelToggle}
        subscription={subToCancel}
      />
    </div>
  );
}
