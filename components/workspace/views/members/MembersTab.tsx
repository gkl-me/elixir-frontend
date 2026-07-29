"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Edit3, Trash2, Plus, Loader2 } from "lucide-react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { cn } from "@/lib/utils";
import { Member, getRoleBadge, grad, initials } from "./shared";
import { EditMemberRoleModal } from "./modals/EditMemberRoleModal";
import { RemoveMemberModal } from "./modals/RemoveMemberModal";
import { useApi } from "@/hooks/useApi";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { PermissionGate } from "@/components/workspace/PermissionGate";
import { NoPermissionInline } from "@/components/workspace/fallback/NoPermissionInline";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { toastHandler } from "@/lib/toastHandler";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

const PAGE = 10;

interface MembersTabProps {
  onInviteOpen: () => void;
  refreshTrigger?: number;
}

export const MembersTab = ({
  onInviteOpen,
  refreshTrigger,
}: MembersTabProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  const { execute, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_MEMBERS,
    method: "GET",
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [removeMember, setRemoveMember] = useState<Member | null>(null);
  const debouncedSearch = useDebounce(search, 500);

  const fetchMembers = useCallback(async () => {
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
        setMembers(res.data.members);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
  }, [debouncedSearch, pageSize, page, workspaceId]);

  // Load members on mount and refresh trigger
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, refreshTrigger]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-3">
            {m.avatarUrl ? (
              <Image
                width={32}
                height={32}
                src={m.avatarUrl}
                alt={m.name}
                className="h-8 w-8 flex-shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
                  grad(m.name)
                )}
              >
                {initials(m.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {m.name}
              </p>
              <p className="truncate text-[11px] text-[#6b7db3]">{m.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "roleKey",
      header: "Role",
      cell: ({ row }) => {
        const m = row.original;
        const badge = getRoleBadge(m.roleKey);
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
            {m.roleKey}
          </span>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-xs text-[#6b7db3]">
          {new Date(row.original.joinedAt).toLocaleDateString("en-US", {
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
        const m = row.original;
        if (m.roleKey === "owner") {
          return <span className="text-[10px] text-[#4B5578]">–</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <PermissionGate
              require="members.role.update"
              mode="fallback"
              fallback={<NoPermissionInline label="Edit Role" />}
            >
              <button
                onClick={() => setEditMember(m)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-[#6b7db3] transition-all hover:bg-[#1e2a4a] hover:text-[#c084fc]"
              >
                <Edit3 className="h-3 w-3" />
                Edit Role
              </button>
            </PermissionGate>
            <PermissionGate
              require="members.remove"
              mode="fallback"
              fallback={<NoPermissionInline label="Remove" />}
            >
              <button
                onClick={() => setRemoveMember(m)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-red-400/60 transition-all hover:bg-red-400/10 hover:text-red-400"
              >
                <Trash2 className="h-3 w-3" />
                Remove
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
        data={members}
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
            fallback={<NoPermissionInline label="Invite Member" />}
          >
            <button
              onClick={onInviteOpen}
              className="flex items-center gap-1.5 rounded-xl border border-[#8735C9]/30 px-3 py-2 text-xs font-medium text-[#8735C9] transition-all hover:border-[#8735C9]/60 hover:text-[#c084fc]"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite Member
            </button>
          </PermissionGate>
        )}
      />

      {editMember && (
        <EditMemberRoleModal
          member={editMember}
          onClose={() => setEditMember(null)}
          onSuccess={() => {
            setEditMember(null);
            fetchMembers();
          }}
        />
      )}
      {removeMember && (
        <RemoveMemberModal
          member={removeMember}
          onClose={() => setRemoveMember(null)}
          onSuccess={() => {
            setRemoveMember(null);
            fetchMembers();
          }}
        />
      )}
    </>
  );
};
