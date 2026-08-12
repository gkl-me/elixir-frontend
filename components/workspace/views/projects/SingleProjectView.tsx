"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FolderKanban, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  tagColor,
  daysLeft,
  initials,
  grad,
  WorkspaceProject,
} from "./shared";
import { demoTasks, demoSprints, demoActivities, demoMembers } from "@/data/demoData";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectBacklog } from "./ProjectBacklog";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { useParams } from "next/navigation";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

interface SingleProjectViewProps {
  activeView?: string;
}

export const SingleProjectView: React.FC<SingleProjectViewProps> = ({
  activeView = "overview",
}) => {

  const [project, setProject] = useState<WorkspaceProject>();

  const workspaceId = useWorkspaceStore((s) => s?.context?.workspaceId);

  const params = useParams();
  const projectId = params?.projectId as string;

  const { execute, isLoading } = useApi({
    url: NEXT_API_ROUTES.GET_PROJECT_DETAILS(workspaceId || "", projectId || ""),
    method: "GET",
  });

  const fetchProjectDetails = useCallback(async () => {
    if (!workspaceId || !projectId) return;
    try {
      const res = await execute({
        params: {
          workspaceId,
          projectId,
        },
      });
      if (res?.success && res?.data) {
        setProject(res?.data);
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    }
  }, [workspaceId, projectId, execute]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const status = project?.status ? STATUS_CONFIG[project.status] : null;
  const priority = project?.priority ? PRIORITY_CONFIG[project.priority] : null;
  const progress =
    project && project.totalTasks > 0
      ? Math.round((project.doneTasks / project.totalTasks) * 100)
      : 0;

  if (isLoading || !project) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#8735C9]" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {activeView === "overview" && (
        <div className="relative overflow-hidden rounded-2xl border border-[#1e2a4a] bg-gradient-to-br from-[#0C1635] via-[#0e1a38] to-[#0a1020] shadow-2xl">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#8735C9]/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#60a5fa]/8 blur-2xl" />

          <div className="relative z-10 p-6">
            {/* Top row */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Project icon */}
                <div className="relative flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_6px_24px_rgba(135,53,201,0.45)]">
                    <FolderKanban className="h-7 w-7 text-white" />
                  </div>
                  {/* Active pulse */}
                  {project?.status === "active" && (
                    <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#040A1D] shadow">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded border border-[#1e2a4a] bg-[#07112b] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6b7db3]">
                      {project?.key}
                    </span>
                    {status && (
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                          status.bg
                        )}
                        style={{ color: status.color }}
                      >
                        {status.label}
                      </span>
                    )}
                    {priority && (
                      <span className="flex items-center gap-1 rounded-full border border-[#1e2a4a] bg-[#07112b] px-2.5 py-0.5 text-[11px] font-medium text-[#8b9cc8]">
                        <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
                        {priority.label}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-1.5 text-2xl font-black tracking-tight text-white">
                    {project?.name}
                  </h1>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#6b7db3]">
                    {project?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom meta bar */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#1e2a4a] pt-4">
              {/* Tags & teams */}
              <div className="flex flex-wrap items-center gap-2">
                {(project?.tags || []).map((tag) => {
                  const swatch = tagColor(tag);
                  return (
                    <span
                      key={tag}
                      className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        color: swatch.color,
                        borderColor: swatch.border,
                        backgroundColor: swatch.bg,
                      }}
                    >
                      {tag}
                    </span>
                  );
                })}
                {project?.dueDate && (
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full border border-[#1e2a4a] bg-[#07112b] px-2.5 py-0.5 text-[11px] font-medium",
                      new Date(project.dueDate) < new Date()
                        ? "text-red-400"
                        : "text-[#8b9cc8]"
                    )}
                  >
                    {project.status !== 'completed' && daysLeft(project.dueDate)}
                  </span>
                )}
              </div>

              {/* Members + progress */}
              <div className="flex items-center gap-5">
                {/* Progress pill */}
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#07112b]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa] transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View Content ───────────────────────────────────────────────── */}
      {activeView === "overview" && project && (
        <ProjectOverview project={project} />
      )}

      {
        activeView === "backlogs" && project && (
          <ProjectBacklog project={project} />
        )
      }
    </div>
  );
};
