"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Users, Search, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/modal/CustomModal";
import { cn } from "@/lib/utils";
import { initials, grad } from "./shared";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { toastHandler } from "@/lib/toastHandler";
import { createTeamAction } from "@/app/actions/workspace.action";
import { Member } from "../members/shared";

interface CreateTeamModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTeamModal = ({
  onClose,
  onSuccess,
}: CreateTeamModalProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");
  const [form, setForm] = useState({
    name: "",
    description: "",
    memberIds: [] as string[],
  });
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const { execute, isLoading: membersLoading } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_MEMBERS,
    method: "GET",
  });

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) {
      return;
    }
    try {
      const res = await execute({
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
  }, [workspaceId, execute]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter(
    (m) =>
      !q ||
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase())
  );

  const toggle = (id: string) =>
    setForm((f) => ({
      ...f,
      memberIds: f.memberIds.includes(id)
        ? f.memberIds.filter((m) => m !== id)
        : [...f.memberIds, id],
    }));

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setErr("Team name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await createTeamAction({
        workspaceId,
        name: form.name,
        description: form.description,
        memberIds: form.memberIds,
      });
      if (res.success) {
        toastHandler({ success: true, message: "Team created successfully" });
        onSuccess();
        onClose();
      } else {
        toastHandler({
          success: false,
          error: res.error || "Failed to create team",
        });
      }
    } catch (error) {
      toastHandler({ success: false, error: AxiosErrorHandler(error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title="Create Team"
      description="Organise members into a focused team."
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                setErr("");
              }}
              placeholder="e.g. Frontend Guild"
              className={cn(
                "w-full rounded-xl border bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578]",
                err
                  ? "border-red-400/50"
                  : "border-[#1e2a4a] focus:border-[#8735C9]"
              )}
            />
            {err && <p className="mt-1 text-[11px] text-red-400">{err}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Description{" "}
              <span className="font-normal normal-case text-[#4B5578]">
                (optional)
              </span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="What does this team work on?"
              rows={2}
              className="w-full resize-none rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none placeholder:text-[#4B5578] focus:border-[#8735C9]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Add Members{" "}
              <span className="font-normal normal-case text-[#4B5578]">
                (optional)
              </span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search members…"
                className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
              />
            </div>
            <div className="max-h-[180px] space-y-1 overflow-y-auto pr-0.5">
              {membersLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-[#8b9cc8]" />
                </div>
              ) : (
                filteredMembers.map((m) => {
                  const sel = form.memberIds.includes(m.userId);
                  return (
                    <button
                      key={m.memberId}
                      onClick={() => toggle(m.userId)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all",
                        sel
                          ? "border-[#8735C9] bg-[#8735C9]/10"
                          : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white",
                          grad(m.name)
                        )}
                      >
                        {initials(m.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-xs font-medium",
                            sel ? "text-white" : "text-[#8b9cc8]"
                          )}
                        >
                          {m.name}
                        </p>
                        <p className="truncate text-[10px] text-[#4B5578]">
                          {m.email}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
                          sel
                            ? "border-[#8735C9] bg-[#8735C9]"
                            : "border-[#293d6b]"
                        )}
                      >
                        {sel && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
            {form.memberIds.length > 0 && (
              <p className="mt-2 text-[11px] text-[#c084fc]">
                {form.memberIds.length} selected
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
          <Button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Users className="h-4 w-4" />
            )}
            Create Team
          </Button>
          <Button
            disabled={loading}
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
