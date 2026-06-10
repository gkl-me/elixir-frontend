"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Users, ChevronLeft, UserPlus, X, Loader2 } from "lucide-react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/DataTable";
import { cn } from "@/lib/utils";
import { initials, grad, ROLE_BADGE } from "./shared";
import { AddMembersModal } from "./AddMembersModal";
import { RemoveTeamMemberModal } from "./RemoveTeamMemberModal";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { toastHandler } from "@/lib/toastHandler";
import Image from "next/image";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

const MemberCell = ({ m }: { m: TeamMember }) => {
  return (
    <div className="flex items-center gap-3">
      {m.avatarUrl ? (
        <Image
          width={40}
          height={40}
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
        <p className="truncate text-sm font-semibold text-white">{m.name}</p>
        <p className="truncate text-[11px] text-[#6b7db3]">{m.email}</p>
      </div>
    </div>
  );
};

const RoleCell = ({ m }: { m: TeamMember }) => {
  const badge = ROLE_BADGE[m.role.toLowerCase()] ?? ROLE_BADGE.member;
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
};

interface TeamManagePageProps {
  team: {
    id: string;
    name: string;
  };
  onBack: () => void;
}

export const TeamManagePage = ({ team, onBack }: TeamManagePageProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [teamDetail, setTeamDetail] = useState<{
    id: string;
    name: string;
    description?: string;
    members: TeamMember[];
  } | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  const PAGE = 5;

  const { execute: fetchTeamDetail, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_TEAM(team.id),
    method: "GET",
  });

  const loadTeam = useCallback(async () => {
    if (!workspaceId) {
      return;
    }
    try {
      const res = await fetchTeamDetail({
        params: { workspaceId },
      });
      if (res?.success && res.data?.team) {
        setTeamDetail(res.data.team);
      }
    } catch (err) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(err).message,
      });
    }
  }, [workspaceId, team.id, fetchTeamDetail]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  const currentMembers = teamDetail?.members ?? [];

  // Filtered + paginated — current members
  const [memberSearch, setMemberSearch] = useState("");
  const [memberPage, setMemberPage] = useState(0);
  const [memberSort, setMemberSort] = useState<SortingState>([]);

  const filteredCurrent = useMemo(
    () =>
      currentMembers.filter(
        (m) =>
          !memberSearch ||
          m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.email.toLowerCase().includes(memberSearch.toLowerCase())
      ),
    [currentMembers, memberSearch]
  );

  const pagedCurrent = useMemo(
    () => filteredCurrent.slice(memberPage * PAGE, (memberPage + 1) * PAGE),
    [filteredCurrent, memberPage]
  );

  // Columns — current members
  const currentCols: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => <MemberCell m={row.original} />,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleCell m={row.original} />,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const m = row.original;
        return (
          <button
            onClick={() => setRemoveTarget(m)}
            className="hover:bg-red-400/08 flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-red-400/70 transition-all hover:border-red-400/20 hover:text-red-400"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        );
      },
    },
  ];

  const excludeIds = useMemo(
    () => currentMembers.map((m) => m.id),
    [currentMembers]
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {/* Back header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-sm font-medium text-[#6b7db3] transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Teams
        </button>
        <span className="text-[#1e2a4a]">/</span>
        <span className="text-sm font-bold text-white">
          {teamDetail?.name ?? team.name}
        </span>
      </div>

      {isLoading && !teamDetail ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#8735C9]" />
        </div>
      ) : (
        <>
          {/* Team header card */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_4px_16px_rgba(135,53,201,0.35)]">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-white">
                {teamDetail?.name ?? team.name}
              </h1>
              {teamDetail?.description && (
                <p className="mt-1 text-xs text-[#8b9cc8]">
                  {teamDetail.description}
                </p>
              )}
              <p className="mt-2 text-sm text-[#6b7db3]">
                {currentMembers.length} member
                {currentMembers.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex -space-x-2">
              {currentMembers.slice(0, 4).map((m, i) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0C1635] bg-gradient-to-br text-[10px] font-bold text-white",
                    grad(m.name)
                  )}
                  style={{ zIndex: 10 - i }}
                >
                  {initials(m.name)}
                </div>
              ))}
              {currentMembers.length > 4 && (
                <div className="z-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0C1635] bg-[#132353]">
                  <span className="text-[9px] font-bold text-[#8b9cc8]">
                    +{currentMembers.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Members section */}
          <div className="overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635]">
            <div className="flex items-center justify-between border-b border-[#1e2a4a] px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-white">Members</h2>
                <p className="mt-0.5 text-[11px] text-[#6b7db3]">
                  {currentMembers.length} in this team
                </p>
              </div>
              <Button
                onClick={() => setAddModalOpen(true)}
                size="sm"
                className="h-8 gap-1.5 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-xs font-semibold text-white hover:opacity-90"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add Member
              </Button>
            </div>

            {/* Current members DataTable */}
            <div className="px-5 py-4">
              <DataTable
                columns={currentCols}
                data={pagedCurrent}
                totalCount={filteredCurrent.length}
                pageIndex={memberPage}
                pageSize={PAGE}
                search={memberSearch}
                sorting={memberSort}
                onPageChange={setMemberPage}
                onSearchChange={(v) => {
                  setMemberSearch(v);
                  setMemberPage(0);
                }}
                onSortingChange={setMemberSort}
              />
            </div>
          </div>
        </>
      )}

      {/* Add Members modal */}
      {addModalOpen && (
        <AddMembersModal
          teamId={team.id}
          excludeIds={excludeIds}
          onSuccess={loadTeam}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Remove confirm modal */}
      {removeTarget && (
        <RemoveTeamMemberModal
          teamId={team.id}
          teamName={teamDetail?.name ?? team.name}
          member={removeTarget}
          onSuccess={loadTeam}
          onClose={() => setRemoveTarget(null)}
        />
      )}
    </div>
  );
};
