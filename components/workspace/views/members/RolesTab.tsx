'use client';

import React, { useState } from 'react';
import { Shield, Crown, Users, Edit3, Trash2, Plus } from 'lucide-react';
import { demoMembers, demoWorkspace } from '../../../../data/demoData';
import { CustomRole, ROLE_PRESETS } from './shared';
import { CreateRoleModal } from './modals/CreateRoleModal';
import { EditCustomRoleModal } from './modals/EditCustomRoleModal';
import { DeleteRoleModal } from './modals/DeleteRoleModal';

const BUILT_IN = [
  { id: 'owner',  label: 'Owner',  desc: 'Full control.',                           color: '#f59e0b', icon: Crown,  perms: 'All permissions'                          },
  { id: 'admin',  label: 'Admin',  desc: 'Manage projects, members, automations.',  color: '#60a5fa', icon: Shield, perms: `${ROLE_PRESETS.admin.length} permissions`  },
  { id: 'member', label: 'Member', desc: 'Standard contributor.',                   color: '#8b9cc8', icon: Users,  perms: `${ROLE_PRESETS.member.length} permissions` },
];

interface RolesTabProps {
  onCreateRole: () => void;
}

export const RolesTab = ({ onCreateRole }: RolesTabProps) => {
  const [editRole,   setEditRole]   = useState<CustomRole | null>(null);
  const [deleteRole, setDeleteRole] = useState<CustomRole | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const openCreate = () => { onCreateRole(); setCreateOpen(true); };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-320px)] space-y-5 pr-1">

      {/* Built-in roles */}
      <p className="text-[10px] font-bold text-[#4B5578] uppercase tracking-widest">Built-in Roles</p>
      <div className="grid md:grid-cols-3 gap-3">
        {BUILT_IN.map(r => {
          const Icon = r.icon;
          const count = demoMembers.filter(m => m.role === r.id).length;
          return (
            <div key={r.id} className="p-4 bg-[#0C1635] border border-[#1e2a4a] rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${r.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: r.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{r.label}</p>
                  <p className="text-[10px]" style={{ color: r.color }}>{r.perms}</p>
                </div>
                <span className="ml-auto text-[9px] text-[#4B5578] border border-[#1e2a4a] px-1.5 py-0.5 rounded-full">Built-in</span>
              </div>
              <p className="text-[11px] text-[#6b7db3]">{r.desc}</p>
              <p className="text-[10px] text-[#8b9cc8]">{count} member{count !== 1 ? 's' : ''}</p>
            </div>
          );
        })}
      </div>

      {/* Custom roles */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-[#4B5578] uppercase tracking-widest">Custom Roles</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-1 text-xs text-[#8735C9] hover:text-[#c084fc] font-medium transition-colors"
        >
          <Plus className="w-3 h-3" />New custom role
        </button>
      </div>

      {demoWorkspace.customRoles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-[#0C1635] border border-dashed border-[#1e2a4a] rounded-2xl">
          <Shield className="w-8 h-8 text-[#4B5578] mb-3" />
          <p className="text-sm font-semibold text-white mb-1">No custom roles yet</p>
          <p className="text-xs text-[#4B5578] mb-4">Create roles with specific permission sets.</p>
          <button
            onClick={openCreate}
            className="text-xs text-[#8735C9] hover:text-[#c084fc] font-medium border border-[#8735C9]/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />Create first role
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-3">
          {demoWorkspace.customRoles.map(r => (
            <div key={r.id} className="group p-4 bg-[#0C1635] border border-[#1e2a4a] hover:border-[#293d6b] rounded-xl flex flex-col gap-3 transition-all">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8735C9]/15 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#c084fc]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{r.name}</p>
                  <p className="text-[10px] text-[#c084fc]">{r.permissions.length} permissions</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditRole(r)} className="w-6 h-6 rounded hover:bg-[#1e2a4a] flex items-center justify-center">
                    <Edit3 className="w-3 h-3 text-[#6b7db3]" />
                  </button>
                  <button onClick={() => setDeleteRole(r)} className="w-6 h-6 rounded hover:bg-red-500/10 flex items-center justify-center">
                    <Trash2 className="w-3 h-3 text-red-400/60" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {r.permissions.slice(0, 4).map(p => (
                  <span key={p} className="text-[9px] px-1.5 py-0.5 bg-[#07112b] border border-[#1e2a4a] rounded text-[#8b9cc8]">{p}</span>
                ))}
                {r.permissions.length > 4 && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#07112b] border border-[#1e2a4a] rounded text-[#4B5578]">
                    +{r.permissions.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={openCreate}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-[#0C1635] border-2 border-dashed border-[#1e2a4a] hover:border-[#8735C9] rounded-xl transition-all group min-h-[100px]"
          >
            <Plus className="w-5 h-5 text-[#4B5578] group-hover:text-[#8735C9] transition-colors" />
            <span className="text-xs text-[#6b7db3] group-hover:text-white transition-colors">New role</span>
          </button>
        </div>
      )}

      {createOpen  && <CreateRoleModal                             onClose={() => setCreateOpen(false)}  />}
      {editRole    && <EditCustomRoleModal role={editRole}         onClose={() => setEditRole(null)}      />}
      {deleteRole  && <DeleteRoleModal    role={deleteRole}        onClose={() => setDeleteRole(null)}    />}
    </div>
  );
};
