'use client';

import React, { useMemo, useState } from 'react';
import { Mail, RefreshCw, X, UserPlus } from 'lucide-react';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/table/DataTable';
import { demoInvites, demoWorkspace, type Invite } from '../../../../data/demoData';
import { cn } from '@/lib/utils';
import { ROLE_BADGE, STATUS_BADGE } from './shared';
import { RevokeInviteModal } from './modals/RevokeInviteModal';

const PAGE = 10;

interface InvitesTabProps {
  onInviteOpen: () => void;
}

export const InvitesTab = ({ onInviteOpen }: InvitesTabProps) => {
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [revokeInvite, setRevokeInvite] = useState<Invite | null>(null);

  const filtered = useMemo(() =>
    demoInvites.filter(inv =>
      !search ||
      inv.email.toLowerCase().includes(search.toLowerCase()) ||
      inv.role.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const paged = useMemo(() =>
    filtered.slice(page * PAGE, (page + 1) * PAGE), [filtered, page]);

  const columns: ColumnDef<Invite>[] = [
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
          <span
            className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border', badge.bg)}
            style={{ color: badge.color }}
          >
            <Icon className="w-2.5 h-2.5" />{label}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const s    = STATUS_BADGE[row.original.status];
        const Icon = s.icon;
        return (
          <span
            className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border', s.bg)}
            style={{ color: s.color }}
          >
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
        if (inv.status !== 'pending') {return <span className="text-[10px] text-[#4B5578]">–</span>;}
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {}}
              className="flex items-center gap-1 text-[11px] text-[#6b7db3] hover:text-[#c084fc] px-2 py-1 rounded-lg hover:bg-[#1e2a4a] transition-all"
            >
              <RefreshCw className="w-3 h-3" />Resend
            </button>
            <button
              onClick={() => setRevokeInvite(inv)}
              className="flex items-center gap-1 text-[11px] text-red-400/60 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-400/08 transition-all"
            >
              <X className="w-3 h-3" />Revoke
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={paged}
        totalCount={filtered.length}
        pageIndex={page}
        pageSize={PAGE}
        search={search}
        sorting={sorting}
        onPageChange={setPage}
        onSearchChange={v => { setSearch(v); setPage(0); }}
        onSortingChange={setSorting}
        renderFilters={() => (
          <button
            onClick={onInviteOpen}
            className="flex items-center gap-1.5 text-xs text-[#8735C9] hover:text-[#c084fc] font-medium border border-[#8735C9]/30 hover:border-[#8735C9]/60 px-3 py-2 rounded-xl transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />New Invite
          </button>
        )}
      />

      {revokeInvite && (
        <RevokeInviteModal invite={revokeInvite} onClose={() => setRevokeInvite(null)} />
      )}
    </>
  );
};
