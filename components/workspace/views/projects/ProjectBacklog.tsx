"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Bug,
  BookOpen,
  Layers,
  X,
  GripVertical,
  ChevronDown,
  MoreHorizontal,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceProject, initials, grad } from "./shared";
import { Task, demoTasks } from "@/data/demoData";
import { Button } from "@/components/ui/button";
import { CreateIssueModal } from "./CreateIssueModal";

interface ProjectBacklogProps {
  project: WorkspaceProject;
}

type FilterStatus = "all" | "todo" | "in-progress" | "in-review" | "done";
type FilterType = "all" | "story" | "bug";

// ─── Config maps ──────────────────────────────────────────────────────────────
const STATUS_CFG: Record<
  string,
  { label: string; dot: string; badge: string; text: string }
> = {
  done: {
    label: "Done",
    dot: "bg-emerald-400",
    badge: "border-emerald-500/30 bg-emerald-500/10",
    text: "text-emerald-400",
  },
  "in-progress": {
    label: "In Progress",
    dot: "bg-blue-400",
    badge: "border-blue-500/30 bg-blue-500/10",
    text: "text-blue-400",
  },
  "in-review": {
    label: "In Review",
    dot: "bg-amber-400",
    badge: "border-amber-500/30 bg-amber-500/10",
    text: "text-amber-400",
  },
  todo: {
    label: "To Do",
    dot: "bg-slate-500",
    badge: "border-[#1e2a4a] bg-[#07112b]",
    text: "text-[#8b9cc8]",
  },
};

const TYPE_CFG: Record<
  string,
  { label: string; icon: React.ElementType; badgeColor: string; iconColor: string }
> = {
  story: {
    label: "Story",
    icon: BookOpen,
    badgeColor: "bg-[#8735C9]/20 text-[#c084fc] border-[#8735C9]/30",
    iconColor: "text-[#c084fc]",
  },
  bug: {
    label: "Bug",
    icon: Bug,
    badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    iconColor: "text-red-400",
  },
};

const POINTS_COLORS = (pts: number) => {
  if (pts >= 8) { return "text-red-400 border-red-500/30 bg-red-500/10"; }
  if (pts >= 5) { return "text-amber-400 border-amber-500/30 bg-amber-500/10"; }
  return "text-[#8b9cc8] border-[#1e2a4a] bg-[#07112b]";
};

