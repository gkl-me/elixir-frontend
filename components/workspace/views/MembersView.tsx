'use client';

import React, { useState, useMemo } from 'react';
import {
  UserPlus, Search, Shield, Check, Plus, X, Mail,
  Edit3, Trash2, Crown, Users, Zap, Clock, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import { DataTable } from '@/components/table/DataTable';
import { demoMembers, demoWorkspace, demoInvites, type Invite } from '../../../data/demoData';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────
type Member = typeof demoMembers[0];
type CustomRole = typeof demoWorkspace.customRoles[0];

// ─── Helpers ──────────────────────────────────────────────
const initials = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase();
const GRADS = ['from-[#8735C9] to-[#6a29a0]','from-[#3b82f6] to-[#1d4ed8]','from-[#10b981] to-[#059669]','from-[#f59e0b] to-[#d97706]'];
const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

const ROLE_BADGE: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  owner:  { color: '#f59e0b', bg: 'bg-amber-500/10  border-amber-500/30',  icon: Crown   },
  admin:  { color: '#60a5fa', bg: 'bg-blue-500/10   border-blue-500/30',   icon: Shield  },
  member: { color: '#8b9cc8', bg: 'bg-[#1e2a4a]     border-[#293d6b]',     icon: Users   },
};

const STATUS_BADGE: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  pending:  { color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/30', icon: Clock,         label: 'Pending'  },
  accepted: { color: '#34d399', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2, label: 'Accepted' },
  expired:  { color: '#6b7db3', bg: 'bg-[#1e2a4a] border-[#293d6b]',      icon: AlertCircle,   label: 'Expired'  },
};

const PERMISSION_GROUPS = [
  { group: 'Projects', items: [
    { id: 'projects.view',   label: 'View Projects',     desc: 'See all projects'              },
    { id: 'projects.create', label: 'Create Projects',   desc: 'Create new projects'            },
    { id: 'projects.manage', label: 'Manage Projects',   desc: 'Archive, rename, delete'        },
  ]},
  { group: 'Backlog & Tasks', items: [
    { id: 'backlog.view',   label: 'View Tasks',         desc: 'See all issues and tasks'       },
    { id: 'backlog.manage', label: 'Manage Tasks',       desc: 'Create, edit, close issues'     },
    { id: 'sprints.manage', label: 'Manage Sprints',     desc: 'Start, close, plan sprints'     },
  ]},
  { group: 'Members', items: [
    { id: 'members.view',   label: 'View Members',       desc: 'See member list'                },
    { id: 'members.invite', label: 'Invite Members',     desc: 'Send workspace invitations'     },
    { id: 'members.manage', label: 'Manage Members',     desc: 'Change roles, remove members'   },
  ]},
  { group: 'Workspace', items: [
    { id: 'activity.view_all',  label: 'View All Activity', desc: 'Full team audit log'         },
    { id: 'automations.view',   label: 'View Automations',  desc: 'See automation rules'        },
    { id: 'automations.manage', label: 'Manage Automations',desc: 'Create/edit automations'     },
    { id: 'storage.view',       label: 'View Storage',      desc: 'Browse files'                },
    { id: 'billing.view',       label: 'View Billing',      desc: 'See plan & invoices'         },
    { id: 'billing.manage',     label: 'Manage Billing',    desc: 'Upgrade or cancel plan'      },
    { id: 'roles.manage',       label: 'Manage Roles',      desc: 'Create and edit roles'       },
    { id: 'workspace.manage',   label: 'Workspace Admin',   desc: 'Full workspace control'      },
  ]},
];

const ROLE_PRESETS: Record<string, string[]> = {
  admin:  ['projects.view','projects.create','projects.manage','backlog.view','backlog.manage','sprints.manage','members.view','members.invite','members.manage','activity.view_all','automations.view','automations.manage','storage.view','billing.view'],
  member: ['projects.view','backlog.view','backlog.manage','members.view','storage.view'],
};

