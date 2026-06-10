"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Crown,
  Users,
  Edit3,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { WorkspaceRole } from "./shared";
import { CreateRoleModal } from "./modals/CreateRoleModal";
import { EditCustomRoleModal } from "./modals/EditCustomRoleModal";
import { DeleteRoleModal } from "./modals/DeleteRoleModal";
import { useApi } from "@/hooks/useApi";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { PermissionGate } from "@/components/workspace/PermissionGate";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { toastHandler } from "@/lib/toastHandler";

const BUILT_IN_META: Record<
  string,
  { color: string; icon: React.ElementType; desc: string }
> = {
  owner: {
    color: "#f59e0b",
    icon: Crown,
    desc: "Full control over the workspace.",
  },
  admin: {
    color: "#60a5fa",
    icon: Shield,
    desc: "Manage projects, members and automations.",
  },
  member: {
    color: "#8b9cc8",
    icon: Users,
    desc: "Standard contributor access.",
  },
};

interface RolesTabProps {
  onCreateRole?: () => void;
  refreshTrigger?: number;
}

export const RolesTab = ({ onCreateRole, refreshTrigger }: RolesTabProps) => {
  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  const {
    data,
    isLoading,
    execute: refetch,
  } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_ROLES,
    method: "GET",
  });

  const allRoles: WorkspaceRole[] = data?.data?.roles ?? [];
  const builtIn = allRoles.filter((r) => !r.isEditable);
  const custom = allRoles.filter((r) => r.isEditable);

  const [editRole, setEditRole] = useState<WorkspaceRole | null>(null);
  const [deleteRole, setDeleteRole] = useState<WorkspaceRole | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const fetchRoles = React.useCallback(async () => {
    if (!workspaceId) {
      return;
    }
    try {
      await refetch({
        params: {
          workspaceId,
        },
      });
    } catch (error) {
      const err = AxiosErrorHandler(error);
      toastHandler({ success: false, error: err.message });
    }
  }, [workspaceId, refetch]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles, refreshTrigger]);

  const openCreate = () => {
    onCreateRole?.();
    setCreateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[#8735C9]" />
      </div>
    );
  }

  return (
    <div className="max-h-[calc(100vh-320px)] space-y-5 overflow-y-auto pr-1">
      {/* Built-in roles */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5578]">
        Built-in Roles
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {builtIn.map((r) => {
          const meta = BUILT_IN_META[r.key] ?? BUILT_IN_META.member;
          const Icon = meta.icon;
          return (
            <div
              key={r.key}
              className="flex flex-col gap-3 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-4"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${meta.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: meta.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold capitalize text-white">
                    {r.name}
                  </p>
                  <p className="text-[10px]" style={{ color: meta.color }}>
                    {r.permissions.length === 0
                      ? "All permissions"
                      : `${r.permissions.length} permissions`}
                  </p>
                </div>
                <span className="ml-auto rounded-full border border-[#1e2a4a] px-1.5 py-0.5 text-[9px] text-[#4B5578]">
                  Built-in
                </span>
              </div>
              <p className="text-[11px] text-[#6b7db3]">{meta.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Custom roles */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5578]">
          Custom Roles
        </p>
        <PermissionGate require="roles.create">
          <button
            onClick={openCreate}
            className="flex items-center gap-1 text-xs font-medium text-[#8735C9] transition-colors hover:text-[#c084fc]"
          >
            <Plus className="h-3 w-3" />
            New custom role
          </button>
        </PermissionGate>
      </div>

      {custom.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e2a4a] bg-[#0C1635] py-12">
          <Shield className="mb-3 h-8 w-8 text-[#4B5578]" />
          <p className="mb-1 text-sm font-semibold text-white">
            No custom roles yet
          </p>
          <p className="mb-4 text-xs text-[#4B5578]">
            Create roles with specific permission sets.
          </p>
          <PermissionGate require="roles.create">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg border border-[#8735C9]/30 px-3 py-1.5 text-xs font-medium text-[#8735C9] transition-colors hover:text-[#c084fc]"
            >
              <Plus className="h-3.5 w-3.5" />
              Create first role
            </button>
          </PermissionGate>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {custom.map((r) => (
            <div
              key={r.id ?? r.key}
              className="group flex flex-col gap-3 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-4 transition-all hover:border-[#293d6b]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8735C9]/15">
                  <Shield className="h-4 w-4 text-[#c084fc]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {r.name}
                  </p>
                  <p className="text-[10px] text-[#c084fc]">
                    {r.permissions.length} permissions
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <PermissionGate require="roles.update">
                    <button
                      onClick={() => setEditRole(r)}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#1e2a4a]"
                    >
                      <Edit3 className="h-3 w-3 text-[#6b7db3]" />
                    </button>
                  </PermissionGate>
                  <PermissionGate require="roles.delete">
                    <button
                      onClick={() => setDeleteRole(r)}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3 text-red-400/60" />
                    </button>
                  </PermissionGate>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {r.permissions.slice(0, 4).map((p) => (
                  <span
                    key={p}
                    className="rounded border border-[#1e2a4a] bg-[#07112b] px-1.5 py-0.5 text-[9px] text-[#8b9cc8]"
                  >
                    {p}
                  </span>
                ))}
                {r.permissions.length > 4 && (
                  <span className="rounded border border-[#1e2a4a] bg-[#07112b] px-1.5 py-0.5 text-[9px] text-[#4B5578]">
                    +{r.permissions.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))}

          <PermissionGate require="roles.create">
            <button
              onClick={openCreate}
              className="group flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#1e2a4a] bg-[#0C1635] p-4 transition-all hover:border-[#8735C9]"
            >
              <Plus className="h-5 w-5 text-[#4B5578] transition-colors group-hover:text-[#8735C9]" />
              <span className="text-xs text-[#6b7db3] transition-colors group-hover:text-white">
                New role
              </span>
            </button>
          </PermissionGate>
        </div>
      )}

      {createOpen && (
        <CreateRoleModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setCreateOpen(false);
            fetchRoles();
          }}
        />
      )}
      {editRole && (
        <EditCustomRoleModal
          role={editRole}
          onClose={() => setEditRole(null)}
          onSuccess={() => {
            setEditRole(null);
            fetchRoles();
          }}
        />
      )}
      {deleteRole && (
        <DeleteRoleModal
          role={deleteRole}
          onClose={() => setDeleteRole(null)}
          onSuccess={() => {
            setDeleteRole(null);
            fetchRoles();
          }}
        />
      )}
    </div>
  );
};
