"use client";

import React, { useMemo, useState } from "react";
import { Edit3, Trash2, Plus } from "lucide-react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/table/DataTable";
import { demoMembers } from "../../../../data/demoData";
import { cn } from "@/lib/utils";
import { Member, ROLE_BADGE, grad, initials } from "./shared";
import { EditMemberRoleModal } from "./modals/EditMemberRoleModal";
import { RemoveMemberModal } from "./modals/RemoveMemberModal";

const PAGE = 10;

interface MembersTabProps {
  onInviteOpen: () => void;
}

export const MembersTab = ({ onInviteOpen }: MembersTabProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [removeMember, setRemoveMember] = useState<Member | null>(null);

  const filtered = useMemo(
    () =>
      demoMembers.filter(
        (m) =>
          !search ||
          m.user.name.toLowerCase().includes(search.toLowerCase()) ||
          m.user.email.toLowerCase().includes(search.toLowerCase()) ||
          m.role.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const paged = useMemo(
    () => filtered.slice(page * PAGE, (page + 1) * PAGE),
    [filtered, page]
  );

  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "user.name",
      header: "Member",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
                grad(m.user.name)
              )}
            >
              {initials(m.user.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {m.user.name}
              </p>
              <p className="truncate text-[11px] text-[#6b7db3]">
                {m.user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const m = row.original;
        const badge = ROLE_BADGE[m.role] ?? ROLE_BADGE.member;
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
            {m.role}
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
        if (m.role === "owner") {
          return <span className="text-[10px] text-[#4B5578]">–</span>;
        }
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditMember(m)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-[#6b7db3] transition-all hover:bg-[#1e2a4a] hover:text-[#c084fc]"
            >
              <Edit3 className="h-3 w-3" />
              Edit Role
            </button>
            <button
              onClick={() => setRemoveMember(m)}
              className="hover:bg-red-400/08 flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-red-400/60 transition-all hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={paged}
        totalCount={filtered.length}
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
          <button
            onClick={onInviteOpen}
            className="flex items-center gap-1.5 rounded-xl border border-[#8735C9]/30 px-3 py-2 text-xs font-medium text-[#8735C9] transition-all hover:border-[#8735C9]/60 hover:text-[#c084fc]"
          >
            <Plus className="h-3.5 w-3.5" />
            Invite Member
          </button>
        )}
      />

      {editMember && (
        <EditMemberRoleModal
          member={editMember}
          onClose={() => setEditMember(null)}
        />
      )}
      {removeMember && (
        <RemoveMemberModal
          member={removeMember}
          onClose={() => setRemoveMember(null)}
        />
      )}
    </>
  );
};
