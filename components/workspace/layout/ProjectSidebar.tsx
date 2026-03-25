'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart2, ListTodo, KanbanSquare,
  Timer, Activity, Users, ChevronLeft,
  Zap, GitBranch, Layers, Target
} from 'lucide-react';
import { demoProjects, demoSprints } from '../../../data/demoData';
import { cn } from '@/lib/utils';

interface ProjectSidebarProps {
  activeProjectId?: string | null;
  collapsed?: boolean;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  activeProjectId,
  collapsed = false,
}) => {
  const pathname = usePathname();
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  // For `/demo/projects/p1/backlogs`, pathParts[3] is 'backlogs'
  const activeView = pathParts.length > 3 ? pathParts[3] : 'overview';

  const project = demoProjects.find(p => p.id === activeProjectId);
  const activeSprint = demoSprints.find(s => s.projectId === activeProjectId && s.status === 'active');

  const sections = [
    {
      label: 'Planning',
      links: [
        { id: 'overview',  label: 'Overview',   icon: Target,       description: 'Project metrics' },
        { id: 'backlogs',  label: 'Backlog',    icon: Layers,       description: 'Issue backlog' },
      ],
    },
    {
      label: 'Active Sprint',
      links: [
        { id: 'board',             label: 'Board',        icon: KanbanSquare, description: 'Kanban view' },
        { id: 'sprint',            label: 'Sprint',       icon: Timer,        description: 'Sprint goals' },
        { id: 'sprint-performance', label: 'Performance', icon: BarChart2,    description: 'Velocity & history' },
      ],
    },
    {
      label: 'Collaboration',
      links: [
        { id: 'project-teams', label: 'Teams',    icon: Users,     description: 'Team members' },
        { id: 'project-tasks', label: 'Activity', icon: Activity,  description: 'Recent activity' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#07112b]">
      {/* Back button */}
      <div className="px-4 pt-4 pb-2">
        <Link
          href="/demo/projects"
          className="flex items-center gap-1.5 text-xs text-[#6b7db3] hover:text-white transition-colors mb-4 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          All projects
        </Link>

        {/* Project card */}
        <div className="bg-gradient-to-br from-[#0C1635] to-[#0a1020] border border-[#1e2a4a] rounded-xl p-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8735C9] to-[#4B2070] flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-[0_0_14px_rgba(135,53,201,0.3)]">
              {project?.name.charAt(0) ?? 'P'}
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-white truncate leading-tight">
                {project?.name ?? 'Project'}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Sprint info */}
          {activeSprint && (
            <div className="mt-3 pt-3 border-t border-[#1e2a4a]">
              <div className="flex items-center gap-1.5 text-[11px] text-[#6b7db3]">
                <GitBranch className="w-3 h-3 text-[#8735C9]" />
                <span className="font-medium text-white truncate">{activeSprint.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#4B5578]">
                <Timer className="w-3 h-3" />
                Ends {new Date(activeSprint.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sectioned nav */}
      <div className="flex-1 px-3 py-2 overflow-y-auto scrollbar-hide space-y-4">
        {sections.map(section => (
          <div key={section.label}>
            <p className="text-[10px] font-semibold text-[#4B5578] uppercase tracking-widest px-2 mb-1.5">{section.label}</p>
            <div className="space-y-0.5">
              {section.links.map(link => {
                const Icon = link.icon;
                const isActive = activeView === link.id;
                const targetUrl = link.id === 'overview' 
                  ? `/demo/projects/${activeProjectId}`
                  : `/demo/projects/${activeProjectId}/${link.id}`;
                return (
                  <Link
                    key={link.id}
                    href={targetUrl}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                      isActive
                        ? 'bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_10px_rgba(135,53,201,0.3)]'
                        : 'text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-white' : 'text-[#6b7db3] group-hover:text-purple-300')} />
                    <div className="flex-1 text-left">
                      <span>{link.label}</span>
                    </div>
                    {isActive && <Zap className="w-3 h-3 text-white/50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
