'use client';

import React, { useState } from 'react';
import {
  FolderKanban, Plus, Search, LayoutGrid, List,
  ArrowRight, Star, Target, Users, Calendar,
  CheckCircle2, Clock, Archive, MoreHorizontal,
  Tag, Lock, Globe, ChevronDown, Check, X, Zap,
  BookOpen, TrendingUp, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CustomModal } from '@/components/modal/CustomModal';
import {
  demoProjects, demoTasks, demoMembers, demoSprints, demoTeams
} from '../../../data/demoData';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────
interface ProjectsViewProps {
  onEnterProject: (projectId: string) => void;
}

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'active' | 'archived';

const PROJECT_LABELS = [
  { id: 'frontend',  label: 'Frontend',   color: '#60a5fa' },
  { id: 'backend',   label: 'Backend',    color: '#34d399' },
  { id: 'mobile',    label: 'Mobile',     color: '#f59e0b' },
  { id: 'design',    label: 'Design',     color: '#c084fc' },
  { id: 'devops',    label: 'DevOps',     color: '#f87171' },
  { id: 'research',  label: 'Research',   color: '#fb923c' },
  { id: 'marketing', label: 'Marketing',  color: '#38bdf8' },
  { id: 'data',      label: 'Data',       color: '#a3e635' },
];

const PROJECT_PRIORITIES = [
  { id: 'urgent', label: 'Urgent', color: '#ef4444', dot: 'bg-red-500'    },
  { id: 'high',   label: 'High',   color: '#f97316', dot: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: '#f59e0b', dot: 'bg-amber-500'  },
  { id: 'low',    label: 'Low',    color: '#6b7db3', dot: 'bg-slate-500'  },
];

const PROJECT_TYPES = [
  { id: 'software',  label: 'Software',  icon: '🖥️'  },
  { id: 'design',    label: 'Design',    icon: '🎨'  },
  { id: 'marketing', label: 'Marketing', icon: '📣'  },
  { id: 'research',  label: 'Research',  icon: '🔬'  },
  { id: 'general',   label: 'General',   icon: '📋'  },
];

// ─── Helpers ──────────────────────────────────────────────
const initials = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase();

const projectStats = (projectId: string) => {
  const tasks     = demoTasks.filter(t => t.projectId === projectId);
  const done      = tasks.filter(t => t.status === 'done');
  const inProg    = tasks.filter(t => t.status === 'in-progress');
  const ptsDone   = done.reduce((s, t) => s + (t.points ?? 0), 0);
  const ptsTotal  = tasks.reduce((s, t) => s + (t.points ?? 0), 0);
  const pct       = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const sprint    = demoSprints.find(s => s.projectId === projectId && s.status === 'active');
  return { tasks, done, inProg, ptsDone, ptsTotal, pct, sprint };
};

const daysLeft = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  return diff < 0 ? 'Ended' : diff === 0 ? 'Today' : `${diff}d left`;
};

