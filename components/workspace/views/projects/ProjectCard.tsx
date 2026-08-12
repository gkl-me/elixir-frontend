"use client";

import React from "react";
import {
  FolderKanban,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WorkspaceProject,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  daysLeft,
  tagColor,
} from "./shared";

interface ProjectCardProps {
  project: WorkspaceProject;
  onView: () => void;
}

export const ProjectCard = ({ project, onView }: ProjectCardProps) => {
  const status = STATUS_CONFIG[project.status];
  const priority = PRIORITY_CONFIG[project.priority];
  const progress =
    project.totalTasks === 0
      ? 0
      : Math.round((project.doneTasks / project.totalTasks) * 100);
  const tags = project.tags || [];

  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635] transition-all duration-200 hover:border-[#293d6b] hover:shadow-[0_4px_24px_rgba(135,53,201,0.12)]"
      onClick={onView}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8735C9] to-[#6a29a0] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col space-y-4 p-5">
        {/* Header: Icon + title + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_8px_rgba(135,53,201,0.3)]">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              {/* Identifier chip */}
              <span className="mb-0.5 inline-block rounded border border-[#1e2a4a] bg-[#07112b] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-[#6b7db3]">
                {project.key}
              </span>
              <p className="truncate text-sm font-bold text-white transition-colors group-hover:text-[#c084fc]">
                {project.name}
              </p>
            </div>
          </div>

          <span
            className={cn(
              "flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors",
              status.bg
            )}
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-[#8b9cc8]">
          {project.description || "No description provided."}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.slice(0, 3).map((tag) => {
              const swatch = tagColor(tag);
              return (
                <span
                  key={tag}
                  className="rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors"
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
            {tags.length > 3 && (
              <span className="rounded-full border border-[#1e2a4a] px-2 py-0.5 text-[10px] text-[#4B5578]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-[#1e2a4a] bg-[#07112b] px-2 py-0.5 text-[10px] font-medium text-[#8b9cc8]">
            <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
            {priority.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] text-[#6b7db3]">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {project.doneTasks}/{project.totalTasks} tasks
            </span>
            <span className="text-[10px] font-bold text-white">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#07112b]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background:
                  progress >= 80
                    ? "linear-gradient(90deg,#8735C9,#34d399)"
                    : progress >= 50
                      ? "linear-gradient(90deg,#8735C9,#60a5fa)"
                      : "linear-gradient(90deg,#8735C9,#c084fc)",
              }}
            />
          </div>
        </div>

        {/* Due date */}
        {project.dueDate && (
          <span
            className={cn(
              "flex items-center gap-1 text-[10px]",
              new Date(project.dueDate) < new Date()
                ? "text-red-400"
                : "text-[#6b7db3]"
            )}
          >
            <Clock className="h-2.5 w-2.5" />
            {daysLeft(project.dueDate)}
          </span>
        )}
      </div>

      {/* Card footer */}
      <div className="border-t border-[#1e2a4a] px-5 py-3">
        <button className="group/btn flex w-full items-center justify-center gap-2 rounded-lg py-1 text-xs font-semibold text-[#8b9cc8] transition-all hover:bg-[#1e2a4a] hover:text-white">
          <span>View Project</span>
          <ArrowRight className="ml-auto h-3 w-3 opacity-0 transition-all group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100" />
        </button>
      </div>
    </div>
  );
};

// ─── List Row variant ─────────────────────────────────────────────────────────
interface ProjectRowProps {
  project: WorkspaceProject;
  onView: () => void;
}

export const ProjectRow = ({ project, onView }: ProjectRowProps) => {
  const status = STATUS_CONFIG[project.status];
  const priority = PRIORITY_CONFIG[project.priority];
  const progress =
    project.totalTasks === 0
      ? 0
      : Math.round((project.doneTasks / project.totalTasks) * 100);
  const tags = project.tags || [];

  return (
    <div
      className="group flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-[#1e2a4a] bg-[#0C1635] px-5 py-3.5 transition-all duration-200 hover:border-[#293d6b] hover:bg-[#0f1d3d]"
      onClick={onView}
    >
      {/* Icon */}
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_2px_6px_rgba(135,53,201,0.25)]">
        <FolderKanban className="h-4 w-4 text-white" />
      </div>

      {/* Name + identifier */}
      <div className="flex min-w-[180px] flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[#4B5578]">
            {project.key}
          </span>
          {tags.slice(0, 2).map((tag) => {
            const swatch = tagColor(tag);
            return (
              <span
                key={tag}
                className="rounded-full border px-1.5 py-0.5 text-[9px] font-medium"
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
          {tags.length > 2 && (
            <span className="rounded-full border border-[#1e2a4a] px-1.5 py-0.5 text-[9px] text-[#4B5578]">
              +{tags.length - 2}
            </span>
          )}
        </div>
        <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#c084fc]">
          {project.name}
        </p>
      </div>

      {/* Priority */}
      <div className="hidden w-28 flex-shrink-0 items-center gap-1.5 sm:flex">
        <span
          className={cn("h-2 w-2 flex-shrink-0 rounded-full", priority.dot)}
        />
        <span className="text-xs text-[#8b9cc8]">{priority.label}</span>
      </div>

      {/* Progress */}
      <div className="hidden w-36 flex-shrink-0 flex-col gap-1 md:flex">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#6b7db3]">
            {project.doneTasks}/{project.totalTasks}
          </span>
          <span className="text-[10px] font-bold text-white">{progress}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#07112b]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background:
                progress >= 80
                  ? "linear-gradient(90deg,#8735C9,#34d399)"
                  : "linear-gradient(90deg,#8735C9,#60a5fa)",
            }}
          />
        </div>
      </div>

      {/* Due date */}
      <div className="hidden w-24 flex-shrink-0 items-center gap-1 sm:flex">
        {project.dueDate ? (
          <span
            className={cn(
              "flex items-center gap-1 text-[10px]",
              new Date(project.dueDate) < new Date()
                ? "text-red-400"
                : "text-[#6b7db3]"
            )}
          >
            <Calendar className="h-2.5 w-2.5" />
            {daysLeft(project.dueDate)}
          </span>
        ) : (
          <span className="text-[10px] text-[#4B5578]">—</span>
        )}
      </div>

      {/* Status */}
      <div className="flex w-24 flex-shrink-0 justify-center">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
            status.bg
          )}
          style={{ color: status.color }}
        >
          {status.label}
        </span>
      </div>

      {/* Arrow */}
      <div className="flex w-6 flex-shrink-0 justify-end">
        <ArrowRight className="h-3.5 w-3.5 text-[#4B5578] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[#c084fc] group-hover:opacity-100" />
      </div>
    </div>
  );
};
