'use client';

import React, { useState } from 'react';
import { UserPlus, Shield, Users, Crown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { demoMembers, demoInvites, demoWorkspace } from '../../../data/demoData';
import { cn } from '@/lib/utils';
import { MembersTab } from './members/MembersTab';
import { InvitesTab } from './members/InvitesTab';
import { RolesTab } from './members/RolesTab';
import { InviteModal } from './members/modals/InviteModal';

type ActiveTab = 'members' | 'invites' | 'roles';

const STATS = (pendingCount: number) => [
  { label: 'Total Members',   value: demoMembers.length,                                 color: '#8735C9', icon: Users  },
  { label: 'Owners',          value: demoMembers.filter(m => m.role === 'owner').length, color: '#f59e0b', icon: Crown  },
  { label: 'Admins',          value: demoMembers.filter(m => m.role === 'admin').length, color: '#60a5fa', icon: Shield },
  { label: 'Pending Invites', value: pendingCount,                                       color: '#c084fc', icon: Mail   },
];

export const MembersView = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activeTab,  setActiveTab]  = useState<ActiveTab>('members');

  const pendingCount = demoInvites.filter(i => i.status === 'pending').length;

  const TABS: [ActiveTab, string][] = [
    ['members', 'Members'],
    ['invites', pendingCount > 0 ? `Invites (${pendingCount})` : 'Invites'],
    ['roles',   'Custom Roles'],
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Members</h1>
          <p className="text-sm text-[#6b7db3] mt-0.5">
            {demoMembers.length} members · {demoWorkspace.customRoles.length} custom role{demoWorkspace.customRoles.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab('roles')}
            className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d] gap-2 text-sm h-9"
          >
            <Shield className="w-4 h-4" />Manage Roles
          </Button>
          <Button
            onClick={() => setInviteOpen(true)}
            className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 text-sm h-9 shadow-[0_2px_12px_rgba(135,53,201,0.35)]"
          >
            <UserPlus className="w-4 h-4" />Invite Member
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS(pendingCount).map((s, i) => (
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

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-[#0C1635] border border-[#1e2a4a] rounded-xl p-1 w-fit">
        {TABS.map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'text-xs font-semibold px-4 py-1.5 rounded-lg transition-all',
              activeTab === tab ? 'bg-[#8735C9] text-white' : 'text-[#6b7db3] hover:text-white'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'members' && <MembersTab onInviteOpen={() => setInviteOpen(true)} />}
      {activeTab === 'invites' && <InvitesTab onInviteOpen={() => setInviteOpen(true)} />}
      {activeTab === 'roles'   && <RolesTab   onCreateRole={() => {}}                  />}

      {/* Global invite modal */}
      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
    </div>
  );
};
