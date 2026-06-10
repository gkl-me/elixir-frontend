"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Check, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { cn } from "@/lib/utils";
import { initials, grad, ROLE_BADGE } from "./shared";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { toastHandler } from "@/lib/toastHandler";
import { addMembersAction } from "@/app/actions/workspace.action";
import { Member } from "../members/shared";

interface AddMembersModalProps {
  teamId: string;
  excludeIds: string[];
  onSuccess: () => void;
  onClose: () => void;
}

export const AddMembersModal = ({
  teamId,
  excludeIds,
  onSuccess,
  onClose,
}: AddMembersModalProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const { execute: fetchWorkspaceMembers, isLoading: membersLoading } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_MEMBERS,
    method: "GET",
  });

  const loadMembers = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const res = await fetchWorkspaceMembers({
        params: { workspaceId },
      });
      if (res?.success) {
        setMembers(res.data.members || []);
      }
    } catch (error) {
      toastHandler({
        success: false,
        error: AxiosErrorHandler(error).message,
      });
    }
  }, [workspaceId, fetchWorkspaceMembers]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const available = members
    .filter((m) => !excludeIds.includes(m.userId))
    .filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.email.toLowerCase().includes(q.toLowerCase())
    );

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const handleAdd = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      const res = await addMembersAction({
        workspaceId,
        teamId,
        memberIds: selected,
      });
      if (res.success) {
        toastHandler({ success: true, message: "Members added successfully" });
        onSuccess();
        onClose();
      } else {
        toastHandler({ success: false, error: res.error || "Failed to add members" });
      }
    } catch (error) {
      toastHandler({ success: false, error: "Failed to add members" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Add Members"
      description="Select workspace members to add to this team."
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search members…"
            className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2.5 pl-9 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
          />
        </div>

        {/* Member checklist — scrollable */}
        <div className="max-h-[50vh] space-y-1.5 overflow-y-auto pr-0.5 scrollbar-hide">
          {membersLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#8735C9]" />
            </div>
          ) : available.length === 0 ? (
            <p className="py-6 text-center text-[11px] text-[#4B5578]">
              {members.filter((m) => !excludeIds.includes(m.userId)).length === 0
                ? "All workspace members are already in this team."
                : "No members match your search."}
            </p>
          ) : (
            available.map((m) => {
              const sel = selected.includes(m.userId);
              const badge = ROLE_BADGE[m.roleKey.toLowerCase()] ?? ROLE_BADGE.member;
              const Icon = badge.icon;
              return (
                <button
                  key={m.userId}
                  onClick={() => toggle(m.userId)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                    sel
                      ? "border-[#8735C9] bg-[#8735C9]/10"
                      : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold text-white",
                      grad(m.name)
                    )}
                  >
                    {initials(m.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        sel ? "text-white" : "text-[#8b9cc8]"
                      )}
                    >
                      {m.name}
                    </p>
                    <p className="truncate text-[11px] text-[#4B5578]">
                      {m.email}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "mr-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                      badge.bg
                    )}
                    style={{ color: badge.color }}
                  >
                    <Icon className="h-2.5 w-2.5" />
                    {m.roleKey}
                  </span>
                  <div
                    className={cn(
                      "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
                      sel ? "border-[#8735C9] bg-[#8735C9]" : "border-[#293d6b]"
                    )}
                  >
                    {sel && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Pinned footer */}
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0 || loading}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Add{" "}
            {selected.length > 0
              ? `${selected.length} Member${selected.length > 1 ? "s" : ""}`
              : "Members"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};
