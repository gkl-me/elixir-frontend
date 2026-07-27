"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FolderKanban, Users, HardDrive } from "lucide-react";
import { Section } from "./shared";
import { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { toastHandler } from "@/lib/toastHandler";
import { AxiosErrorHandler } from "@/lib/errorHandler";

// ─── Usage Meter ──────────────────────────────────────────
const UsageMeter = ({
  label,
  used,
  limit,
  unit = "",
  icon: Icon,
  color = "#8735C9",
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  icon: React.ElementType;
  color?: string;
}) => {
  const pct =
    limit === -1 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const warn = pct >= 80;
  const barColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : color;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5" style={{ color }} />
          <span className="text-sm font-medium text-[#c9d3ed]">{label}</span>
        </div>
        <span
          className={cn(
            "text-xs font-semibold",
            warn ? "text-amber-400" : "text-[#6b7db3]"
          )}
        >
          {limit === -1 ? `${used} / ∞` : `${used} / ${limit}${unit}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#07112b]">
        {limit !== -1 && (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        )}
        {limit === -1 && (
          <div
            className="h-full rounded-full bg-emerald-500/40"
            style={{ width: "100%" }}
          />
        )}
      </div>
    </div>
  );
};

// ─── UsageTab ─────────────────────────────────────────────
export const UsageTab = () => {

  type UsageType = {
    projects: number,
    members: number,
    teams: number,
    storageBytes: number,
    customRoles: number
  }

  const [limits, setLimits] = useState<UsageType>({
    projects: -1,
    members: -1,
    teams: -1,
    storageBytes: 524288000,
    customRoles: -1,
  })
  const [used, setUsed] = useState<UsageType>()

  const workspaceId = useWorkspaceStore((s) => s?.context?.workspaceId)

  const { execute } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_LIMITS,
    method: "GET"
  })

  const fetchLimits = useCallback(async () => {
    if (!workspaceId) {
      return
    }

    try {
      const res = await execute({
        params: {
          workspaceId
        }
      })

      console.log("limits", res.data)

      if (res?.success) {
        setLimits(res.data.limits)
        setUsed(res.data.used)
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    }
  }, [workspaceId, execute])

  useEffect(() => {
    fetchLimits()
  }, [fetchLimits])

  return (
    <div className="space-y-6">
      <Section
        title="Usage & Limits"
        description="Seats = active members who can log in and collaborate. Each person using the workspace counts as one seat."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <UsageMeter
            label="Projects"
            used={used?.projects}
            limit={limits?.projects}
            icon={FolderKanban}
            color="#8735C9"
          />
          <UsageMeter
            label="Members"
            used={used?.members}
            limit={limits?.members}
            icon={Users}
            color="#60a5fa"
          />
          <UsageMeter
            label="Teams"
            used={used?.teams}
            limit={limits?.teams}
            icon={Users}
            color="#34d399"
          />
          <UsageMeter
            label="Storage"
            used={used?.storageBytes / 1048576}
            limit={limits?.storageBytes / 1048576}
            icon={HardDrive}
            color="#f59e0b"
            unit=" MB"
          />
        </div>
      </Section>

      <Section
        title="Custom Roles"
        description="Manage custom roles available in your plan."
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#c9d3ed]">Custom Roles Used</p>
            <p className="mt-1 text-2xl font-black text-white">
              {used?.customRoles}
              <span className="text-sm font-normal text-[#6b7db3]">
                /{" "}
                {limits?.customRoles === -1
                  ? "∞"
                  : limits?.customRoles}
              </span>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};
