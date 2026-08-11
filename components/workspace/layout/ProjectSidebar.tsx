"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart2,
  KanbanSquare,
  Timer,
  Activity,
  Users,
  ChevronLeft,
  Zap,
  GitBranch,
  Layers,
  Target,
} from "lucide-react";
import { demoProjects, demoSprints } from "../../../data/demoData";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  activeProjectId?: string | null;
  collapsed?: boolean;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  activeProjectId,
}) => {
  const pathname = usePathname();
  const pathParts = pathname?.split("/").filter(Boolean) || [];

  const projectsIdx = pathParts.indexOf("projects");
  const workspaceSlug =
    pathParts[0] === "workspace" && projectsIdx > 1 ? pathParts[1] : null;
  const currentProjectId =
    activeProjectId || (projectsIdx !== -1 ? pathParts[projectsIdx + 1] : null);
  const activeView =
    projectsIdx !== -1 && pathParts.length > projectsIdx + 2
      ? pathParts[projectsIdx + 2]
      : "overview";

  const project =
    demoProjects.find((p) => p.id === currentProjectId);

  const activeSprint = demoSprints.find(
    (s) => s.projectId === currentProjectId && s.status === "active"
  );

  const allProjectsUrl = workspaceSlug
    ? `/workspace/${workspaceSlug}/projects`
    : "/workspace";

  const sections = [
    {
      label: "Planning",
      links: [
        {
          id: "overview",
          label: "Overview",
          icon: Target,
          description: "Project metrics",
        },
        {
          id: "backlogs",
          label: "Backlog",
          icon: Layers,
          description: "Issue backlog",
        },
      ],
    },
    {
      label: "Active Sprint",
      links: [
        {
          id: "board",
          label: "Board",
          icon: KanbanSquare,
          description: "Kanban view",
        },
        {
          id: "sprint",
          label: "Sprint",
          icon: Timer,
          description: "Sprint goals",
        },
        {
          id: "sprint-performance",
          label: "Performance",
          icon: BarChart2,
          description: "Velocity & history",
        },
      ],
    },
    {
      label: "Collaboration",
      links: [
        {
          id: "project-teams",
          label: "Teams",
          icon: Users,
          description: "Team members",
        },
        {
          id: "project-tasks",
          label: "Activity",
          icon: Activity,
          description: "Recent activity",
        },
      ],
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#07112b]">
      {/* Back button */}
      <div className="px-4 pb-2 pt-4">
        <Link
          href={allProjectsUrl}
          className="group mb-4 flex items-center gap-1.5 text-xs text-[#6b7db3] transition-colors hover:text-white"
        >
          <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          All projects
        </Link>

        {/* Project card */}
        <div className="rounded-xl border border-[#1e2a4a] bg-gradient-to-br from-[#0C1635] to-[#0a1020] p-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#4B2070] text-sm font-bold shadow-[0_0_14px_rgba(135,53,201,0.3)]">
              {project?.name.charAt(0) ?? "P"}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold leading-tight text-white">
                {project?.name ?? "Project"}
              </h2>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sectioned nav */}
      <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto px-3 py-2">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#4B5578]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => {
                const Icon = link.icon;
                const isActive = activeView === link.id;
                const baseUrl = workspaceSlug
                  ? `/workspace/${workspaceSlug}/projects/${currentProjectId}`
                  : `/demo/projects/${currentProjectId}`;
                const targetUrl =
                  link.id === "overview"
                    ? baseUrl
                    : `${baseUrl}/${link.id}`;
                return (
                  <Link
                    key={link.id}
                    href={targetUrl}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_10px_rgba(135,53,201,0.3)]"
                        : "text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-white"
                          : "group-hover:text-purple-300 text-[#6b7db3]"
                      )}
                    />
                    <div className="flex-1 text-left">
                      <span>{link.label}</span>
                    </div>
                    {isActive && <Zap className="h-3 w-3 text-white/50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
