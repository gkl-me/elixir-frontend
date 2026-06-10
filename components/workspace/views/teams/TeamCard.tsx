"use client";

import { Users, Settings, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { initials, grad } from "./shared";
import { WorkspaceTeamsList } from "@/types/IWorkspaceType";

interface TeamCardProps {
  team: WorkspaceTeamsList;
  onManage: () => void;
}

export const TeamCard = ({ team, onManage }: TeamCardProps) => {


  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635] transition-all duration-200 hover:border-[#293d6b]">
      <div className="h-0.5 w-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_2px_8px_rgba(135,53,201,0.3)]">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white transition-colors group-hover:text-[#c084fc]">
                {team.name}
              </p>
              <p className="mt-0.5 text-[10px] text-[#4B5578]">
                {team.memberCount} member{team.memberCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Avatar stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.memberName.slice(0, 5).map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0C1635] bg-gradient-to-br text-[10px] font-bold text-white",
                  grad(m)
                )}
                style={{ zIndex: 10 - i }}
              >
                {initials(m)}
              </div>
            ))}
            {team.memberCount > 5 && (
              <div className="z-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0C1635] bg-[#132353]">
                <span className="text-[9px] font-bold text-[#8b9cc8]">
                  +{team.memberCount - 5}
                </span>
              </div>
            )}
          </div>
          {team.memberCount === 0 && (
            <p className="text-[11px] italic text-[#4B5578]">No members yet</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e2a4a] px-5 py-3">
        <button
          onClick={onManage}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-semibold text-[#8b9cc8] transition-all hover:bg-[#1e2a4a] hover:text-white"
        >
          <Settings className="h-3.5 w-3.5 text-[#8735C9] transition-colors group-hover/btn:text-[#c084fc]" />
          Manage Team
          <ArrowRight className="ml-auto h-3 w-3 opacity-0 transition-all group-hover/btn:translate-x-0.5 group-hover/btn:opacity-100" />
        </button>
      </div>
    </div>
  );
};
