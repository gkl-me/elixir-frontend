'use client';

import React, { useState } from 'react';
import {
  Activity, CheckCircle2, FolderKanban, TrendingUp,
  Zap, Plus, ArrowRight, ChevronRight, Calendar,
  Target, BarChart3, Star, Bug, BookOpen, Check, X,
  CreditCard, Building, Package, Sparkles,
  GitMerge, Users
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CustomModal } from '@/components/modal/CustomModal';
import {
  demoActivities, demoProjects, demoTasks,
  demoMembers, demoSprints, demoSubscriptions, demoWorkspace
} from '../../../data/demoData';
import { getCapabilities, Capabilities } from '../constants/capabilities';
import { cn } from '@/lib/utils';

// ─── Types & helpers ──────────────────────────────────────
interface HomeViewProps {
  setActiveView?: (v: string) => void;
  /** Built-in role name OR custom role id */
  userRole?: string;
  /** Pass permissions[] from a CustomRole record to enable custom-role caps */
  customPermissions?: string[];
}

const initials = (name: string) =>
  name.split(' ').map(p => p[0]).join('').toUpperCase();

/** T-shirt sizing badge for story points */
const pointsToSize = (p: number) => {
  if (p <= 1) return { label: 'XS', color: '#6b7db3' };
  if (p <= 2) return { label: 'S',  color: '#60a5fa' };
  if (p <= 3) return { label: 'M',  color: '#34d399' };
  if (p <= 5) return { label: 'L',  color: '#f59e0b' };
  if (p <= 8) return { label: 'XL', color: '#c084fc' };
  return             { label: 'XXL', color: '#f87171' };
};

const taskTypeIcon = (type: string) => {
  if (type === 'bug')  return <Bug      className="w-3.5 h-3.5 text-red-400"    />;
  if (type === 'epic') return <Star     className="w-3.5 h-3.5 text-amber-400"  />;
  return                      <BookOpen className="w-3.5 h-3.5 text-sky-400"    />;
};

const statusColor: Record<string, string> = {
  'todo':        'bg-[#1e2a4a] text-[#8b9cc8]',
  'in-progress': 'bg-amber-500/15 text-amber-400',
  'in-review':   'bg-sky-500/15 text-sky-400',
  'done':        'bg-emerald-500/15 text-emerald-400',
};
const statusLabel: Record<string, string> = {
  'todo': 'Todo', 'in-progress': 'In Progress', 'in-review': 'In Review', 'done': 'Done',
};

const fmtCents = (cents: number) =>
  cents === 0 ? 'Free' : `$${(cents / 100).toFixed(0)}/member/mo`;

// ─── Upgrade Modal ────────────────────────────────────────
const Feat = ({ ok, text }: { ok: boolean; text: string }) => (
  <li className="flex items-center gap-2 text-sm">
    {ok ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        : <X     className="w-3.5 h-3.5 text-[#4B5578] flex-shrink-0" />}
    <span className={ok ? 'text-[#c9d3ed]' : 'text-[#4B5578]'}>{text}</span>
  </li>
);

const planMeta: Record<string, { icon: React.ElementType; color: string }> = {
  Free:       { icon: Package,  color: '#6b7db3' },
  Pro:        { icon: Star,     color: '#c084fc' },
  Enterprice: { icon: Building, color: '#f59e0b' },
};

