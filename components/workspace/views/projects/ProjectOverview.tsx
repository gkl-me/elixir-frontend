"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Activity as ActivityIcon,
  BarChart3,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkspaceProject, initials, grad } from "./shared";

interface OverviewProps {
  project: WorkspaceProject;
}

export const ProjectOverview: React.FC<OverviewProps> = ({ project }) => {
  const [activities] = useState([]);

  const doneCount = project?.doneTasks || 0;
  const taskCount = project?.totalTasks || 0;
  const inProgressCount = project?.inProgressTasks || 0;
  const inReviewCount = project?.inReviewTasks || 0;
  const toDoCount = project?.toDoTasks || 0;

  const donePoints = project?.doneStoryPoints || 0;
  const totalPoints = project?.totalStoryPoints || 0;

  const progress =
    taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;
  const storyPointsPct =
    totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;
  const inProgressPct =
    taskCount > 0 ? Math.round((inProgressCount / taskCount) * 100) : 0;

  const statCards = [
    {
      label: "Completion",
      value: `${progress}%`,
      sub: `${doneCount} of ${taskCount} tasks`,
      icon: Target,
      iconColor: "text-[#c084fc]",
      iconBg: "bg-[#8735C9]/15",
      accent: "from-[#8735C9]/20 to-transparent",
      progress: progress,
      progressColor: "from-[#8735C9] to-[#60a5fa]",
    },
    {
      label: "Story Points",
      value: `${donePoints}/${totalPoints}`,
      sub: `${storyPointsPct}% delivered`,
      icon: BarChart3,
      iconColor: "text-[#60a5fa]",
      iconBg: "bg-[#3b82f6]/15",
      accent: "from-[#3b82f6]/20 to-transparent",
      progress: storyPointsPct,
      progressColor: "from-[#3b82f6] to-[#06b6d4]",
    },
    {
      label: "In Progress",
      value: `${inProgressCount}`,
      sub: `${inReviewCount} pending review`,
      icon: ActivityIcon,
      iconColor: "text-[#34d399]",
      iconBg: "bg-emerald-500/15",
      accent: "from-emerald-500/20 to-transparent",
      progress: inProgressPct,
      progressColor: "from-[#34d399] to-[#10b981]",
    },
    {
      label: "Tasks Done",
      value: `${doneCount}`,
      sub: `${toDoCount} tasks in backlog`,
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15",
      accent: "from-emerald-500/20 to-transparent",
      progress: progress,
      progressColor: "from-emerald-400 to-teal-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-5 transition-all duration-200 hover:border-[#293d6b] hover:shadow-[0_4px_24px_rgba(135,53,201,0.08)]"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                  card.accent
                )}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[#6b7db3]">
                    {card.label}
                  </p>
                  <div className={cn("rounded-lg p-1.5", card.iconBg)}>
                    <Icon className={cn("h-3.5 w-3.5", card.iconColor)} />
                  </div>
                </div>
                <p className="mt-2.5 text-2xl font-black text-white">
                  {card.value}
                </p>
                <p className="mt-0.5 text-[10px] text-[#4B5578]">{card.sub}</p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#07112b]">
                  <div
                    className={cn(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                      card.progressColor
                    )}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2-Column Equal Grid: Task Distribution & Activity Feed ──────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Task Distribution ── */}
        <div className="flex flex-col rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-6 shadow-md">
          <div className="mb-5 border-b border-[#1e2a4a] pb-3">
            <h3 className="text-base font-bold text-white">
              Task Distribution
            </h3>
            <p className="mt-0.5 text-xs text-[#6b7db3]">
              Breakdown by current status
            </p>
          </div>

          <div className="flex-1 space-y-4">
            {[
              {
                label: "Done",
                count: doneCount,
                color: "#34d399",
                bar: "bg-[#34d399]",
              },
              {
                label: "In Progress",
                count: inProgressCount,
                color: "#60a5fa",
                bar: "bg-[#60a5fa]",
              },
              {
                label: "In Review",
                count: inReviewCount,
                color: "#f59e0b",
                bar: "bg-[#f59e0b]",
              },
              {
                label: "To Do",
                count: toDoCount,
                color: "#6b7db3",
                bar: "bg-[#6b7db3]",
              },
            ].map((s) => {
              const pct =
                taskCount > 0 ? Math.round((s.count / taskCount) * 100) : 0;
              return (
                <div key={s.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="font-medium text-[#8b9cc8]">
                        {s.label}
                      </span>
                    </div>
                    <span className="font-bold text-white">
                      {s.count}{" "}
                      <span className="ml-1 text-[11px] font-normal text-[#4B5578]">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#07112b]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        s.bar
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Activity Feed ── */}
        <div className="flex flex-col rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-6 shadow-md">
          <div className="mb-5 border-b border-[#1e2a4a] pb-3">
            <h3 className="text-base font-bold text-white">Activity</h3>
            <p className="mt-0.5 text-xs text-[#6b7db3]">
              Recent updates & logs
            </p>
          </div>

          <div className="flex-1 space-y-0">
            {activities.length === 0 ? (
              <p className="py-8 text-center text-xs text-[#4B5578]">
                No recent activity
              </p>
            ) : (
              activities.map((a, idx) => (
                <div
                  key={a.id}
                  className={cn(
                    "flex items-start gap-3 py-3",
                    idx < activities.length - 1 && "border-b border-[#1e2a4a]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white shadow-sm",
                      grad(a.user)
                    )}
                  >
                    {initials(a.user)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#8b9cc8]">
                      <span className="font-semibold text-white">{a.user}</span>{" "}
                      {a.action}{" "}
                      <span className="font-medium text-[#c084fc]">
                        "{a.target}"
                      </span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#4B5578]">
                      {a.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
