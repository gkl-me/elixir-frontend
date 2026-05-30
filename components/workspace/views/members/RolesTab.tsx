"use client";

import React, { useState } from "react";
import { Shield, Crown, Users, Edit3, Trash2, Plus } from "lucide-react";
import { demoMembers, demoWorkspace } from "../../../../data/demoData";
import { CustomRole, ROLE_PRESETS } from "./shared";
import { CreateRoleModal } from "./modals/CreateRoleModal";
import { EditCustomRoleModal } from "./modals/EditCustomRoleModal";
import { DeleteRoleModal } from "./modals/DeleteRoleModal";

const BUILT_IN = [
  {
    id: "owner",
    label: "Owner",
    desc: "Full control.",
    color: "#f59e0b",
    icon: Crown,
    perms: "All permissions",
  },
  {
    id: "admin",
    label: "Admin",
    desc: "Manage projects, members, automations.",
    color: "#60a5fa",
    icon: Shield,
    perms: `${ROLE_PRESETS.admin.length} permissions`,
  },
  {
    id: "member",
    label: "Member",
    desc: "Standard contributor.",
    color: "#8b9cc8",
    icon: Users,
    perms: `${ROLE_PRESETS.member.length} permissions`,
  },
];

interface RolesTabProps {
  onCreateRole: () => void;
}

export const RolesTab = ({ onCreateRole }: RolesTabProps) => {
  const [editRole, setEditRole] = useState<CustomRole | null>(null);
  const [deleteRole, setDeleteRole] = useState<CustomRole | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const openCreate = () => {
    onCreateRole();
    setCreateOpen(true);
  };

  return (
    <div className="max-h-[calc(100vh-320px)] space-y-5 overflow-y-auto pr-1">
      {/* Built-in roles */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5578]">
        Built-in Roles
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {BUILT_IN.map((r) => {
          const Icon = r.icon;
          const count = demoMembers.filter((m) => m.role === r.id).length;
          return (
            <div
              key={r.id}
              className="flex flex-col gap-3 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-4"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${r.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: r.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{r.label}</p>
                  <p className="text-[10px]" style={{ color: r.color }}>
                    {r.perms}
                  </p>
                </div>
                <span className="ml-auto rounded-full border border-[#1e2a4a] px-1.5 py-0.5 text-[9px] text-[#4B5578]">
                  Built-in
                </span>
              </div>
              <p className="text-[11px] text-[#6b7db3]">{r.desc}</p>
              <p className="text-[10px] text-[#8b9cc8]">
                {count} member{count !== 1 ? "s" : ""}
              </p>
            </div>
          );
        })}
      </div>

      {/* Custom roles */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4B5578]">
          Custom Roles
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 text-xs font-medium text-[#8735C9] transition-colors hover:text-[#c084fc]"
        >
          <Plus className="h-3 w-3" />
          New custom role
        </button>
      </div>

      {demoWorkspace.customRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1e2a4a] bg-[#0C1635] py-12">
          <Shield className="mb-3 h-8 w-8 text-[#4B5578]" />
          <p className="mb-1 text-sm font-semibold text-white">
            No custom roles yet
          </p>
          <p className="mb-4 text-xs text-[#4B5578]">
            Create roles with specific permission sets.
          </p>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg border border-[#8735C9]/30 px-3 py-1.5 text-xs font-medium text-[#8735C9] transition-colors hover:text-[#c084fc]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create first role
          </button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {demoWorkspace.customRoles.map((r) => (
            <div
              key={r.id}
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
                  <button
                    onClick={() => setEditRole(r)}
                    className="flex h-6 w-6 items-center justify-center rounded hover:bg-[#1e2a4a]"
                  >
                    <Edit3 className="h-3 w-3 text-[#6b7db3]" />
                  </button>
                  <button
                    onClick={() => setDeleteRole(r)}
                    className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3 w-3 text-red-400/60" />
                  </button>
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
          <button
            onClick={openCreate}
            className="group flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#1e2a4a] bg-[#0C1635] p-4 transition-all hover:border-[#8735C9]"
          >
            <Plus className="h-5 w-5 text-[#4B5578] transition-colors group-hover:text-[#8735C9]" />
            <span className="text-xs text-[#6b7db3] transition-colors group-hover:text-white">
              New role
            </span>
          </button>
        </div>
      )}

      {createOpen && <CreateRoleModal onClose={() => setCreateOpen(false)} />}
      {editRole && (
        <EditCustomRoleModal
          role={editRole}
          onClose={() => setEditRole(null)}
        />
      )}
      {deleteRole && (
        <DeleteRoleModal
          role={deleteRole}
          onClose={() => setDeleteRole(null)}
        />
      )}
    </div>
  );
};
