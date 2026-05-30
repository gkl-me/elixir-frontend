"use client";

import { DataTable } from "@/components/table/DataTable";
import { getCompanyColumns, Company } from "./CompanyColumns";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortingState } from "@tanstack/react-table";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomModal } from "@/components/modal/CustomModal";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

export default function CompanyDataTable({
  initialData = [],
  initialTotalCount = 0,
}: {
  initialData?: Company[];
  initialTotalCount?: number;
}) {
  const [data, setData] = useState<Company[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  // Table State
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(8);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [companyToSuspend, setCompanyToSuspend] = useState<Company | null>(
    null
  );

  // API Hook Setup (Space left here to call the API later)

  const { execute, isLoading } = useApi({
    url: "/api/companies", // Replace with your actual API route constants if available
    method: "GET",
  });

  const isFirstRendered = useRef(true);

  // Fetch data from client side
  const fetchData = useCallback(async () => {
    const sort = sorting[0];

    try {
      //call api
      const res = await execute({
        params: {
          search: debouncedSearch,
          status: statusFilter,
          page: pageIndex + 1,
          limit: pageSize,
          sortBy: sort?.id,
          sortOrder: sort?.desc ? "desc" : "asc",
        },
      });

      setData(res.data.companies);
      setTotalCount(res.data.totalCount);

      // console.log("data",res.data)

      // console.log("Fetching companies with:", {
      //     debouncedSearch, statusFilter, pageIndex, pageSize, sort
      // })

      // // Temporary mock logic until backend exists
      // if (isFirstRendered.current) return;
      // // setData([...])
      // // setTotalCount(0)
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
      // console.error(error)
    }
  }, [
    debouncedSearch,
    pageIndex,
    pageSize,
    sorting,
    statusFilter /*, execute */,
  ]);

  useEffect(() => {
    if (isFirstRendered.current) {
      isFirstRendered.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPageIndex(0);
  }, [debouncedSearch, statusFilter]);

  const openDetailsModal = (id: string) => {
    const company = data.find((c) => c.id === id);
    if (!company) {
      return;
    }

    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const openSuspendModal = (company: Company) => {
    setCompanyToSuspend(company);
    setIsSuspendModalOpen(true);
  };

  const handleSuspend = async () => {
    if (!companyToSuspend) {
      return;
    }

    try {
      // CALL API: await execute({ method: 'PATCH', url: `/api/companies/${companyToSuspend.id}/suspend` ... })
      // Mocking for now:
      toastHandler({
        success: true,
        message: `Company successfully ${companyToSuspend.status === "blocked" || companyToSuspend.status === "suspended" ? "activated" : "suspended"}.`,
      });
      setIsSuspendModalOpen(false);
      fetchData();
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
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
              value="pending"
              className="cursor-pointer focus:bg-purple/20 focus:text-white"
            >
              Pending
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
        title="Companies"
        columns={getCompanyColumns(openDetailsModal, openSuspendModal)}
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
        title="Company Details"
        description={`Viewing details for ${selectedCompany?.name}`}
      >
        {selectedCompany && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border border-purple/20 bg-navy/50 p-3">
                <span className="mb-1 block text-gray-400">Company Name</span>
                <span className="font-medium text-white">
                  {selectedCompany.name}
                </span>
              </div>
              <div className="rounded-lg border border-purple/20 bg-navy/50 p-3">
                <span className="mb-1 block text-gray-400">Status</span>
                <span className="font-medium capitalize text-white">
                  {selectedCompany.status}
                </span>
              </div>
              <div className="rounded-lg border border-purple/20 bg-navy/50 p-3">
                <span className="mb-1 block text-gray-400">Contact Email</span>
                <span className="font-medium text-white">
                  {selectedCompany.email}
                </span>
              </div>
              {selectedCompany.phone && (
                <div className="rounded-lg border border-purple/20 bg-navy/50 p-3">
                  <span className="mb-1 block text-gray-400">Phone Number</span>
                  <span className="font-medium text-white">
                    {selectedCompany.phone}
                  </span>
                </div>
              )}
              {selectedCompany.website && (
                <div className="col-span-2 rounded-lg border border-purple/20 bg-navy/50 p-3">
                  <span className="mb-1 block text-gray-400">Website URL</span>
                  <span className="break-all font-medium text-blue-400">
                    {selectedCompany.website}
                  </span>
                </div>
              )}
              {selectedCompany.description && (
                <div className="col-span-2 rounded-lg border border-purple/20 bg-navy/50 p-3">
                  <span className="mb-1 block text-gray-400">Description</span>
                  <span className="text-gray-300">
                    {selectedCompany.description}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CustomModal>

      <ConfirmationModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleSuspend}
        title={
          companyToSuspend?.status === "blocked" ||
          companyToSuspend?.status === "suspended"
            ? "Activate Company"
            : "Suspend Company"
        }
        description={`Are you sure you want to ${companyToSuspend?.status === "blocked" || companyToSuspend?.status === "suspended" ? "activate" : "suspend"} the company "${companyToSuspend?.name}"? ${companyToSuspend?.status !== "blocked" && companyToSuspend?.status !== "suspended" ? "All associated workspaces will lose access immediately." : ""}`}
        confirmText={
          companyToSuspend?.status === "blocked" ||
          companyToSuspend?.status === "suspended"
            ? "Yes, Activate"
            : "Yes, Suspend"
        }
        cancelText="Cancel"
      />
    </div>
  );
}