export const ProjectBacklog: React.FC<ProjectBacklogProps> = ({
  project,
}) => {
  const [localTasks, setLocalTasks] = useState<Partial<Task>[]>(demoTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateIssue = (newIssue: Partial<Task>) => {
    setLocalTasks((prev) => [newIssue, ...prev]);
  };

  // Augment tasks with issue keys and member assignees for display
  const augmentedTasks = useMemo(() => {
    const assignees = (project as any)?.memberNames || ["John Doe", "Alice Smith", "Bob"];
    const prefix = project?.key || "ELX";
    return localTasks.map((t, i) => ({
      ...t,
      key: `${prefix}-${101 + i}`,
      assignee: t.assigneeId || assignees[i % assignees.length] || null,
      type: (t.type === "bug" ? "bug" : "story") as "story" | "bug",
      priority: (t.points && t.points >= 8 ? "high" : t.points && t.points >= 5 ? "medium" : "low") as "high" | "medium" | "low",
    }));
  }, [localTasks, project]);

  const filteredTasks = useMemo(() => {
    return augmentedTasks.filter((t) => {
      const matchSearch =
        !search ||
        (t.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (t.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
        t.key.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [augmentedTasks, search, statusFilter, typeFilter]);

  const hasFilters = statusFilter !== "all" || typeFilter !== "all" || search !== "";

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setSearch("");
  };

  // Counters
  const counts = useMemo(
    () => ({
      total: augmentedTasks.length,
      stories: augmentedTasks.filter((t) => t.type === "story").length,
      bugs: augmentedTasks.filter((t) => t.type === "bug").length,
      done: augmentedTasks.filter((t) => t.status === "done").length,
      totalPoints: augmentedTasks.reduce((s, t) => s + (t.points ?? 0), 0),
    }),
    [augmentedTasks]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Backlog Header ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#1e2a4a] bg-gradient-to-br from-[#0C1635] via-[#0e1a38] to-[#07112b] p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_4px_16px_rgba(135,53,201,0.35)]">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Backlog</h2>
                <span className="rounded-full bg-[#8735C9]/20 px-2.5 py-0.5 font-mono text-xs font-bold text-[#c084fc]">
                  {counts.total} issues
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#6b7db3]">
                Manage backlog items and prepare tasks for upcoming sprints.
              </p>
            </div>
          </div>

          {/* Action buttons (Add Issue) */}
          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-9 gap-1.5 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-xs font-semibold text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] transition-all hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Issue
            </Button>
          </div>
        </div>

        {/* Quick summary stats bar */}
        <div className="mt-5 grid grid-cols-4 gap-3 border-t border-[#1e2a4a] pt-4">
          <div className="rounded-xl border border-[#1e2a4a] bg-[#07112b]/80 p-3 text-center">
            <p className="text-lg font-black text-white">{counts.total}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#6b7db3]">
              Total Backlog
            </p>
          </div>
          <div className="rounded-xl border border-[#1e2a4a] bg-[#07112b]/80 p-3 text-center">
            <p className="text-lg font-black text-[#c084fc]">{counts.stories}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#6b7db3]">
              User Stories
            </p>
          </div>
          <div className="rounded-xl border border-[#1e2a4a] bg-[#07112b]/80 p-3 text-center">
            <p className="text-lg font-black text-red-400">{counts.bugs}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#6b7db3]">
              Bugs Reported
            </p>
          </div>
          <div className="rounded-xl border border-[#1e2a4a] bg-[#07112b]/80 p-3 text-center">
            <p className="text-lg font-black text-[#60a5fa]">{counts.totalPoints}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#6b7db3]">
              Total Points
            </p>
          </div>
        </div>
      </div>

      {/* ── Filter Toolbar ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by key, title, or description…"
              className="w-full rounded-xl border border-[#1e2a4a] bg-[#0C1635] py-2 pl-9 pr-8 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5578] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
            {(["all", "todo", "in-progress", "in-review", "done"] as FilterStatus[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-all",
                    statusFilter === f
                      ? "bg-[#8735C9] text-white shadow-sm"
                      : "text-[#6b7db3] hover:text-white"
                  )}
                >
                  {f === "all" ? "All Status" : f.replace("-", " ")}
                </button>
              )
            )}
          </div>

          {/* Type filter pills (Story and Bug ONLY) */}
          <div className="flex items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
            {(["all", "story", "bug"] as FilterType[]).map((t) => {
              const cfg = t !== "all" ? TYPE_CFG[t] : null;
              const Icon = cfg?.icon;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition-all",
                    typeFilter === t
                      ? "bg-[#8735C9] text-white shadow-sm"
                      : "text-[#6b7db3] hover:text-white"
                  )}
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  {t === "all" ? "All Types" : cfg?.label}
                </button>
              );
            })}
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[11px] font-medium text-[#6b7db3] transition-colors hover:text-red-400"
            >
              <X className="h-3 w-3" />
              Reset Filters
            </button>
          )}
        </div>

        <span className="text-[11px] font-medium text-[#6b7db3]">
          Showing <strong className="text-white">{filteredTasks.length}</strong> of {counts.total}
        </span>
      </div>

      {/* ── Backlog List Container ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#1e2a4a] bg-[#0C1635] overflow-hidden shadow-lg">
        {/* Section header bar */}
        <div className="flex items-center justify-between border-b border-[#1e2a4a] bg-[#07112b] px-5 py-3.5">
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="flex items-center gap-2.5 text-left group"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 text-[#6b7db3] transition-transform duration-200 group-hover:text-white",
                isCollapsed && "-rotate-90"
              )}
            />
            <span className="text-sm font-bold text-white group-hover:text-[#c084fc] transition-colors">
              Backlog Work Items
            </span>
            <span className="rounded-full bg-[#1e2a4a] px-2 py-0.5 font-mono text-[11px] font-bold text-[#8b9cc8]">
              {filteredTasks.length}
            </span>
          </button>

          <div className="flex items-center gap-3 text-[11px] text-[#6b7db3]">
            <span>
              Total: <strong className="text-white">{counts.totalPoints} pts</strong>
            </span>
          </div>
        </div>

        {/* Backlog Item Rows */}
        {!isCollapsed && (
          <div className="divide-y divide-[#1e2a4a]">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="mb-2.5 h-8 w-8 text-[#293d6b]" />
                <p className="text-xs font-semibold text-white">No items found</p>
                <p className="mt-0.5 text-[11px] text-[#4B5578]">
                  Try clearing your search or status filter.
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-2.5 text-xs text-[#8735C9] underline underline-offset-2 hover:text-[#c084fc]"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => {
                const st = STATUS_CFG[task.status ?? "todo"] ?? STATUS_CFG["todo"];
                const ty = TYPE_CFG[task.type ?? "story"] ?? TYPE_CFG["story"];
                const TypeIcon = ty.icon;

                return (
                  <div
                    key={task.id}
                    className="group relative flex flex-wrap items-center gap-3 px-5 py-3.5 transition-all duration-150 hover:bg-[#0f1d3d]"
                  >
                    {/* Left Accent indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#8735C9] opacity-0 transition-opacity group-hover:opacity-100" />

                    {/* Grip handle */}
                    <GripVertical className="h-3.5 w-3.5 flex-shrink-0 text-[#293d6b] transition-colors group-hover:text-[#6b7db3]" />

                    {/* Type badge */}
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase",
                        ty.badgeColor
                      )}
                    >
                      <TypeIcon className="h-3 w-3" />
                      <span>{ty.label}</span>
                    </div>

                    {/* Key */}
                    <span className="font-mono text-xs font-bold text-[#8735C9]">
                      {task.key}
                    </span>

                    {/* Title & Description */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white transition-colors group-hover:text-[#c084fc]">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-0.5 truncate text-[11px] text-[#6b7db3]">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Assignee Avatar */}
                    {task.assignee ? (
                      <div
                        title={`Assigned to ${task.assignee}`}
                        className={cn(
                          "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[8px] font-bold text-white shadow-sm",
                          grad(task.assignee)
                        )}
                      >
                        {initials(task.assignee)}
                      </div>
                    ) : (
                      <div
                        title="Unassigned"
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-[#1e2a4a] text-[8px] font-medium text-[#4B5578]"
                      >
                        ?
                      </div>
                    )}

                    {/* Story Points */}
                    <span
                      className={cn(
                        "flex-shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tabular-nums",
                        POINTS_COLORS(task.points ?? 0)
                      )}
                    >
                      {task.points ?? 1}pt
                    </span>

                    {/* Priority badge */}
                    {task.priority === "high" && (
                      <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                        <ArrowUp className="h-2.5 w-2.5" /> High
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                        st.badge,
                        st.text
                      )}
                    >
                      {st.label}
                    </span>

                    {/* Quick Menu */}
                    <button className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[#4B5578] opacity-0 transition-opacity hover:bg-[#1e2a4a] hover:text-white group-hover:opacity-100">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {isCreateOpen && (
        <CreateIssueModal
          project={project}
          onClose={() => setIsCreateOpen(false)}
          onCreateIssue={handleCreateIssue}
        />
      )}
    </div>
  );
};
