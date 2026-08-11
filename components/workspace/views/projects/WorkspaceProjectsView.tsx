"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  WorkspaceProject,
  ProjectStatus,
  ProjectPriority,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
} from "./shared";
import { ProjectCard, ProjectRow } from "./ProjectCard";
import { CreateProjectModal } from "./CreateProjectModal";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

type ViewMode = "grid" | "list";
type FilterStatus = "" | ProjectStatus;
type FilterPriority = "" | ProjectPriority;

const PROJECTS_PER_PAGE = 9;


const STAT_CARDS = (projects: WorkspaceProject[], activeProjects: number, totalTasks: number, doneTasks: number) => [
  {
    label: "Total Projects",
    value: projects.length,
    icon: FolderKanban,
    color: "#8735C9",
  },
  {
    label: "Tasks Done",
    value: `${doneTasks}/${totalTasks}`,
    icon: CheckCircle2,
    color: "#34d399",
  },
  {
    label: "Active Projects",
    value: activeProjects,
    icon: Zap,
    color: "#f59e0b",
  },
];

// ─── Main View ─────────────────────────────────────────────────────────────────
export const WorkspaceProjectsView = () => {

  const workspaceId = useWorkspaceStore((s) => s?.context?.workspaceId);

  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || "demo";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("");
  const [view, setView] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [projects, setProjects] = useState([])
  const [activeProjects, setActiveProjects] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const debouncedSearch = useDebounce(search, 500)

  const handleViewProject = (projectId: string) => {
    router.push(`/workspace/${slug}/projects/${projectId}`);
  };

  const { execute } = useApi({
    url: NEXT_API_ROUTES.LIST_PROJECTS,
    method: "GET",
  });

  const fetchProjects = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    try {
      const res = await execute({
        params: {
          workspaceId,
          page: currentPage,
          limit: PROJECTS_PER_PAGE,
          search: debouncedSearch,
          status: statusFilter,
          filter: priorityFilter
        },
      });

      console.log("res", res);

      if (res?.success) {
        setProjects(res.data.projects || []);
        setActiveProjects(res.data.activeProjects)
        setTotalCount(res.data.totalCount || 0);
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    }
  }, [workspaceId, execute, debouncedSearch, currentPage, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const clearFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter || priorityFilter;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Projects
          </h1>
          <p className="mt-0.5 text-sm text-[#6b7db3]">
            {projects.length} project{projects.length !== 1 ? "s" : ""}{" "}
            {hasActiveFilters && (
              <span className="text-[#8735C9]">· filtered</span>
            )}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {STAT_CARDS(
          projects,
          activeProjects,
          0,
          0
        ).map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#0C1635] px-4 py-3"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${s.color}15` }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-base font-black text-white">{s.value}</p>
              <p className="text-[10px] text-[#6b7db3]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[180px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search projects…"
            className="w-full rounded-xl border border-[#1e2a4a] bg-[#0C1635] py-2 pl-9 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
          {(["", "active", "on_hold", "completed", "archived"] as FilterStatus[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => {
                  setStatusFilter(f);
                  setCurrentPage(1);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                  statusFilter === f
                    ? "bg-[#8735C9] text-white"
                    : "text-[#6b7db3] hover:text-white"
                )}
              >
                {f === ""
                  ? "All"
                  : f === "on_hold"
                    ? "On Hold"
                    : STATUS_CONFIG[f as ProjectStatus]?.label ?? f}
              </button>
            )
          )}
        </div>

        {/* Advanced filter toggle */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
            showFilters || hasActiveFilters
              ? "border-[#8735C9]/60 bg-[#8735C9]/10 text-[#c084fc]"
              : "border-[#1e2a4a] text-[#6b7db3] hover:border-[#293d6b] hover:text-white"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8735C9] text-[9px] font-bold text-white">
              !
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
          {(
            [
              ["grid", LayoutGrid],
              ["list", List],
            ] as [ViewMode, React.ElementType][]
          ).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-lg p-1.5 transition-all",
                view === v
                  ? "bg-[#8735C9] text-white"
                  : "text-[#6b7db3] hover:text-white"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Advanced filters panel ───────────────────────────────────────────── */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#1e2a4a] bg-[#0C1635] px-4 py-3">
          {/* Priority */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7db3]">
              Priority
            </span>
            <div className="flex items-center gap-1">
              {(["", "urgent", "high", "medium", "low"] as FilterPriority[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => {
                      setPriorityFilter(f);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium capitalize transition-all",
                      priorityFilter === f
                        ? "bg-[#8735C9] text-white"
                        : "text-[#6b7db3] hover:text-white"
                    )}
                  >
                    {f !== "" && (
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          PRIORITY_CONFIG[f as ProjectPriority]?.dot
                        )}
                      />
                    )}
                    {f}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-[#6b7db3] transition-colors hover:text-red-400"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/* ── Projects ────────────────────────────────────────────────────────── */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1e2a4a] bg-[#0C1635]">
            <FolderKanban className="h-6 w-6 text-[#4B5578]" />
          </div>
          <p className="mb-1 text-sm font-semibold text-white">
            No projects found
          </p>
          <p className="text-xs text-[#4B5578]">
            Try adjusting your search or filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 text-xs text-[#8735C9] underline underline-offset-2 hover:text-[#c084fc]"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onView={() => handleViewProject(p.id)}
            />
          ))}
          {/* New project CTA slot */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#1e2a4a] bg-[#0C1635] p-6 transition-all hover:border-[#8735C9]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-[#1e2a4a] transition-colors group-hover:border-[#8735C9]">
              <Plus className="h-5 w-5 text-[#4B5578] group-hover:text-[#8735C9]" />
            </div>
            <span className="text-xs font-medium text-[#6b7db3] transition-colors group-hover:text-white">
              New project
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* List header */}
          <div className="hidden items-center gap-4 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-[#4B5578] md:flex">
            <div className="w-9 flex-shrink-0" />
            <div className="flex-1 min-w-[180px]">Project</div>
            <div className="hidden w-28 flex-shrink-0 sm:block">Priority</div>
            <div className="hidden w-36 flex-shrink-0 md:block">Progress</div>
            <div className="hidden w-24 flex-shrink-0 sm:block">Due</div>
            <div className="w-24 flex-shrink-0 text-center">Status</div>
            <div className="w-6 flex-shrink-0" />
          </div>
          {projects.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              onView={() => handleViewProject(p.id)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.floor(totalCount / PROJECTS_PER_PAGE)}
        onPageChange={setCurrentPage}
      />

      {/* ── Create modal ─────────────────────────────────────────────────────── */}
      {createOpen && (
        <CreateProjectModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
};
