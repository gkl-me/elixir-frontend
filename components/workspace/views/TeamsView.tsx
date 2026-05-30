'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Plus, Search, ChevronLeft, Check,
  Trash2, X, UserPlus, ArrowRight, Settings,
  Crown, Shield
} from 'lucide-react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import { DataTable } from '@/components/table/DataTable';
import { demoTeams, demoMembers } from '../../../data/demoData';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────
type TeamType = typeof demoTeams[0];

// ─── Helpers ──────────────────────────────────────────────
const initials = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase();
const GRADS = [
  'from-[#8735C9] to-[#6a29a0]',
  'from-[#3b82f6] to-[#1d4ed8]',
  'from-[#10b981] to-[#059669]',
  'from-[#f59e0b] to-[#d97706]',
];
const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

const ROLE_BADGE: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  owner:  { color: '#f59e0b', bg: 'bg-amber-500/10 border-amber-500/30', icon: Crown  },
  admin:  { color: '#60a5fa', bg: 'bg-blue-500/10  border-blue-500/30',  icon: Shield },
  member: { color: '#8b9cc8', bg: 'bg-[#1e2a4a]    border-[#293d6b]',    icon: Users  },
};

// ─── Create Team Modal ─────────────────────────────────────
const CreateTeamModal = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState({ name: '', description: '', memberIds: [] as string[] });
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');

  const filteredMembers = demoMembers.filter(m =>
    !q || m.user.name.toLowerCase().includes(q.toLowerCase()) || m.user.email.toLowerCase().includes(q.toLowerCase())
  );
  const toggle = (id: string) => setForm(f => ({
    ...f, memberIds: f.memberIds.includes(id) ? f.memberIds.filter(m => m !== id) : [...f.memberIds, id]
  }));

  return (
    <CustomModal isOpen onClose={onClose} title="Create Team" description="Organise members into a focused team." className="sm:max-w-lg">
      <div className="flex flex-col gap-4">
        <div className="overflow-y-auto max-h-[60vh] pr-1 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Name *</label>
            <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErr(''); }}
              placeholder="e.g. Frontend Guild"
              className={cn('w-full bg-[#07112b] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors',
                err ? 'border-red-400/50' : 'border-[#1e2a4a] focus:border-[#8735C9]')} />
            {err && <p className="text-red-400 text-[11px] mt-1">{err}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">
              Description <span className="text-[#4B5578] normal-case font-normal">(optional)</span>
            </label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What does this team work on?" rows={2}
              className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">
              Add Members <span className="text-[#4B5578] normal-case font-normal">(optional)</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search members…"
                className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#4B5578] outline-none transition-colors" />
            </div>
            <div className="overflow-y-auto max-h-[180px] space-y-1 pr-0.5">
              {filteredMembers.map(m => {
                const sel = form.memberIds.includes(m.id);
                return (
                  <button key={m.id} onClick={() => toggle(m.id)}
                    className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all',
                      sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]')}>
                    <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0', grad(m.user.name))}>
                      {initials(m.user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium', sel ? 'text-white' : 'text-[#8b9cc8]')}>{m.user.name}</p>
                      <p className="text-[10px] text-[#4B5578] truncate">{m.user.email}</p>
                    </div>
                    <div className={cn('w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                      sel ? 'bg-[#8735C9] border-[#8735C9]' : 'border-[#293d6b]')}>
                      {sel && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {form.memberIds.length > 0 && <p className="text-[11px] text-[#c084fc] mt-2">{form.memberIds.length} selected</p>}
          </div>
        </div>
        <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
          <Button onClick={() => { if (!form.name.trim()) { setErr('Team name is required'); return; } onClose(); }}
            className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold">
            <Users className="w-4 h-4" />Create Team
          </Button>
          <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Add Members Modal (reusable) ─────────────────────────
const AddMembersModal = ({
  excludeIds,
  onAdd,
  onClose,
}: {
  excludeIds: string[];
  onAdd: (id: string) => void;
  onClose: () => void;
}) => {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const available = demoMembers
    .filter(m => !excludeIds.includes(m.id))
    .filter(m => !q || m.user.name.toLowerCase().includes(q.toLowerCase()) || m.user.email.toLowerCase().includes(q.toLowerCase()));

  const toggle = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleAdd = () => {
    selected.forEach(id => onAdd(id));
    onClose();
  };

  return (
    <CustomModal isOpen onClose={onClose} title="Add Members" description="Select workspace members to add to this team." className="sm:max-w-lg">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search members…"
            className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors" />
        </div>

        {/* Member checklist — scrollable */}
        <div className="overflow-y-auto max-h-[50vh] space-y-1.5 pr-0.5">
          {available.length === 0 && (
            <p className="text-[11px] text-[#4B5578] text-center py-6">
              {demoMembers.filter(m => !excludeIds.includes(m.id)).length === 0
                ? 'All workspace members are already in this team.'
                : 'No members match your search.'}
            </p>
          )}
          {available.map(m => {
            const sel = selected.includes(m.id);
            const badge = ROLE_BADGE[m.role] ?? ROLE_BADGE.member;
            const Icon = badge.icon;
            return (
              <button key={m.id} onClick={() => toggle(m.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                  sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]'
                )}>
                <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0', grad(m.user.name))}>
                  {initials(m.user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', sel ? 'text-white' : 'text-[#8b9cc8]')}>{m.user.name}</p>
                  <p className="text-[11px] text-[#4B5578] truncate">{m.user.email}</p>
                </div>
                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize mr-1', badge.bg)}
                  style={{ color: badge.color }}>
                  <Icon className="w-2.5 h-2.5" />{m.role}
                </span>
                <div className={cn('w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                  sel ? 'bg-[#8735C9] border-[#8735C9]' : 'border-[#293d6b]')}>
                  {sel && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pinned footer */}
        <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
          <Button
            onClick={handleAdd}
            disabled={selected.length === 0}
            className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold disabled:opacity-40">
            <UserPlus className="w-4 h-4" />
            Add {selected.length > 0 ? `${selected.length} Member${selected.length > 1 ? 's' : ''}` : 'Members'}
          </Button>
          <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
        </div>
      </div>
    </CustomModal>
  );
};

// ─── Member cell renderer (shared) ───────────────────────
type MemberRow = typeof demoMembers[0];

const MemberCell = ({ m }: { m: MemberRow }) => {
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
};

const RoleCell = ({ m }: { m: MemberRow }) => {
  const badge = ROLE_BADGE[m.role] ?? ROLE_BADGE.member;
  const Icon  = badge.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border', badge.bg)}
      style={{ color: badge.color }}>
      <Icon className="w-2.5 h-2.5" />{m.role}
    </span>
  );
};

// ─── Remove Team Member Confirm Modal ─────────────────────
const RemoveTeamMemberModal = ({
  member, teamName, onConfirm, onClose,
}: {
  member: MemberRow; teamName: string; onConfirm: () => void; onClose: () => void;
}) => (
  <CustomModal isOpen onClose={onClose} title="Remove from Team" description={`Remove ${member.user.name} from ${teamName}?`} className="sm:max-w-sm">
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
      <p className="text-xs text-[#6b7db3]">They will lose access to all team resources but remain a workspace member.</p>
      <div className="flex gap-2 pt-1 border-t border-[#1e2a4a]">
        <Button onClick={() => { onConfirm(); onClose(); }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2">
          <X className="w-4 h-4" />Remove from Team
        </Button>
        <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">Cancel</Button>
      </div>
    </div>
  </CustomModal>
);

// ─── Team Manage Page ──────────────────────────────────────
const TeamManagePage = ({ team, onBack }: { team: TeamType; onBack: () => void }) => {
  const [memberIds,    setMemberIds]    = useState([...team.memberIds]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addModalOpen,  setAddModalOpen]  = useState(false);
  const [removeTarget,  setRemoveTarget]  = useState<MemberRow | null>(null);

  const PAGE = 5;

  const currentMembers = useMemo(() =>
    demoMembers.filter(m => memberIds.includes(m.id)), [memberIds]);


  // Filtered + paginated — current members
  const [memberSearch, setMemberSearch] = useState('');
  const [memberPage,   setMemberPage]   = useState(0);
  const [memberSort,   setMemberSort]   = useState<SortingState>([]);

  const filteredCurrent = useMemo(() =>
    currentMembers.filter(m =>
      !memberSearch ||
      m.user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.user.email.toLowerCase().includes(memberSearch.toLowerCase())
    ), [currentMembers, memberSearch]);
  const pagedCurrent = useMemo(() =>
    filteredCurrent.slice(memberPage * PAGE, (memberPage + 1) * PAGE),
    [filteredCurrent, memberPage]);

  const removeMember = (id: string) => setMemberIds(ids => ids.filter(m => m !== id));

  // Columns — current members
  const currentCols: ColumnDef<MemberRow>[] = [
    {
      accessorKey: 'user.name',
      header: 'Member',
      cell: ({ row }) => <MemberCell m={row.original} />,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => <RoleCell m={row.original} />,
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const m = row.original;
        return (
          <button onClick={() => setRemoveTarget(m)}
            className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-400/08 border border-transparent hover:border-red-400/20 transition-all">
            <X className="w-3 h-3" />Remove
          </button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      {/* Back header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#6b7db3] hover:text-white font-medium transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Teams
        </button>
        <span className="text-[#1e2a4a]">/</span>
        <span className="text-sm font-bold text-white">{team.name}</span>
      </div>

      {/* Team header card */}
      <div className="flex items-center gap-4 p-6 bg-[#0C1635] border border-[#1e2a4a] rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] flex items-center justify-center shadow-[0_4px_16px_rgba(135,53,201,0.35)]">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-black text-white">{team.name}</h1>
          <p className="text-sm text-[#6b7db3] mt-0.5">{currentMembers.length} member{currentMembers.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex -space-x-2">
          {currentMembers.slice(0, 4).map((m, i) => (
            <div key={m.id} title={m.user.name}
              className={cn('w-8 h-8 rounded-full border-2 border-[#0C1635] bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold', grad(m.user.name))}
              style={{ zIndex: 10 - i }}>
              {initials(m.user.name)}
            </div>
          ))}
          {currentMembers.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-[#0C1635] bg-[#132353] flex items-center justify-center z-0">
              <span className="text-[9px] text-[#8b9cc8] font-bold">+{currentMembers.length - 4}</span>
            </div>
          )}
        </div>
      </div>

      {/* Members section */}
      <div className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a4a]">
          <div>
            <h2 className="text-sm font-bold text-white">Members</h2>
            <p className="text-[11px] text-[#6b7db3] mt-0.5">{currentMembers.length} in this team</p>
          </div>
          <Button
            onClick={() => setAddModalOpen(true)}
            size="sm"
            className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-1.5 text-xs h-8 font-semibold">
            <UserPlus className="w-3.5 h-3.5" />Add Member
          </Button>
        </div>

        {/* Current members DataTable */}
        <div className="px-5 py-4">
          <DataTable
            columns={currentCols}
            data={pagedCurrent}
            totalCount={filteredCurrent.length}
            pageIndex={memberPage}
            pageSize={PAGE}
            search={memberSearch}
            sorting={memberSort}
            onPageChange={setMemberPage}
            onSearchChange={v => { setMemberSearch(v); setMemberPage(0); }}
            onSortingChange={setMemberSort}
          />
        </div>

        {/* Save footer */}
        <div className="px-5 py-4 border-t border-[#1e2a4a] flex items-center justify-between bg-[#07112b]/30">
          <p className="text-[11px] text-[#4B5578]">Changes will be saved when you click Save.</p>
          <Button onClick={() => { onBack(); }}
            size="sm" className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-1.5 text-xs h-8 font-semibold">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Add Members modal */}
      {addModalOpen && (
        <AddMembersModal
          excludeIds={memberIds}
          onAdd={id => setMemberIds(ids => [...ids, id])}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Remove confirm modal */}
      {removeTarget && (
        <RemoveTeamMemberModal
          member={removeTarget}
          teamName={team.name}
          onConfirm={() => removeMember(removeTarget.id)}
          onClose={() => setRemoveTarget(null)}
        />
      )}

      {/* Danger zone */}
      <div className="bg-[#0C1635] border border-red-500/20 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/10">
          <h2 className="text-sm font-bold text-red-400">Danger Zone</h2>
          <p className="text-[11px] text-[#6b7db3] mt-0.5">Irreversible actions for this team.</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white">Delete this team</p>
            <p className="text-[11px] text-[#6b7db3] mt-0.5">Permanently deletes the team. Members will not be removed from the workspace.</p>
          </div>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 border border-red-400/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ml-4">
              <Trash2 className="w-3.5 h-3.5" />Delete Team
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button onClick={() => { onBack(); }}
                className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors">
                Confirm Delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-[#6b7db3] hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Team Card (simplified) ────────────────────────────────
const TeamCard = ({ team, onManage }: { team: TeamType; onManage: () => void }) => {
  const members = demoMembers.filter(m => team.memberIds.includes(m.id));
  return (
    <div className="group bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden hover:border-[#293d6b] transition-all duration-200 flex flex-col">
      <div className="h-0.5 w-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] flex items-center justify-center shadow-[0_2px_8px_rgba(135,53,201,0.3)]">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-[#c084fc] transition-colors">{team.name}</p>
              <p className="text-[10px] text-[#4B5578] mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Avatar stack */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m, i) => (
              <div key={m.id} title={m.user.name}
                className={cn('w-9 h-9 rounded-full border-2 border-[#0C1635] bg-gradient-to-br flex items-center justify-center text-white text-[10px] font-bold', grad(m.user.name))}
                style={{ zIndex: 10 - i }}>
                {initials(m.user.name)}
              </div>
            ))}
            {members.length > 5 && (
              <div className="w-9 h-9 rounded-full border-2 border-[#0C1635] bg-[#132353] flex items-center justify-center z-0">
                <span className="text-[9px] text-[#8b9cc8] font-bold">+{members.length - 5}</span>
              </div>
            )}
          </div>
          {members.length === 0 && (
            <p className="text-[11px] text-[#4B5578] italic">No members yet</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#1e2a4a]">
        <button onClick={onManage}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-[#8b9cc8] hover:text-white hover:bg-[#1e2a4a] py-1.5 rounded-lg transition-all group/btn">
          <Settings className="w-3.5 h-3.5 text-[#8735C9] group-hover/btn:text-[#c084fc] transition-colors" />
          Manage Team
          <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
};

// ─── Main ──────────────────────────────────────────────────
export const TeamsView = () => {
  const [createOpen,   setCreateOpen]   = useState(false);
  const [managingTeam, setManagingTeam] = useState<TeamType | null>(null);
  const [search, setSearch] = useState('');

  if (managingTeam) {
    return <TeamManagePage team={managingTeam} onBack={() => setManagingTeam(null)} />;
  }

  const filtered = demoTeams.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalMembers = new Set(demoTeams.flatMap(t => t.memberIds)).size;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Teams</h1>
          <p className="text-sm text-[#6b7db3] mt-0.5">
            {demoTeams.length} team{demoTeams.length !== 1 ? 's' : ''} · {totalMembers} member{totalMembers !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}
          className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 text-sm h-9 shadow-[0_2px_12px_rgba(135,53,201,0.35)]">
          <Plus className="w-4 h-4" />Create Team
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams…"
          className="w-full bg-[#0C1635] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors" />
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(team => (
          <TeamCard key={team.id} team={team} onManage={() => setManagingTeam(team)} />
        ))}
        <button onClick={() => setCreateOpen(true)}
          className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0C1635] border-2 border-dashed border-[#1e2a4a] hover:border-[#8735C9] rounded-2xl transition-all group min-h-[160px]">
          <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[#1e2a4a] group-hover:border-[#8735C9] flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-[#4B5578] group-hover:text-[#8735C9]" />
          </div>
          <span className="text-xs font-medium text-[#6b7db3] group-hover:text-white transition-colors">New team</span>
        </button>
      </div>

      {createOpen && <CreateTeamModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
};
