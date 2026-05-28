'use client';

import React from 'react';
import { FolderKanban, Users, HardDrive } from 'lucide-react';
import { demoWorkspace, demoSubscriptions } from '../../../../data/demoData';
import { Section } from './shared';
import { cn } from '@/lib/utils';

// ─── Usage Meter ──────────────────────────────────────────
const UsageMeter = ({
  label,
  used,
  limit,
  unit = '',
  icon: Icon,
  color = '#8735C9',
}: {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  icon: React.ElementType;
  color?: string;
}) => {
  const pct = limit === -1 ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const warn = pct >= 80;
  const barColor = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : color;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-sm font-medium text-[#c9d3ed]">{label}</span>
        </div>
        <span className={cn('text-xs font-semibold', warn ? 'text-amber-400' : 'text-[#6b7db3]')}>
          {limit === -1 ? `${used} / ∞` : `${used} / ${limit}${unit}`}
        </span>
      </div>
      <div className="h-2 bg-[#07112b] rounded-full overflow-hidden">
        {limit !== -1 && (
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        )}
        {limit === -1 && (
          <div className="h-full rounded-full bg-emerald-500/40" style={{ width: '100%' }} />
        )}
      </div>
      {warn && limit !== -1 && (
        <p className="text-[10px] text-amber-400">⚠ Approaching limit — consider upgrading</p>
      )}
    </div>
  );
};

// ─── UsageTab ─────────────────────────────────────────────
export const UsageTab = () => {
  const currentPlan =
    demoSubscriptions.find((s) => s.id === demoWorkspace.subscriptionPlan) ??
    demoSubscriptions[1];

  const seatsUsed = demoWorkspace.members.length;
  const projectsUsed = 2;
  const teamsUsed = 2;
  const storageUsed = 52428800; // ~50 MB demo

  return (
    <div className="space-y-6">
      <Section
        title="Usage & Limits"
        description="Seats = active members who can log in and collaborate. Each person using the workspace counts as one seat."
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <UsageMeter
            label="Projects"
            used={projectsUsed}
            limit={currentPlan.limits.projects}
            icon={FolderKanban}
            color="#8735C9"
          />
          <UsageMeter
            label="Members (Seats)"
            used={seatsUsed}
            limit={currentPlan.limits.members}
            icon={Users}
            color="#60a5fa"
          />
          <UsageMeter
            label="Teams"
            used={teamsUsed}
            limit={currentPlan.limits.teams}
            icon={Users}
            color="#34d399"
          />
          <UsageMeter
            label="Storage"
            used={storageUsed / 1048576}
            limit={currentPlan.limits.storageBytes / 1048576}
            icon={HardDrive}
            color="#f59e0b"
            unit=" MB"
          />
        </div>
        <p className="text-xs text-[#4B5578] mt-4 pt-4 border-t border-[#1e2a4a]">
          💡{' '}
          <strong className="text-[#6b7db3]">What is a seat?</strong> A seat is one named user
          in your workspace. If you have 3 members (Alice, Bob, Charlie), you&apos;re using 3
          seats. Removing a member frees a seat immediately.
        </p>
      </Section>

      <Section title="Custom Roles" description="Manage custom roles available in your plan.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#c9d3ed]">Custom Roles Used</p>
            <p className="text-2xl font-black text-white mt-1">
              {demoWorkspace.customRoles.length}{' '}
              <span className="text-sm font-normal text-[#6b7db3]">
                /{' '}
                {currentPlan.limits.customRoles === -1
                  ? '∞'
                  : currentPlan.limits.customRoles}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6b7db3]">Plan: {currentPlan.name}</p>
            <p className="text-xs text-[#4B5578] mt-0.5">Upgrade for more roles</p>
          </div>
        </div>
      </Section>
    </div>
  );
};