// ─── Create Project Modal ─────────────────────────────────
interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const [step, setStep] = useState(1);
  const [teamSearch,   setTeamSearch]   = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [form, setForm] = useState({
    name:        '',
    description: '',
    label:       '',
    priority:    'medium',
    type:        'software',
    startDate:   '',
    dueDate:     '',
    memberIds:   [] as string[],
    teamId:      '',
    prefix:      '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, val: unknown) =>
    setForm(f => ({ ...f, [field]: val }));

  const toggleMember = (id: string) =>
    update('memberIds', form.memberIds.includes(id)
      ? form.memberIds.filter(m => m !== id)
      : [...form.memberIds, id]);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())       e.name = 'Project name is required';
    if (form.name.length > 60)   e.name = 'Max 60 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext    = () => { if (validateStep1()) setStep(2); };
  const handleCreate  = () => { console.log('[API TODO] Create project', form); onClose(); };

  const selectedLabel    = PROJECT_LABELS.find(l => l.id === form.label);
  const selectedTeam     = demoTeams.find(t => t.id === form.teamId);
  const selectedPriority = PROJECT_PRIORITIES.find(p => p.id === form.priority);

  const filteredTeams   = demoTeams.filter(t =>
    !teamSearch || t.name.toLowerCase().includes(teamSearch.toLowerCase()));
  const filteredMembers = demoMembers.filter(m =>
    !memberSearch ||
    m.user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.user.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title={step === 1 ? 'New Project' : 'Team & Members'}
      description={step === 1
        ? 'Set up the basics for your new project.'
        : 'Assign a team and invite members to this project.'}
      className="sm:max-w-xl"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={cn(
              'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all',
              step === s
                ? 'bg-[#8735C9]/20 text-[#c084fc] border border-[#8735C9]/40'
                : step > s
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-[#4B5578] border border-[#1e2a4a]'
            )}>
              {step > s ? <Check className="w-3 h-3" /> : <span>{s}</span>}
              <span>{s === 1 ? 'Basics' : 'Team & Members'}</span>
            </div>
            {s < 2 && <div className="flex-1 h-px bg-[#1e2a4a]" />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 1: Basics ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="overflow-y-auto max-h-[55vh] pr-1 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={e => { update('name', e.target.value); update('prefix', e.target.value.slice(0, 3).toUpperCase()); }}
                placeholder="e.g. Website Redesign"
                className={cn(
                  'w-full bg-[#07112b] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors',
                  errors.name ? 'border-red-400/50 focus:border-red-400' : 'border-[#1e2a4a] focus:border-[#8735C9]'
                )}
              />
              {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Description</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="What is this project about? Goals, scope, context…"
                rows={3}
                className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors resize-none"
              />
            </div>

            {/* Identifier + Label */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Identifier</label>
                <input
                  value={form.prefix}
                  onChange={e => update('prefix', e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="PRJ"
                  className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors font-mono"
                />
                <p className="text-[10px] text-[#4B5578] mt-1">Used as task prefix, e.g. PRJ-1</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Label</label>
                <div className="relative">
                  <select
                    value={form.label}
                    onChange={e => update('label', e.target.value)}
                    className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">No label</option>
                    {PROJECT_LABELS.map(l => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#4B5578] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">Project Type</label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map(t => (
                  <button key={t.id} onClick={() => update('type', t.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all',
                      form.type === t.id
                        ? 'border-[#8735C9] bg-[#8735C9]/15 text-[#c084fc]'
                        : 'border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b] hover:text-white'
                    )}>
                    <span>{t.icon}</span>{t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">Priority</label>
              <div className="flex gap-2">
                {PROJECT_PRIORITIES.map(p => (
                  <button key={p.id} onClick={() => update('priority', p.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all',
                      form.priority === p.id
                        ? 'border-[#8735C9] bg-[#8735C9]/15 text-white'
                        : 'border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b]'
                    )}>
                    <span className={cn('w-2 h-2 rounded-full', p.dot)} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Start Date</label>
                <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)}
                  className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors [color-scheme:dark]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8b9cc8] mb-1.5 uppercase tracking-wider">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => update('dueDate', e.target.value)}
                  className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors [color-scheme:dark]" />
              </div>
            </div>

            {/* Label color preview */}
            {selectedLabel && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#1e2a4a] bg-[#07112b]">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedLabel.color }} />
                <span className="text-xs font-medium" style={{ color: selectedLabel.color }}>{selectedLabel.label}</span>
                <span className="text-[10px] text-[#4B5578] ml-auto">Label preview</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
            <Button onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold">
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onClose}
              className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Team & Members ── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="overflow-y-auto max-h-[55vh] pr-1 space-y-5">

          {/* Team — searchable + scrollable */}
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">
              Assign Team <span className="normal-case text-[#4B5578] font-normal">(optional)</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
              <input value={teamSearch} onChange={e => setTeamSearch(e.target.value)} placeholder="Search teams…"
                className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#4B5578] outline-none transition-colors" />
            </div>
            <div className="overflow-y-auto max-h-[180px] space-y-1.5 pr-0.5">
              {filteredTeams.length === 0 && (
                <p className="text-[11px] text-[#4B5578] text-center py-3">No teams match your search.</p>
              )}
              {filteredTeams.map(team => {
                const sel = form.teamId === team.id;
                return (
                  <button key={team.id} onClick={() => update('teamId', sel ? '' : team.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                      sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]'
                    )}>
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', sel ? 'bg-[#8735C9]/20' : 'bg-[#132353]')}>
                      <Users className={cn('w-3.5 h-3.5', sel ? 'text-[#c084fc]' : 'text-[#6b7db3]')} />
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-xs font-medium', sel ? 'text-white' : 'text-[#8b9cc8]')}>{team.name}</p>
                      <p className="text-[10px] text-[#4B5578]">{team.memberIds.length} members</p>
                    </div>
                    {sel && <Check className="w-3.5 h-3.5 text-[#c084fc]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Members — searchable + scrollable */}
          <div>
            <label className="block text-xs font-semibold text-[#8b9cc8] mb-2 uppercase tracking-wider">
              Invite Members <span className="normal-case text-[#4B5578] font-normal">(optional)</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
              <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="Search members…"
                className="w-full bg-[#07112b] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#4B5578] outline-none transition-colors" />
            </div>
            <div className="overflow-y-auto max-h-[220px] space-y-1.5 pr-0.5">
              {filteredMembers.length === 0 && (
                <p className="text-[11px] text-[#4B5578] text-center py-3">No members match your search.</p>
              )}
              {filteredMembers.map(m => {
                const sel = form.memberIds.includes(m.id);
                return (
                  <button key={m.id} onClick={() => toggleMember(m.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all',
                      sel ? 'border-[#8735C9] bg-[#8735C9]/10' : 'border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]'
                    )}>
                    <Avatar className="w-7 h-7 border border-[#1e2a4a] flex-shrink-0">
                      <AvatarFallback className="bg-[#8735C9]/20 text-[#c084fc] text-[10px] font-bold">{initials(m.user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-medium truncate', sel ? 'text-white' : 'text-[#8b9cc8]')}>{m.user.name}</p>
                      <p className="text-[10px] text-[#4B5578] capitalize">{m.role}</p>
                    </div>
                    <div className={cn('w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0',
                      sel ? 'bg-[#8735C9] border-[#8735C9]' : 'border-[#293d6b]')}>
                      {sel && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {form.memberIds.length > 0 && (
              <p className="text-[11px] text-[#c084fc] mt-2">
                {form.memberIds.length} member{form.memberIds.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Summary card */}
          <div className="bg-[#07112b] border border-[#1e2a4a] rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-semibold text-[#6b7db3] uppercase tracking-wider">Summary</p>
            <div className="flex items-center gap-2 flex-wrap">
              <FolderKanban className="w-4 h-4 text-[#c084fc]" />
              <p className="text-sm font-semibold text-white">{form.name || 'Untitled Project'}</p>
              {selectedLabel && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                  style={{ color: selectedLabel.color, borderColor: `${selectedLabel.color}30`, backgroundColor: `${selectedLabel.color}10` }}>
                  {selectedLabel.label}
                </span>
              )}
              {selectedPriority && (
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#1e2a4a] text-[#8b9cc8] flex items-center gap-1">
                  <span className={cn('w-1.5 h-1.5 rounded-full', selectedPriority.dot)} />
                  {selectedPriority.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#6b7db3] flex-wrap">
              {selectedTeam && <><Users className="w-3 h-3" /><span>{selectedTeam.name}</span></>}
              {form.memberIds.length > 0 && <><Users className="w-3 h-3" /><span>{form.memberIds.length} members invited</span></>}
              {form.startDate && <><Calendar className="w-3 h-3" /><span>Starts {form.startDate}</span></>}
              {form.dueDate   && <><Calendar className="w-3 h-3" /><span>Due {form.dueDate}</span></>}
            </div>
          </div>
          </div>{/* end scrollable */}

          <div className="flex gap-2 pt-2 border-t border-[#1e2a4a]">
            <Button onClick={() => setStep(1)} variant="outline"
              className="border-[#1e2a4a] text-[#8b9cc8] hover:text-white hover:bg-[#0f1d3d]">
              ← Back
            </Button>
            <Button onClick={handleCreate}
              className="flex-1 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 font-semibold">
              <Zap className="w-4 h-4" />Create Project
            </Button>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

// ─── Project Card (grid view) ─────────────────────────────
const ProjectCard = ({ project, onEnter }: {
  project: typeof demoProjects[0];
  onEnter: () => void;
}) => {
  const stats = projectStats(project.id);
  const members = demoMembers.slice(0, 3); // in real app: filter by project membership

  return (
    <div className="group relative bg-[#0C1635] border border-[#1e2a4a] rounded-2xl overflow-hidden hover:border-[#293d6b] transition-all duration-200 flex flex-col cursor-pointer"
      onClick={onEnter}>
      {/* top gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(135,53,201,0.3)]">
                <FolderKanban className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-[#c084fc] transition-colors">{project.name}</p>
                <p className="text-[10px] text-[#4B5578]">
                  Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
              project.status === 'active'
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-[#6b7db3] border-[#1e2a4a] bg-[#07112b]'
            )}>
              {project.status === 'active' ? 'Active' : 'Archived'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#6b7db3] line-clamp-2 leading-relaxed">{project.description ?? 'No description.'}</p>

        {/* Sprint badge */}
        {stats.sprint && (
          <div className="flex items-center gap-2 px-3 py-2 bg-[#07112b] rounded-xl border border-[#1e2a4a]">
            <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-medium text-amber-300 truncate flex-1">{stats.sprint.name}</span>
            <span className="text-[10px] text-amber-400/70 flex-shrink-0 border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 rounded-full">
              {daysLeft(stats.sprint.endDate)}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: BookOpen, val: stats.tasks.length, label: 'Tasks',    color: '#60a5fa' },
            { icon: CheckCircle2, val: stats.done.length, label: 'Done',  color: '#34d399' },
            { icon: Star, val: `${stats.ptsDone}/${stats.ptsTotal}`, label: 'Pts', color: '#c084fc' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5 py-2 bg-[#07112b] rounded-xl border border-[#1e2a4a]">
              <s.icon className="w-3 h-3 mb-0.5" style={{ color: s.color }} />
              <p className="text-xs font-bold text-white">{s.val}</p>
              <p className="text-[9px] text-[#4B5578]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#6b7db3]">Progress</span>
            <span className="text-[10px] font-bold text-white">{stats.pct}%</span>
          </div>
          <div className="h-1.5 bg-[#07112b] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${stats.pct}%`,
                background: stats.pct >= 80
                  ? 'linear-gradient(90deg,#8735C9,#34d399)'
                  : 'linear-gradient(90deg,#8735C9,#6a29a0)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#1e2a4a] flex items-center justify-between">
        {/* Member avatars */}
        <div className="flex -space-x-2">
          {members.map((m, i) => (
            <Avatar key={m.id} className="w-6 h-6 border-2 border-[#0C1635] flex-shrink-0" style={{ zIndex: 10 - i }}>
              <AvatarFallback className="bg-[#8735C9]/30 text-[#c084fc] text-[9px] font-bold">{initials(m.user.name)}</AvatarFallback>
            </Avatar>
          ))}
          {demoMembers.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-[#132353] border-2 border-[#0C1635] flex items-center justify-center z-0">
              <span className="text-[8px] text-[#8b9cc8] font-bold">+{demoMembers.length - 3}</span>
            </div>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onEnter(); }}
          className="flex items-center gap-1 text-[11px] text-[#8b9cc8] hover:text-[#c084fc] font-medium transition-colors group/btn"
        >
          Open <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// ─── Project Row (list view) ──────────────────────────────
const ProjectRow = ({ project, onEnter }: {
  project: typeof demoProjects[0];
  onEnter: () => void;
}) => {
  const stats = projectStats(project.id);
  const members = demoMembers.slice(0, 3);

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 bg-[#0C1635] border border-[#1e2a4a] rounded-xl hover:border-[#293d6b] hover:bg-[#0f1d3d] transition-all cursor-pointer group"
      onClick={onEnter}
    >
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] flex items-center justify-center flex-shrink-0">
        <FolderKanban className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white group-hover:text-[#c084fc] transition-colors truncate">{project.name}</p>
        <p className="text-[11px] text-[#6b7db3] truncate">{project.description}</p>
      </div>

      {/* Sprint */}
      <div className="hidden md:flex items-center gap-1.5 min-w-[130px]">
        {stats.sprint
          ? <><Zap className="w-3 h-3 text-amber-400" /><span className="text-[11px] text-amber-300 truncate">{stats.sprint.name}</span></>
          : <span className="text-[11px] text-[#4B5578]">No active sprint</span>}
      </div>

      {/* Progress bar */}
      <div className="hidden md:flex items-center gap-2 min-w-[100px]">
        <div className="flex-1 h-1.5 bg-[#07112b] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa]" style={{ width: `${stats.pct}%` }} />
        </div>
        <span className="text-[10px] font-bold text-white whitespace-nowrap">{stats.pct}%</span>
      </div>

      {/* Pts */}
      <div className="hidden lg:flex items-center gap-1.5 min-w-[70px]">
        <Star className="w-3 h-3 text-[#c084fc]" />
        <span className="text-[11px] text-[#8b9cc8]">{stats.ptsDone}/{stats.ptsTotal} pts</span>
      </div>

      {/* Members */}
      <div className="hidden md:flex -space-x-1.5 flex-shrink-0">
        {members.map(m => (
          <Avatar key={m.id} className="w-6 h-6 border-2 border-[#0C1635]">
            <AvatarFallback className="bg-[#8735C9]/30 text-[#c084fc] text-[9px] font-bold">{initials(m.user.name)}</AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* Status */}
      <span className={cn(
        'text-[10px] font-semibold px-2 py-0.5 rounded-full border hidden sm:block flex-shrink-0',
        project.status === 'active'
          ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
          : 'text-[#6b7db3] border-[#1e2a4a]'
      )}>
        {project.status === 'active' ? 'Active' : 'Archived'}
      </span>

      <ArrowRight className="w-3.5 h-3.5 text-[#4B5578] group-hover:text-[#c084fc] transition-colors flex-shrink-0" />
    </div>
  );
};

// ─── Main ProjectsView ────────────────────────────────────
export const ProjectsView: React.FC<ProjectsViewProps> = ({ onEnterProject }) => {
  const [view,       setView]       = useState<ViewMode>('grid');
  const [filter,     setFilter]     = useState<FilterStatus>('all');
  const [search,     setSearch]     = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = demoProjects.filter(p => {
    const matchStatus = filter === 'all' || p.status === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description ?? '').toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalTasks  = demoTasks.length;
  const doneTasks   = demoTasks.filter(t => t.status === 'done').length;
  const totalPts    = demoTasks.reduce((s, t) => s + (t.points ?? 0), 0);
  const donePts     = demoTasks.filter(t => t.status === 'done').reduce((s, t) => s + (t.points ?? 0), 0);
  const activeSprints = demoSprints.filter(s => s.status === 'active').length;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Projects</h1>
          <p className="text-sm text-[#6b7db3] mt-0.5">
            {demoProjects.filter(p => p.status === 'active').length} active ·{' '}
            {demoProjects.length} total
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-gradient-to-r from-[#8735C9] to-[#6a29a0] hover:opacity-90 text-white gap-2 text-sm h-9 shadow-[0_2px_12px_rgba(135,53,201,0.35)]"
        >
          <Plus className="w-4 h-4" />New Project
        </Button>
      </div>

      {/* ── Summary stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Projects',  value: demoProjects.length,                    icon: FolderKanban, color: '#8735C9' },
          { label: 'Tasks Done',      value: `${doneTasks}/${totalTasks}`,            icon: CheckCircle2, color: '#34d399' },
          { label: 'Story Points',    value: `${donePts}/${totalPts}`,               icon: Star,         color: '#c084fc' },
          { label: 'Active Sprints',  value: activeSprints,                           icon: Zap,          color: '#f59e0b' },
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

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4B5578]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full bg-[#0C1635] border border-[#1e2a4a] focus:border-[#8735C9] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#4B5578] outline-none transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-[#0C1635] border border-[#1e2a4a] rounded-xl p-1">
          {(['all', 'active', 'archived'] as FilterStatus[]).map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-all',
                filter === f
                  ? 'bg-[#8735C9] text-white'
                  : 'text-[#6b7db3] hover:text-white'
              )}>
              {f}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-[#0C1635] border border-[#1e2a4a] rounded-xl p-1 ml-auto">
          {([['grid', LayoutGrid], ['list', List]] as [ViewMode, React.ElementType][]).map(([v, Icon]) => (
            <button key={v}
              onClick={() => setView(v)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                view === v ? 'bg-[#8735C9] text-white' : 'text-[#6b7db3] hover:text-white'
              )}>
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0C1635] border border-[#1e2a4a] flex items-center justify-center mb-4">
            <FolderKanban className="w-6 h-6 text-[#4B5578]" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">No projects found</p>
          <p className="text-xs text-[#4B5578]">Try adjusting your search or filter.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => <ProjectCard key={p.id} project={p} onEnter={() => onEnterProject(p.id)} />)}
          {/* Empty slot — add new */}
          <button
            onClick={() => setCreateOpen(true)}
            className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0C1635] border-2 border-dashed border-[#1e2a4a] hover:border-[#8735C9] rounded-2xl transition-all group min-h-[200px]"
          >
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[#1e2a4a] group-hover:border-[#8735C9] flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-[#4B5578] group-hover:text-[#8735C9]" />
            </div>
            <span className="text-xs font-medium text-[#6b7db3] group-hover:text-white transition-colors">New project</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* List header */}
          <div className="hidden md:flex items-center gap-4 px-5 py-2 text-[10px] font-semibold text-[#4B5578] uppercase tracking-wider">
            <div className="w-9 flex-shrink-0" />
            <div className="flex-1">Project</div>
            <div className="min-w-[130px]">Sprint</div>
            <div className="min-w-[100px]">Progress</div>
            <div className="hidden lg:block min-w-[70px]">Points</div>
            <div className="hidden md:block min-w-[80px]">Members</div>
            <div className="hidden sm:block min-w-[60px]">Status</div>
            <div className="w-4" />
          </div>
          {filtered.map(p => <ProjectRow key={p.id} project={p} onEnter={() => onEnterProject(p.id)} />)}
        </div>
      )}

      {/* ── Create Project Modal ─────────────────────────── */}
      {createOpen && <CreateProjectModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
};