// ─── Role Form (shared between Create & Edit Role modals) ─
const RoleForm = ({
  initialName = '',
  initialPerms = [...ROLE_PRESETS.member],
  onSave,
  onClose,
  saveLabel = 'Create Role',
}: {
  initialName?: string;
  initialPerms?: string[];
  onSave: (name: string, perms: string[]) => void;
  onClose: () => void;
  saveLabel?: string;
}) => {
  const [name,   setName]   = useState(initialName);
  const [perms,  setPerms]  = useState<string[]>(initialPerms);
  const [preset, setPreset] = useState<'blank'|'member'|'admin'>('member');
  const [err,    setErr]    = useState('');
  const toggle = (id: string) => setPerms(ps => ps.includes(id) ? ps.filter(p => p !== id) : [...ps, id]);
  const applyPreset = (p: 'blank'|'member'|'admin') => { setPreset(p); setPerms(p === 'blank' ? [] : [...ROLE_PRESETS[p]]); };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-y-auto max-h-[65vh] pr-1 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Role Name *</label>
          <input value={name} onChange={e => { setName(e.target.value); setErr(''); }}
            placeholder="e.g. Guest Developer"
            className={cn('w-full bg-[#07112b] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors',
              err ? 'border-red-400/50' : 'border-[#1e2a4a] focus:border-[#8735C9]')} />
          {err && <p className="text-red-400 text-[11px] mt-1">{err}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">Start From</label>
          <div className="flex gap-2">
            {(['blank','member','admin'] as const).map(p => (
              <button key={p} onClick={() => applyPreset(p)}
                className={cn('flex-1 py-2 rounded-xl border text-xs font-semibold capitalize transition-all',
                  preset === p ? 'border-[#8735C9] bg-[#8735C9]/15 text-[#c084fc]' : 'border-[#1e2a4a] text-[#6b7db3] hover:border-[#293d6b] hover:text-white bg-[#07112b]')}>
                {p === 'blank' ? 'Blank' : p === 'member' ? 'Member' : 'Admin'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#8b9cc8] uppercase tracking-wider">Permissions</label>
            <span className="text-[10px] text-[#c084fc] font-semibold">{perms.length} selected</span>
          </div>
          <div className="space-y-4">
            {PERMISSION_GROUPS.map(g => (
              <div key={g.group}>
                <p className="text-[10px] font-bold text-[#4B5578] uppercase tracking-widest mb-2">{g.group}</p>
                <div className="space-y-1">
                  {g.items.map(item => {
                    const on = perms.includes(item.id);
                    return (
                      <button key={item.id} onClick={() => toggle(item.id)}
                        className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all',
                          on ? 'border-[#8735C9]/50 bg-[#8735C9]/08' : 'border-[#1e2a4a] hover:border-[#293d6b]')}>
                        <div className={cn('w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                          on ? 'bg-[#8735C9] border-[#8735C9]' : 'border-[#293d6b]')}>
                          {on && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-xs font-medium', on ? 'text-white' : 'text-[#8b9cc8]')}>{item.label}</p>
                          <p className="text-[10px] text-[#4B5578]">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
        <Button onClick={() => { if (!name.trim()) { setErr('Role name is required'); return; } onSave(name, perms); }}
          className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold">
          <Shield className="w-4 h-4" />{saveLabel}
        </Button>
        <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
      </div>
    </div>
  );
};

// ─── Create Role Modal ─────────────────────────────────────
const CreateRoleModal = ({ onClose }: { onClose: () => void }) => (
  <CustomModal isOpen onClose={onClose} title="Create Custom Role" description="Define a role with specific permissions." className="sm:max-w-xl">
    <RoleForm
      onSave={(name, perms) => { console.log('[API TODO] POST /api/roles', { name, permissions: perms }); onClose(); }}
      onClose={onClose}
      saveLabel="Create Role"
    />
  </CustomModal>
);

// ─── Edit Role Modal (for custom roles) ───────────────────
const EditCustomRoleModal = ({ role, onClose }: { role: CustomRole; onClose: () => void }) => (
  <CustomModal isOpen onClose={onClose} title={`Edit Role · ${role.name}`} description="Update role name and permissions." className="sm:max-w-xl">
    <RoleForm
      initialName={role.name}
      initialPerms={role.permissions}
      onSave={(name, perms) => { console.log('[API TODO] PATCH /api/roles/', role.id, { name, permissions: perms }); onClose(); }}
      onClose={onClose}
      saveLabel="Save Changes"
    />
  </CustomModal>
);

// ─── Delete Role Confirm Modal ─────────────────────────────
const DeleteRoleModal = ({ role, onClose }: { role: CustomRole; onClose: () => void }) => (
  <CustomModal isOpen onClose={onClose} title="Delete Role" description={`Are you sure you want to delete "${role.name}"?`} className="sm:max-w-sm">
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#07112b] border border-[#1e2a4a] rounded-xl">
        <div className="w-9 h-9 rounded-xl bg-[#8735C9]/15 flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-[#c084fc]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{role.name}</p>
          <p className="text-xs text-[#6b7db3]">{role.permissions.length} permissions</p>
        </div>
      </div>
      <p className="text-xs text-[#6b7db3]">Members assigned this role will fall back to the default Member role. This action cannot be undone.</p>
      <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
        <Button onClick={() => { console.log('[API TODO] DELETE /api/roles/', role.id); onClose(); }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2">
          <Trash2 className="w-4 h-4" />Delete Role
        </Button>
        <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
      </div>
    </div>
  </CustomModal>
);

// ─── Edit Member Role Modal ────────────────────────────────
const EditMemberRoleModal = ({ member, onClose }: { member: Member; onClose: () => void }) => {
  const allRoles = [
    { id: 'admin',  label: 'Admin',  desc: 'Can manage projects, members, automations' },
    { id: 'member', label: 'Member', desc: 'Standard contributor access' },
    ...demoWorkspace.customRoles.map(r => ({ id: r.id, label: r.name, desc: `Custom · ${r.permissions.length} permissions` })),
  ];
  const [role, setRole] = useState(member.role === 'owner' ? 'admin' : member.role);

  return (
    <CustomModal isOpen onClose={onClose} title="Edit Role" description={`Changing role for ${member.user.name}`} className="sm:max-w-sm">
      <div className="space-y-4">
        <div className="overflow-y-auto max-h-[50vh] space-y-1.5">
          {allRoles.map(r => {
            const sel = role === r.id;
            return (
              <button key={r.id} onClick={() => setRole(r.id)}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                  sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]')}>
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', sel ? 'bg-[#8735C9]/20' : 'bg-[#132353]')}>
                  <Shield className={cn('w-3.5 h-3.5', sel ? 'text-[#c084fc]' : 'text-[#6b7db3]')} />
                </div>
                <div className="flex-1">
                  <p className={cn('text-xs font-semibold', sel ? 'text-white' : 'text-[#8b9cc8]')}>{r.label}</p>
                  <p className="text-[10px] text-[#4B5578]">{r.desc}</p>
                </div>
                {sel && <Check className="w-3.5 h-3.5 text-[#c084fc]" />}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
          <Button onClick={() => { console.log('[API TODO] PATCH /api/members/', member.id, { role }); onClose(); }}
            className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold">
            Save Role
          </Button>
          <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Remove Member Modal ───────────────────────────────────
const RemoveMemberModal = ({ member, onClose }: { member: Member; onClose: () => void }) => (
  <CustomModal isOpen onClose={onClose} title="Remove Member" description={`Are you sure you want to remove ${member.user.name}?`} className="sm:max-w-sm">
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#07112b] border border-[#1e2a4a] rounded-xl">
        <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold', grad(member.user.name))}>
          {initials(member.user.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{member.user.name}</p>
          <p className="text-xs text-[#6b7db3]">{member.user.email}</p>
        </div>
      </div>
      <p className="text-xs text-[#6b7db3]">This will revoke their workspace access. This action cannot be undone.</p>
      <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
        <Button onClick={() => { console.log('[API TODO] DELETE /api/members/', member.id); onClose(); }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2">
          <Trash2 className="w-4 h-4" />Remove Member
        </Button>
        <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
      </div>
    </div>
  </CustomModal>
);

// ─── Invite Modal ──────────────────────────────────────────
const InviteModal = ({ onClose }: { onClose: () => void }) => {
  const allRoles = [
    { id: 'admin',  label: 'Admin',  desc: 'Manage projects, members, automations' },
    { id: 'member', label: 'Member', desc: 'Standard contributor access' },
    ...demoWorkspace.customRoles.map(r => ({ id: r.id, label: r.name, desc: `Custom · ${r.permissions.length} permissions` })),
  ];
  const [email, setEmail] = useState('');
  const [role,  setRole]  = useState('member');
  const [err,   setErr]   = useState('');

  return (
    <CustomModal isOpen onClose={onClose} title="Invite Member" description="Send an invitation to join this workspace." className="sm:max-w-md">
      <div className="flex flex-col gap-4">
        <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Email address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
              <input value={email} onChange={e => { setEmail(e.target.value); setErr(''); }}
                type="email" placeholder="colleague@company.com"
                className={cn('w-full bg-[#07112b] border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors',
                  err ? 'border-red-400/50' : 'border-[#1e2a4a] focus:border-[#8735C9]')} />
            </div>
            {err && <p className="text-red-400 text-[11px] mt-1">{err}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">Assign Role</label>
            <div className="space-y-1.5">
              {allRoles.map(r => {
                const sel = role === r.id;
                return (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                      sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]')}>
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', sel ? 'bg-[#8735C9]/20' : 'bg-[#132353]')}>
                      <Shield className={cn('w-3.5 h-3.5', sel ? 'text-[#c084fc]' : 'text-[#6b7db3]')} />
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-xs font-semibold', sel ? 'text-white' : 'text-[#8b9cc8]')}>{r.label}</p>
                      <p className="text-[10px] text-[#4B5578]">{r.desc}</p>
                    </div>
                    {sel && <Check className="w-3.5 h-3.5 text-[#c084fc]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
          <Button onClick={() => {
            if (!email.trim() || !email.includes('@')) { setErr('Enter a valid email'); return; }
            console.log('[API TODO] POST /api/members/invite', { email, role }); onClose();
          }} className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold">
            <Mail className="w-4 h-4" />Send Invitation
          </Button>
          <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Revoke Invite Confirm Modal ───────────────────────────
const RevokeInviteModal = ({ invite, onClose }: { invite: Invite; onClose: () => void }) => (
  <CustomModal isOpen onClose={onClose} title="Revoke Invite" description={`Revoke the invitation sent to ${invite.email}?`} className="sm:max-w-sm">
    <div className="space-y-4">
      <p className="text-xs text-[#6b7db3]">The recipient will no longer be able to use this invite link.</p>
      <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
        <Button onClick={() => { console.log('[API TODO] DELETE /api/invites/', invite.id); onClose(); }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2">
          <X className="w-4 h-4" />Revoke Invite
        </Button>
        <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
      </div>
    </div>
  </CustomModal>
);

// ─── Main MembersView ──────────────────────────────────────
export const MembersView = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleOpen,   setRoleOpen]   = useState(false);
  const [activeTab,  setActiveTab]  = useState<'members'|'roles'|'invites'>('members');

  // DataTable state — members
  const [memberSearch,  setMemberSearch]  = useState('');
  const [memberPage,    setMemberPage]    = useState(0);
  const [memberSorting, setMemberSorting] = useState<SortingState>([]);

  // DataTable state — invites
  const [inviteSearch,  setInviteSearch]  = useState('');
  const [invitePage,    setInvitePage]    = useState(0);
  const [inviteSorting, setInviteSorting] = useState<SortingState>([]);

  // Action modal state
  const [editMember,    setEditMember]    = useState<Member | null>(null);
  const [removeMember,  setRemoveMember]  = useState<Member | null>(null);
  const [editRole,      setEditRole]      = useState<CustomRole | null>(null);
  const [deleteRole,    setDeleteRole]    = useState<CustomRole | null>(null);
  const [revokeInvite,  setRevokeInvite]  = useState<Invite | null>(null);

  const PAGE = 10;

  // Members
  const filteredMembers = useMemo(() =>
    demoMembers.filter(m =>
      !memberSearch ||
      m.user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.user.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase())
    ), [memberSearch]);
  const pagedMembers = useMemo(() =>
    filteredMembers.slice(memberPage * PAGE, (memberPage + 1) * PAGE), [filteredMembers, memberPage]);

  // Invites
  const filteredInvites = useMemo(() =>
    demoInvites.filter(inv =>
      !inviteSearch ||
      inv.email.toLowerCase().includes(inviteSearch.toLowerCase()) ||
      inv.role.toLowerCase().includes(inviteSearch.toLowerCase()) ||
      inv.status.toLowerCase().includes(inviteSearch.toLowerCase())
    ), [inviteSearch]);
  const pagedInvites = useMemo(() =>
    filteredInvites.slice(invitePage * PAGE, (invitePage + 1) * PAGE), [filteredInvites, invitePage]);

  const memberCols: ColumnDef<Member>[] = [
    {
      accessorKey: 'user.name',
      header: 'Member',
      cell: ({ row }) => {
        const m = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', grad(m.user.name))}>
              {initials(m.user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{m.user.name}</p>
              <p className="text-[11px] text-[#6b7db3] truncate">{m.user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const m = row.original;
        const badge = ROLE_BADGE[m.role] ?? ROLE_BADGE.member;
        const Icon  = badge.icon;
        return (
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border', badge.bg)}
            style={{ color: badge.color }}>
            <Icon className="w-2.5 h-2.5" />{m.role}
          </span>
        );
      },
    },
    {
      accessorKey: 'joinedAt',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-xs text-[#6b7db3]">
          {new Date(row.original.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const m = row.original;
        if (m.role === 'owner') return <span className="text-[10px] text-[#4B5578]">–</span>;
        return (
          <div className="flex items-center gap-1">
            <button onClick={() => setEditMember(m)}
              className="flex items-center gap-1 text-[11px] text-[#6b7db3] hover:text-[#c084fc] px-2 py-1 rounded-lg hover:bg-[#1e2a4a] transition-all">
              <Edit3 className="w-3 h-3" />Edit Role
            </button>
            <button onClick={() => setRemoveMember(m)}
              className="flex items-center gap-1 text-[11px] text-red-400/60 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-400/08 transition-all">
              <Trash2 className="w-3 h-3" />Remove
            </button>
          </div>
        );
      },
    },
  ];

  const inviteCols: ColumnDef<Invite>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1e2a4a] border border-[#293d6b] flex items-center justify-center flex-shrink-0">
            <Mail className="w-3.5 h-3.5 text-[#6b7db3]" />
          </div>
          <p className="text-sm text-white font-medium">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const roleId = row.original.role;
        const custom = demoWorkspace.customRoles.find(r => r.id === roleId);
        const label  = custom ? custom.name : roleId;
        const badge  = ROLE_BADGE[roleId] ?? ROLE_BADGE.member;
        const Icon   = badge.icon;
        return (
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border', badge.bg)}
            style={{ color: badge.color }}>
            <Icon className="w-2.5 h-2.5" />{label}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s = STATUS_BADGE[row.original.status];
        const Icon = s.icon;
        return (
          <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border', s.bg)}
            style={{ color: s.color }}>
            <Icon className="w-2.5 h-2.5" />{s.label}
          </span>
        );
      },
    },
    {
      accessorKey: 'invitedBy',
      header: 'Invited By',
      cell: ({ row }) => <span className="text-xs text-[#6b7db3]">{row.original.invitedBy}</span>,
    },
    {
      accessorKey: 'sentAt',
      header: 'Sent',
      cell: ({ row }) => (
        <span className="text-xs text-[#6b7db3]">
          {new Date(row.original.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const inv = row.original;
        if (inv.status !== 'pending') return <span className="text-[10px] text-[#4B5578]">–</span>;
        return (
          <div className="flex items-center gap-1">
            <button onClick={() => console.log('[API TODO] POST /api/invites/', inv.id, '/resend')}
              className="flex items-center gap-1 text-[11px] text-[#6b7db3] hover:text-[#c084fc] px-2 py-1 rounded-lg hover:bg-[#1e2a4a] transition-all">
              <RefreshCw className="w-3 h-3" />Resend
            </button>
            <button onClick={() => setRevokeInvite(inv)}
              className="flex items-center gap-1 text-[11px] text-red-400/60 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-400/08 transition-all">
              <X className="w-3 h-3" />Revoke
            </button>
          </div>
        );
      },
    },
  ];

  const pendingCount = demoInvites.filter(i => i.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Members</h1>
          <p className="text-sm text-[#6b7db3] mt-0.5">{demoMembers.length} members · {demoWorkspace.customRoles.length} custom role{demoWorkspace.customRoles.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setRoleOpen(true)}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d] gap-2 text-sm h-9">
            <Shield className="w-4 h-4" />Manage Roles
          </Button>
          <Button onClick={() => setInviteOpen(true)}
            className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 text-sm h-9 shadow-[0_2px_12px_rgba(135,53,201,0.35)]">
            <UserPlus className="w-4 h-4" />Invite Member
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Members',   value: demoMembers.length,                                 color: '#8735C9', icon: Users  },
          { label: 'Owners',          value: demoMembers.filter(m => m.role === 'owner').length, color: '#f59e0b', icon: Crown  },
          { label: 'Admins',          value: demoMembers.filter(m => m.role === 'admin').length, color: '#60a5fa', icon: Shield },
          { label: 'Pending Invites', value: pendingCount,                                       color: '#c084fc', icon: Mail   },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#0C1635] border border-[#1e2a4a] rounded-xl">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}15` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-base font-black text-white">{s.value}</p>
              <p className="text-[10px] text-[#6b7db3]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#0C1635] border border-[#1e2a4a] rounded-xl p-1 w-fit">
        {([
          ['members', 'Members'],
          ['invites', pendingCount > 0 ? `Invites (${pendingCount})` : 'Invites'],
          ['roles',   'Custom Roles'],
        ] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn('text-xs font-semibold px-4 py-1.5 rounded-lg transition-all',
              activeTab === tab ? 'bg-[#8735C9] text-white' : 'text-[#6b7db3] hover:text-white')}>
            {label}
          </button>
        ))}
      </div>

      {/* Members tab */}
      {activeTab === 'members' && (
        <DataTable
          columns={memberCols}
          data={pagedMembers}
          totalCount={filteredMembers.length}
          pageIndex={memberPage}
          pageSize={PAGE}
          search={memberSearch}
          sorting={memberSorting}
          onPageChange={setMemberPage}
          onSearchChange={v => { setMemberSearch(v); setMemberPage(0); }}
          onSortingChange={setMemberSorting}
          renderFilters={() => (
            <button onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#8735C9] hover:text-[#c084fc] font-medium border border-[#8735C9]/30 hover:border-[#8735C9]/60 px-3 py-2 rounded-xl transition-all">
              <Plus className="w-3.5 h-3.5" />Invite Member
            </button>
          )}
        />
      )}

      {/* Invites tab */}
      {activeTab === 'invites' && (
        <DataTable
          columns={inviteCols}
          data={pagedInvites}
          totalCount={filteredInvites.length}
          pageIndex={invitePage}
          pageSize={PAGE}
          search={inviteSearch}
          sorting={inviteSorting}
          onPageChange={setInvitePage}
          onSearchChange={v => { setInviteSearch(v); setInvitePage(0); }}
          onSortingChange={setInviteSorting}
          renderFilters={() => (
            <button onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#8735C9] hover:text-[#c084fc] font-medium border border-[#8735C9]/30 hover:border-[#8735C9]/60 px-3 py-2 rounded-xl transition-all">
              <UserPlus className="w-3.5 h-3.5" />New Invite
            </button>
          )}
        />
      )}

      {/* Roles tab */}
      {activeTab === 'roles' && (
        <div className="overflow-y-auto max-h-[calc(100vh-320px)] space-y-5 pr-1">
          <p className="text-[10px] font-bold text-[#4B5578] uppercase tracking-widest">Built-in Roles</p>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { id: 'owner',  label: 'Owner',  desc: 'Full control.', color: '#f59e0b', icon: Crown,  perms: 'All permissions' },
              { id: 'admin',  label: 'Admin',  desc: 'Manage projects, members, automations.', color: '#60a5fa', icon: Shield, perms: `${ROLE_PRESETS.admin.length} permissions` },
              { id: 'member', label: 'Member', desc: 'Standard contributor.', color: '#8b9cc8', icon: Users,  perms: `${ROLE_PRESETS.member.length} permissions` },
            ].map(r => {
              const Icon = r.icon;
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
                  <p className="text-[10px] text-[#8b9cc8]">{demoMembers.filter(m => m.role === r.id).length} member{demoMembers.filter(m => m.role === r.id).length !== 1 ? 's' : ''}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#4B5578] uppercase tracking-widest">Custom Roles</p>
            <button onClick={() => setRoleOpen(true)}
              className="flex items-center gap-1 text-xs text-[#8735C9] hover:text-[#c084fc] font-medium transition-colors">
              <Plus className="w-3 h-3" />New custom role
            </button>
          </div>

          {demoWorkspace.customRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-[#0C1635] border border-dashed border-[#1e2a4a] rounded-2xl">
              <Shield className="w-8 h-8 text-[#4B5578] mb-3" />
              <p className="text-sm font-semibold text-white mb-1">No custom roles yet</p>
              <p className="text-xs text-[#4B5578] mb-4">Create roles with specific permission sets.</p>
              <button onClick={() => setRoleOpen(true)}
                className="text-xs text-[#8735C9] hover:text-[#c084fc] font-medium border border-[#8735C9]/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
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
                      <button onClick={() => setEditRole(r)}
                        className="w-6 h-6 rounded hover:bg-[#1e2a4a] flex items-center justify-center">
                        <Edit3 className="w-3 h-3 text-[#6b7db3]" />
                      </button>
                      <button onClick={() => setDeleteRole(r)}
                        className="w-6 h-6 rounded hover:bg-red-500/10 flex items-center justify-center">
                        <Trash2 className="w-3 h-3 text-red-400/60" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.slice(0, 4).map(p => (
                      <span key={p} className="text-[9px] px-1.5 py-0.5 bg-[#07112b] border border-[#1e2a4a] rounded text-[#8b9cc8]">{p}</span>
                    ))}
                    {r.permissions.length > 4 && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#07112b] border border-[#1e2a4a] rounded text-[#4B5578]">+{r.permissions.length - 4}</span>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => setRoleOpen(true)}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-[#0C1635] border-2 border-dashed border-[#1e2a4a] hover:border-[#8735C9] rounded-xl transition-all group min-h-[100px]">
                <Plus className="w-5 h-5 text-[#4B5578] group-hover:text-[#8735C9] transition-colors" />
                <span className="text-xs text-[#6b7db3] group-hover:text-white transition-colors">New role</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {inviteOpen   && <InviteModal          onClose={() => setInviteOpen(false)}    />}
      {roleOpen     && <CreateRoleModal       onClose={() => setRoleOpen(false)}      />}
      {editMember   && <EditMemberRoleModal   member={editMember}   onClose={() => setEditMember(null)}   />}
      {removeMember && <RemoveMemberModal     member={removeMember} onClose={() => setRemoveMember(null)} />}
      {editRole     && <EditCustomRoleModal   role={editRole}       onClose={() => setEditRole(null)}      />}
      {deleteRole   && <DeleteRoleModal       role={deleteRole}     onClose={() => setDeleteRole(null)}    />}
      {revokeInvite && <RevokeInviteModal     invite={revokeInvite} onClose={() => setRevokeInvite(null)} />}
    </div>
  );
};
