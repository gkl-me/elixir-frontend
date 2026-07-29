"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Mail, RefreshCw, X, UserPlus, Loader2 } from "lucide-react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { cn } from "@/lib/utils";
import { WorkspaceInvite, getRoleBadge, STATUS_BADGE } from "./shared";
import { RevokeInviteModal } from "./modals/RevokeInviteModal";
import { useApi } from "@/hooks/useApi";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { PermissionGate } from "@/components/workspace/PermissionGate";
import { NoPermissionInline } from "@/components/workspace/fallback/NoPermissionInline";
import { resendInviteAction } from "@/app/actions/workspace.action";
import { toast } from "sonner";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { toastHandler } from "@/lib/toastHandler";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE = 10;

interface InvitesTabProps {
  onInviteOpen: () => void;
  refreshTrigger?: number;
}

export const InvitesTab = ({
  onInviteOpen,
  refreshTrigger,
}: InvitesTabProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  const { execute, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_INVITES,
    method: "GET",
  });

  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [revokeInvite, setRevokeInvite] = useState<WorkspaceInvite | null>(
    null
  );
  const [resending, setResending] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const fetchInvites = useCallback(async () => {
    if (!workspaceId) {
      return;
    }
    try {
      const res = await execute({
        params: {
          workspaceId,
          page: page + 1,
          limit: pageSize,
          search: debouncedSearch,
        },
      });


      if (res?.success) {
        setInvites(res.data.invites);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
  }, [debouncedSearch, pageSize, page, workspaceId]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites, refreshTrigger]);

  const handleResend = async (inv: WorkspaceInvite) => {
    if (!inv.id) {
      return;
    }
    setResending(inv.id);
    const result = await resendInviteAction(workspaceId, inv.id);
    setResending(null);
    if (result.success) {
      toast.success("Invite resent successfully");
      fetchInvites();
    } else {
      toast.error(result.error ?? "Failed to resend invite");
    }
  };

  const columns: ColumnDef<WorkspaceInvite>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-[#293d6b] bg-[#1e2a4a]">
            <Mail className="h-3.5 w-3.5 text-[#6b7db3]" />
          </div>
          <p className="text-sm font-medium text-white">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "roleId",
      header: "Role",
      cell: () => {
        const badge = getRoleBadge("member");
        const Icon = badge.icon;
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize",
              badge.bg
            )}
            style={{ color: badge.color }}
          >
            <Icon className="h-2.5 w-2.5" />
            Invited
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = STATUS_BADGE[row.original.status] ?? STATUS_BADGE.pending;
        const Icon = s.icon;
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
              s.bg
            )}
            style={{ color: s.color }}
          >
            <Icon className="h-2.5 w-2.5" />
            {s.label}
          </span>
        );
      },
    },
    {
      accessorKey: "sentAt",
      header: "Sent",
      cell: ({ row }) => (
        <span className="text-xs text-[#6b7db3]">
          {new Date(row.original.sentAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) => (
        <span className="text-xs text-[#6b7db3]">
          {new Date(row.original.expiresAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const inv = row.original;
        if (inv.status !== "pending") {
          return <span className="text-[10px] text-[#4B5578]">–</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <PermissionGate
              require="members.invite"
              mode="fallback"
              fallback={<NoPermissionInline label="Resend" />}
            >
              <button
                onClick={() => handleResend(inv)}
                disabled={resending === inv.id}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-[#6b7db3] transition-all hover:bg-[#1e2a4a] hover:text-[#c084fc] disabled:opacity-50"
              >
                {resending === inv.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Resend
              </button>
            </PermissionGate>
            <PermissionGate
              require="members.invite"
              mode="fallback"
              fallback={<NoPermissionInline label="Revoke" />}
            >
              <button
                onClick={() => setRevokeInvite(inv)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-red-400/60 transition-all hover:bg-red-400/10 hover:text-red-400"
              >
                <X className="h-3 w-3" />
                Revoke
              </button>
            </PermissionGate>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[#8735C9]" />
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={invites}
        totalCount={totalCount}
        pageIndex={page}
        pageSize={PAGE}
        search={search}
        sorting={sorting}
        onPageChange={setPage}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(0);
        }}
        onSortingChange={setSorting}
        renderFilters={() => (
          <PermissionGate
            require="members.invite"
            mode="fallback"
            fallback={<NoPermissionInline label="New Invite" />}
          >
            <button
              onClick={onInviteOpen}
              className="flex items-center gap-1.5 rounded-xl border border-[#8735C9]/30 px-3 py-2 text-xs font-medium text-[#8735C9] transition-all hover:border-[#8735C9]/60 hover:text-[#c084fc]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              New Invite
            </button>
          </PermissionGate>
        )}
      />

      {revokeInvite && (
        <RevokeInviteModal
          invite={revokeInvite}
          onClose={() => setRevokeInvite(null)}
          onSuccess={() => {
            setRevokeInvite(null);
            fetchInvites();
          }}
        />
      )}
    </>
  );
};