const UpgradeModal = ({ currentPlan, memberCount, onClose }: {
  currentPlan: typeof demoSubscriptions[0];
  memberCount: number;
  onClose: () => void;
}) => {
  const planOrder: Record<string, number> = { Free: 0, Pro: 1, Enterprise: 2 };
  const upgradePlans = demoSubscriptions.filter(
    p => (planOrder[p.type] ?? 99) > (planOrder[currentPlan.type] ?? 0)
  );
  const [selected, setSelected] = useState(upgradePlans[0]?.id ?? '');
  const targetPlan = upgradePlans.find(p => p.id === selected) ?? upgradePlans[0];

  return (
    <CustomModal
      isOpen title="Upgrade Your Plan"
      description="Choose the plan that fits your team's needs."
      onClose={onClose}
      className="sm:max-w-2xl"
    >
      <div className="space-y-5">
        {/* Plan cards */}
        <div className={cn('grid gap-3', upgradePlans.length > 1 ? 'sm:grid-cols-2' : 'max-w-sm')}>
          {upgradePlans.map(plan => {
            const { icon: Icon, color } = planMeta[plan.type] ?? planMeta.Pro;
            const isSel = plan.id === selected;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={cn(
                  'text-left p-4 rounded-xl border transition-all duration-200',
                  isSel
                    ? 'border-[#8735C9] bg-gradient-to-b from-[#1a0f35] to-[#0C1635] shadow-[0_0_16px_rgba(135,53,201,0.25)]'
                    : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]'
                )}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{plan.name}</p>
                    <p className="text-xs" style={{ color }}>{fmtCents(plan.price)}</p>
                  </div>
                  {isSel && (
                    <span className="ml-auto text-[10px] bg-[#8735C9]/20 text-[#c084fc] border border-[#8735C9]/30 px-2 py-0.5 rounded-full font-semibold">Selected</span>
                  )}
                </div>
                <ul className="space-y-1">
                  <Feat ok text={`${plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects} Projects`} />
                  <Feat ok text={`${plan.limits.members === -1 ? 'Unlimited' : plan.limits.members} Members`} />
                  <Feat ok={plan.features.githubAutomation} text="GitHub Automation" />
                  <Feat ok={plan.limits.customRoles > 0} text={`${plan.limits.customRoles} Custom Roles`} />
                  <Feat ok={plan.type !== 'Free'} text="Priority Support" />
                  <Feat ok={plan.type === 'Enterprise'} text="SSO / SAML" />
                </ul>
              </button>
            );
          })}
        </div>

        {/* Billing summary */}
        {targetPlan && (
          <div className="flex items-center justify-between px-4 py-3 bg-[#07112b] border border-[#1e2a4a] rounded-xl">
            <div>
              <p className="text-xs text-[#6b7db3]">Billing summary</p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {targetPlan.name} · {memberCount} member{memberCount !== 1 ? 's' : ''}
              </p>
            </div>
            <p className="text-2xl font-black text-white">
              {targetPlan.price === 0 ? 'Free' : `$${(targetPlan.price / 100 * memberCount).toFixed(0)}`}
              <span className="text-sm font-normal text-[#6b7db3]">/mo</span>
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => {
              // [API TODO] POST /api/billing/subscribe { planId: selected }
              console.log('[API TODO] Upgrade to', selected);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to {targetPlan?.name ?? 'Pro'}
          </Button>
          <Button variant="outline" onClick={onClose} className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">
            Cancel
          </Button>
        </div>
        <p className="text-[11px] text-center text-[#4B5578]">
          Upgrades take effect immediately. You can downgrade anytime.{' '}
          <span className="text-[#8735C9] cursor-pointer hover:text-[#c084fc]">See terms →</span>
        </p>
      </div>
    </CustomModal>
  );
};

// ─── Stat Card ────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
  trend?: { text: string; up: boolean };
}) => (
  <div className="relative bg-[#0C1635] border border-[#1e2a4a] rounded-2xl p-5 flex flex-col gap-3 hover:border-[#293d6b] transition-all duration-200 group overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
      style={{ background: `radial-gradient(ellipse at top right, ${color}08, transparent 70%)` }} />
    <div className="relative flex items-start justify-between">
      <p className="text-[11px] font-semibold text-[#6b7db3] uppercase tracking-widest">{label}</p>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
    </div>
    <div className="relative">
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      {sub && <p className="text-xs text-[#6b7db3] mt-1">{sub}</p>}
    </div>
    {trend && (
      <p className={`relative text-xs font-medium flex items-center gap-1 ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
        <TrendingUp className="w-3 h-3" />{trend.text}
      </p>
    )}
  </div>
);

const daysLeft = (dateStr: string) => {
  const d = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  return d < 0 ? 'Ended' : d === 0 ? 'Today' : `${d}d left`;
};

// ─── Main HomeView ────────────────────────────────────────
export const HomeView = ({
  setActiveView,
  userRole = 'member',
  customPermissions,
}: HomeViewProps) => {

  // ── Derive capabilities once (works for any built-in OR custom role) ──
  const caps: Capabilities = getCapabilities(userRole, customPermissions);

  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // ── Derived values ────────────────────────────────────────
  const currentPlan   = demoSubscriptions.find(s => s.id === demoWorkspace.subscriptionPlan) ?? demoSubscriptions[1];
  const planOrder: Record<string, number> = { Free: 0, Pro: 1, Enterprise: 2 };
  const canUpgrade    = (planOrder[currentPlan.type] ?? 0) < 2;
  const memberCount   = demoWorkspace.members.length;

  const completedTasks  = demoTasks.filter(t => t.status === 'done');
  const inProgressTasks = demoTasks.filter(t => t.status === 'in-progress');
  const storyPtsDone    = completedTasks.reduce((s, t) => s + (t.points ?? 0), 0);
  const storyPtsTotal   = demoTasks.reduce((s, t) => s + (t.points ?? 0), 0);
  const activeProjects  = demoProjects.filter(p => p.status === 'active').length;

  // My tasks — in real app this comes from the API with the logged-in user's id
  const myMemberId = userRole === 'owner' ? 'm1' : userRole === 'admin' ? 'm2' : 'm3';
  const myTasks    = demoTasks.filter(t => t.assigneeId === myMemberId && t.status !== 'done');

  const activeSprints = demoSprints.filter(s => s.status === 'active');

  const sprintProgress = (sprintId: string) => {
    const all  = demoTasks.filter(t => t.sprintId === sprintId);
    const done = all.filter(t => t.status === 'done');
    return {
      taskTotal: all.length,
      taskDone:  done.length,
      pct:       all.length ? Math.round((done.length / all.length) * 100) : 0,
      pts: {
        done:  done.reduce((s, t) => s + (t.points ?? 0), 0),
        total: all.reduce((s,  t) => s + (t.points ?? 0), 0),
      },
    };
  };

  const user   = demoMembers[0].user;
  const hour   = new Date().getHours();
  const greet  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Activity — full team feed if capable, else own-only
  const allActivities = [
    ...demoActivities,
    { id: 'xa1', user: 'Alice Smith',  action: 'started sprint',  target: 'Sprint 2 - Core UI',        timestamp: '3h ago'    },
    { id: 'xa2', user: 'Bob Johnson',  action: 'commented on',    target: 'Implement Auth',             timestamp: '5h ago'    },
    { id: 'xa3', user: 'Charlie Dave', action: 'merged PR #14',   target: 'Website Redesign → develop', timestamp: 'Yesterday' },
    { id: 'xa4', user: 'Alice Smith',  action: 'created task',    target: 'Implement Auth (8 pts)',     timestamp: 'Yesterday' },
  ];
  const myActivities     = allActivities.filter(a => a.user === user.name);
  const activityFeed     = caps.canViewAllActivity ? allActivities : myActivities;

  // ── Stat cards — caps-driven, NOT role name ───────────────
  // Owner perspective: workspace health (members, projects, sprints) — NOT story points
  // Non-owner perspective: personal productivity (my tasks, story points)
  const ownerCards = [
    { label: 'Active Projects', value: activeProjects,    sub: `${demoProjects.length} total`,           icon: FolderKanban, color: '#8735C9', trend: { text: '+2 this month', up: true } },
    { label: 'In Progress',     value: inProgressTasks.length, sub: `${completedTasks.length} done`,    icon: Activity,     color: '#60a5fa' },
    { label: 'Members',         value: memberCount,        sub: `/ ${currentPlan.limits.members} on ${currentPlan.name}`, icon: Users, color: '#34d399' },
    { label: 'Active Sprints',  value: activeSprints.length, sub: 'currently running',                  icon: Target,       color: '#c084fc' },
  ];
  const memberCards = [
    { label: 'My Open Tasks',      value: myTasks.length,       sub: 'assigned to you',                  icon: CheckCircle2, color: '#8735C9' },
    { label: 'In Progress',        value: inProgressTasks.length, sub: 'across the team',                icon: Activity,     color: '#60a5fa' },
    { label: 'Story Points Done',  value: storyPtsDone,          sub: `${storyPtsTotal - storyPtsDone} pts remaining`, icon: Target, color: '#34d399' },
    { label: 'Active Sprints',     value: activeSprints.length,  sub: 'currently running',               icon: Zap,          color: '#c084fc' },
  ];

  // Owner/admin (billing managers) see workspace-health cards; others see personal
  const statCards = caps.canManageBilling ? ownerCards : memberCards;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-5 pb-10">

      {/* ── Greeting ───────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {greet}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#6b7db3] mt-0.5">
            Here&apos;s what&apos;s happening in{' '}
            <span className="text-[#c084fc] font-medium">{demoWorkspace.name}</span> today.
          </p>
        </div>
        {caps.canCreateProjects && (
          <Button
            onClick={() => setActiveView?.('projects')}
            className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 text-sm h-9 flex-shrink-0 shadow-[0_2px_12px_rgba(135,53,201,0.35)]"
          >
            <Plus className="w-3.5 h-3.5" />New Project
          </Button>
        )}
      </div>

      {/* ── Stat cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Plan usage banner (billing-capable only) ─────────── */}
      {caps.canManageBilling && canUpgrade && (
        <div className="relative overflow-hidden flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-[#1a0f35] via-[#0C1635] to-[#0C1635] border border-[#8735C9]/30 rounded-2xl">
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse at left, rgba(135,53,201,0.15), transparent 60%)' }} />
          <div className="relative w-9 h-9 rounded-xl bg-[#8735C9]/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-[#c084fc]" />
          </div>
          <div className="relative flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">
              <span className="text-[#c084fc]">{currentPlan.name} plan</span>
              {' · '}{activeProjects}/{currentPlan.limits.projects} projects
              {' · '}{memberCount}/{currentPlan.limits.members} members
            </p>
            <div className="flex items-center gap-4 mt-2">
              {(['projects', 'members'] as const).map(k => {
                const used = k === 'projects' ? activeProjects : memberCount;
                const lim  = k === 'projects' ? currentPlan.limits.projects : currentPlan.limits.members;
                const pct  = Math.round((used / lim) * 100);
                return (
                  <div key={k} className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-[#07112b] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: pct >= 80 ? '#f59e0b' : '#8735C9' }} />
                    </div>
                    <span className="text-[10px] text-[#6b7db3] capitalize">{k} {pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            onClick={() => setUpgradeOpen(true)}
            className="relative bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-1.5 text-xs h-8 flex-shrink-0 shadow-[0_2px_8px_rgba(135,53,201,0.4)]"
          >
            <Sparkles className="w-3 h-3" />Upgrade
          </Button>
        </div>
      )}

      {/* ── Activity + My Tasks ─────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#1e2a4a] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">
                {caps.canViewAllActivity ? 'Recent Activity' : 'My Activity'}
              </h2>
              <p className="text-xs text-[#6b7db3] mt-0.5">
                {caps.canViewAllActivity ? 'Latest actions across all projects' : 'Your recent actions'}
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Live
            </span>
          </div>
          <div className="flex-1 divide-y divide-[#1e2a4a] overflow-hidden">
            {activityFeed.slice(0, 7).map(a => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3 hover:bg-[#0a1327] transition-colors group">
                <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5 border border-[#1e2a4a]">
                  <AvatarFallback className="bg-[#8735C9]/20 text-[#c084fc] text-[10px] font-bold">
                    {initials(a.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#c9d3ed] leading-snug">
                    <span className="font-semibold text-[#c084fc]">{a.user}</span>{' '}
                    <span className="text-[#8b9cc8]">{a.action}</span>
                  </p>
                  <p className="text-[11px] text-[#4B5578] mt-0.5 truncate">{a.target}</p>
                </div>
                <span className="text-[10px] text-[#4B5578] flex-shrink-0 mt-0.5 group-hover:text-[#6b7db3]">{a.timestamp}</span>
              </div>
            ))}
          </div>
          {/* View all → Inbox (notification log) */}
          <div className="px-5 py-3 border-t border-[#1e2a4a]">
            <button onClick={() => setActiveView?.('notifications')}
              className="text-xs text-[#8735C9] hover:text-[#c084fc] font-medium flex items-center gap-1 transition-colors">
              View all in Inbox <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* My Tasks */}
        <div className="lg:col-span-2 bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#1e2a4a] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">My Tasks</h2>
              <p className="text-xs text-[#6b7db3] mt-0.5">Assigned to you</p>
            </div>
            {/* View all → Projects (board view has all tasks filtered by assignee) */}
            <button onClick={() => setActiveView?.('projects')}
              className="text-xs text-[#8735C9] hover:text-[#c084fc] font-medium flex items-center gap-1 transition-colors">
              Go to board<ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 divide-y divide-[#1e2a4a]">
            {myTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-center px-5">
                <CheckCircle2 className="w-7 h-7 text-emerald-400/30 mb-2" />
                <p className="text-xs text-[#4B5578]">All caught up! 🎉</p>
              </div>
            ) : myTasks.map(task => {
              const project = demoProjects.find(p => p.id === task.projectId);
              const sz = task.points ? pointsToSize(task.points) : null;
              return (
                <div key={task.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#0a1327] transition-colors">
                  <div className="mt-0.5 flex-shrink-0">{taskTypeIcon(task.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#c9d3ed] truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-[#4B5578]">{project?.name}</span>
                      {sz && (
                        <span className="text-[9px] font-bold px-1 py-0.5 rounded border"
                          style={{ color: sz.color, borderColor: `${sz.color}30`, backgroundColor: `${sz.color}10` }}>
                          {sz.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[task.status]}`}>
                    {statusLabel[task.status]}
                  </span>
                </div>
              );
            })}
          </div>
          {caps.canManageBacklog && (
            <div className="px-5 py-3 border-t border-[#1e2a4a]">
              <button onClick={() => setActiveView?.('projects')}
                className="flex items-center gap-1.5 text-xs text-[#8735C9] hover:text-[#c084fc] font-medium transition-colors">
                <Plus className="w-3 h-3" />Create task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom row ───────────────────────────────────────── */}
      <div className={cn('grid gap-5', caps.canManageBilling ? 'lg:grid-cols-3' : 'lg:grid-cols-2')}>

        {/* Active Sprints */}
        <div className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2a4a] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#8735C9]" />
            <h2 className="text-sm font-bold text-white">Active Sprints</h2>
          </div>
          <div className="divide-y divide-[#1e2a4a]">
            {activeSprints.map(sprint => {
              const prog    = sprintProgress(sprint.id);
              const project = demoProjects.find(pr => pr.id === sprint.projectId);
              return (
                <div key={sprint.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white">{sprint.name}</p>
                      <p className="text-xs text-[#6b7db3] mt-0.5">{project?.name}</p>
                    </div>
                    <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1 flex-shrink-0 border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      <Calendar className="w-2.5 h-2.5" />{daysLeft(sprint.endDate)}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#6b7db3]">{prog.taskDone}/{prog.taskTotal} tasks</span>
                      <span className="text-[10px] font-bold text-white">{prog.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#07112b] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${prog.pct}%`, background: prog.pct >= 80 ? 'linear-gradient(90deg,#8735C9,#34d399)' : 'linear-gradient(90deg,#8735C9,#6a29a0)' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-[#c084fc]" />
                    <span className="text-[11px] text-[#8b9cc8]">{prog.pts.done}/{prog.pts.total} story pts</span>
                    <div className="flex-1 h-1 bg-[#07112b] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#c084fc]/60"
                        style={{ width: prog.pts.total ? `${Math.round((prog.pts.done / prog.pts.total) * 100)}%` : '0%' }} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="p-5 opacity-40">
              <p className="text-xs font-semibold text-white">Sprint 3 - Auth &amp; Roles</p>
              <p className="text-[11px] text-[#6b7db3] mt-0.5">Starting Apr 1 · Planned</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2a4a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#8735C9]" />
              <h2 className="text-sm font-bold text-white">Projects</h2>
            </div>
            <button onClick={() => setActiveView?.('projects')}
              className="text-xs text-[#8735C9] hover:text-[#c084fc] font-medium flex items-center gap-1">
              View all<ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#1e2a4a]">
            {demoProjects.map(proj => {
              const tasks   = demoTasks.filter(t => t.projectId === proj.id);
              const done    = tasks.filter(t => t.status === 'done');
              const pct     = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
              const ptsDone = done.reduce((s, t) => s + (t.points ?? 0), 0);
              const ptsAll  = tasks.reduce((s, t) => s + (t.points ?? 0), 0);
              return (
                <div key={proj.id}
                  className="px-5 py-4 hover:bg-[#0a1327] cursor-pointer transition-colors group"
                  onClick={() => setActiveView?.('projects')}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-semibold text-white group-hover:text-[#c084fc] transition-colors truncate">{proj.name}</p>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">Active</span>
                  </div>
                  <p className="text-[11px] text-[#4B5578] mb-2 truncate">{proj.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#07112b] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-[#6b7db3] whitespace-nowrap">{done.length}/{tasks.length} tasks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 text-[#c084fc]" />
                      <span className="text-[10px] text-[#6b7db3]">{ptsDone}/{ptsAll} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {caps.canCreateProjects && (
              <div className="px-5 py-4 hover:bg-[#0a1327] cursor-pointer group" onClick={() => setActiveView?.('projects')}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg border-2 border-dashed border-[#1e2a4a] group-hover:border-[#8735C9] flex items-center justify-center transition-colors">
                    <Plus className="w-3.5 h-3.5 text-[#4B5578] group-hover:text-[#8735C9]" />
                  </div>
                  <span className="text-xs font-medium text-[#6b7db3] group-hover:text-white transition-colors">New project</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions (only shown if billing-capable — otherwise bottom row is 2-col) */}
        {caps.canManageBilling && (
          <div className="space-y-4">
            <div className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e2a4a] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#8735C9]" />
                <h2 className="text-sm font-bold text-white">Quick Actions</h2>
              </div>
              <div className="p-2 space-y-0.5">
                {[
                  ...(caps.canCreateProjects ? [{ label: 'New Project',       icon: FolderKanban, action: () => setActiveView?.('projects') }] : []),
                  ...(caps.canInviteMembers  ? [{ label: 'Invite Member',      icon: Users,        action: () => setActiveView?.('members')  }] : []),
                  { label: 'View Notifications', icon: Activity,   action: () => setActiveView?.('notifications') },
                  { label: 'Open Backlog',       icon: BarChart3,  action: () => setActiveView?.('projects')      },
                  ...(caps.canManageBilling  ? [{ label: 'Upgrade Plan',       icon: Sparkles,     action: () => setUpgradeOpen(true)        }] : []),
                  ...(caps.canManageWorkspace? [{ label: 'Workspace Settings', icon: Target,       action: () => setActiveView?.('settings') }] : []),
                ].map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <button key={i} onClick={a.action}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#0f1d3d] transition-colors group text-left">
                      <div className="w-7 h-7 rounded-lg bg-[#132353] flex items-center justify-center flex-shrink-0 group-hover:bg-[#8735C9]/20 transition-colors">
                        <Icon className="w-3.5 h-3.5 text-[#8b9cc8] group-hover:text-[#c084fc]" />
                      </div>
                      <span className="text-xs font-medium text-[#8b9cc8] group-hover:text-white">{a.label}</span>
                      <ChevronRight className="w-3 h-3 text-[#4B5578] ml-auto group-hover:text-[#8735C9] transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Members panel */}
            {caps.canViewMembers && (
              <div className="bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#1e2a4a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#8735C9]" />
                    <h2 className="text-xs font-bold text-white">Members</h2>
                  </div>
                  {caps.canManageMembers && (
                    <button onClick={() => setActiveView?.('members')}
                      className="text-[10px] text-[#8735C9] hover:text-[#c084fc] font-medium">Manage</button>
                  )}
                </div>
                <div className="p-3 space-y-1.5">
                  {demoMembers.map(m => (
                    <div key={m.id} className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7 border border-[#1e2a4a] flex-shrink-0">
                        <AvatarFallback className="bg-[#8735C9]/20 text-[#c084fc] text-[10px] font-bold">
                          {initials(m.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{m.user.name}</p>
                        <p className="text-[10px] text-[#6b7db3] capitalize">{m.role}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400/80 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Upgrade modal ──────────────────────────────────── */}
      {upgradeOpen && (
        <UpgradeModal
          currentPlan={currentPlan}
          memberCount={memberCount}
          onClose={() => setUpgradeOpen(false)}
        />
      )}
    </div>
  );
};
