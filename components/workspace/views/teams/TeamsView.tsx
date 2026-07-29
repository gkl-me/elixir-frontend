"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { TeamType } from "./shared";
import { CreateTeamModal } from "./CreateTeamModal";
import { TeamManagePage } from "./TeamManagePage";
import { TeamCard } from "./TeamCard";
import { WorkspaceTeamsList } from "@/types/IWorkspaceType";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { toastHandler } from "@/lib/toastHandler";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { useDebounce } from "@/hooks/useDebounce";

export const TeamsView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [managingTeam, setManagingTeam] = useState<TeamType | null>(null);
  const [search, setSearch] = useState("");
  const [teams, setTeams] = useState<WorkspaceTeamsList[] | []>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const TEAMS_PER_PAGE = 8;

  const workspaceId = useWorkspaceStore((s) => s?.context?.workspaceId);

  const { execute } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_TEAMS,
    method: "GET",
  });

  const fetchTeams = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    try {
      const res = await execute({
        params: {
          workspaceId,
          page: currentPage,
          limit: TEAMS_PER_PAGE,
          search: debouncedSearch,
        },
      });

      console.log("res", res);

      if (res?.success) {
        setTeams(res.data.teams || []);
        setTotalCount(res.data.totalCount || 0);
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    }
  }, [workspaceId, execute, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (managingTeam) {
    return (
      <TeamManagePage
        team={managingTeam}
        onBack={() => setManagingTeam(null)}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Teams
          </h1>
          <p className="mt-0.5 text-sm text-[#6b7db3]">
            {teams.length} team{teams.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search teams…"
          className="w-full rounded-xl border border-[#1e2a4a] bg-[#0C1635] py-2 pl-9 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onManage={() => setManagingTeam(team)}
          />
        ))}
        <button
          onClick={() => setCreateOpen(true)}
          className="group flex min-h-[160px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#1e2a4a] bg-[#0C1635] p-6 transition-all hover:border-[#8735C9]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-[#1e2a4a] transition-colors group-hover:border-[#8735C9]">
            <Plus className="h-5 w-5 text-[#4B5578] group-hover:text-[#8735C9]" />
          </div>
          <span className="text-xs font-medium text-[#6b7db3] transition-colors group-hover:text-white">
            New team
          </span>
        </button>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalCount}
        onPageChange={setCurrentPage}
      />

      {createOpen && (
        <CreateTeamModal
          onClose={() => setCreateOpen(false)}
          onSuccess={fetchTeams}
        />
      )}
    </div>
  );
};
