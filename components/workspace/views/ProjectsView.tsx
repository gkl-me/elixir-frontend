"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  Star,
  Users,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Check,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CustomModal } from "@/components/modal/CustomModal";
import {
  demoProjects,
  demoTasks,
  demoMembers,
  demoSprints,
  demoTeams,
} from "../../../data/demoData";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────
interface ProjectsViewProps {
  onEnterProject: (projectId: string) => void;
}

type ViewMode = "grid" | "list";
type FilterStatus = "all" | "active" | "archived";

const PROJECT_LABELS = [
  { id: "frontend", label: "Frontend", color: "#60a5fa" },
  { id: "backend", label: "Backend", color: "#34d399" },
  { id: "mobile", label: "Mobile", color: "#f59e0b" },
  { id: "design", label: "Design", color: "#c084fc" },
  { id: "devops", label: "DevOps", color: "#f87171" },
  { id: "research", label: "Research", color: "#fb923c" },
  { id: "marketing", label: "Marketing", color: "#38bdf8" },
  { id: "data", label: "Data", color: "#a3e635" },
];

const PROJECT_PRIORITIES = [
  { id: "urgent", label: "Urgent", color: "#ef4444", dot: "bg-red-500" },
  { id: "high", label: "High", color: "#f97316", dot: "bg-orange-500" },
  { id: "medium", label: "Medium", color: "#f59e0b", dot: "bg-amber-500" },
  { id: "low", label: "Low", color: "#6b7db3", dot: "bg-slate-500" },
];

const PROJECT_TYPES = [
  { id: "software", label: "Software", icon: "🖥️" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "marketing", label: "Marketing", icon: "📣" },
  { id: "research", label: "Research", icon: "🔬" },
  { id: "general", label: "General", icon: "📋" },
];

// ─── Helpers ──────────────────────────────────────────────
const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

const projectStats = (projectId: string) => {
  const tasks = demoTasks.filter((t) => t.projectId === projectId);
  const done = tasks.filter((t) => t.status === "done");
  const inProg = tasks.filter((t) => t.status === "in-progress");
  const ptsDone = done.reduce((s, t) => s + (t.points ?? 0), 0);
  const ptsTotal = tasks.reduce((s, t) => s + (t.points ?? 0), 0);
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const sprint = demoSprints.find(
    (s) => s.projectId === projectId && s.status === "active"
  );
  return { tasks, done, inProg, ptsDone, ptsTotal, pct, sprint };
};

const daysLeft = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  return diff < 0 ? "Ended" : diff === 0 ? "Today" : `${diff}d left`;
};

// ─── Create Project Modal ─────────────────────────────────
interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const [step, setStep] = useState(1);
  const [teamSearch, setTeamSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    label: "",
    priority: "medium",
    type: "software",
    startDate: "",
    dueDate: "",
    memberIds: [] as string[],
    teamId: "",
    prefix: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, val: unknown) =>
    setForm((f) => ({ ...f, [field]: val }));

  const toggleMember = (id: string) =>
    update(
      "memberIds",
      form.memberIds.includes(id)
        ? form.memberIds.filter((m) => m !== id)
        : [...form.memberIds, id]
    );

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) {
      e.name = "Project name is required";
    }
    if (form.name.length > 60) {
      e.name = "Max 60 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };
  const handleCreate = () => {
    onClose();
  };

  const selectedLabel = PROJECT_LABELS.find((l) => l.id === form.label);
  const selectedTeam = demoTeams.find((t) => t.id === form.teamId);
  const selectedPriority = PROJECT_PRIORITIES.find(
    (p) => p.id === form.priority
  );

  const filteredTeams = demoTeams.filter(
    (t) =>
      !teamSearch || t.name.toLowerCase().includes(teamSearch.toLowerCase())
  );
  const filteredMembers = demoMembers.filter(
    (m) =>
      !memberSearch ||
      m.user.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.user.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <CustomModal
      isOpen
      onClose={onClose}
      title={step === 1 ? "New Project" : "Team & Members"}
      description={
        step === 1
          ? "Set up the basics for your new project."
          : "Assign a team and invite members to this project."
      }
      className="sm:max-w-xl"
    >
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
                step === s
                  ? "border border-[#8735C9]/40 bg-[#8735C9]/20 text-[#c084fc]"
                  : step > s
                    ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                    : "border border-[#1e2a4a] text-[#4B5578]"
              )}
            >
              {step > s ? <Check className="h-3 w-3" /> : <span>{s}</span>}
              <span>{s === 1 ? "Basics" : "Team & Members"}</span>
            </div>
            {s < 2 && <div className="h-px flex-1 bg-[#1e2a4a]" />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 1: Basics ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="max-h-[55vh] space-y-5 overflow-y-auto pr-1">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  update("name", e.target.value);
                  update("prefix", e.target.value.slice(0, 3).toUpperCase());
                }}
                placeholder="e.g. Website Redesign"
                className={cn(
                  "w-full rounded-xl border bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578]",
                  errors.name
                    ? "border-red-400/50 focus:border-red-400"
                    : "border-[#1e2a4a] focus:border-[#8735C9]"
                )}
              />
              {errors.name && (
                <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="What is this project about? Goals, scope, context…"
                rows={3}
                className="w-full resize-none rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
              />
            </div>

            {/* Identifier + Label */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                  Identifier
                </label>
                <input
                  value={form.prefix}
                  onChange={(e) =>
                    update("prefix", e.target.value.toUpperCase().slice(0, 5))
                  }
                  placeholder="PRJ"
                  className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 font-mono text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                />
                <p className="mt-1 text-[10px] text-[#4B5578]">
                  Used as task prefix, e.g. PRJ-1
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                  Label
                </label>
                <div className="relative">
                  <select
                    value={form.label}
                    onChange={(e) => update("label", e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#8735C9]"
                  >
                    <option value="">No label</option>
                    {PROJECT_LABELS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
                </div>
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                Project Type
              </label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => update("type", t.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                      form.type === t.id
                        ? "border-[#8735C9] bg-[#8735C9]/15 text-[#c084fc]"
                        : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b] hover:text-white"
                    )}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                Priority
              </label>
              <div className="flex gap-2">
                {PROJECT_PRIORITIES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => update("priority", p.id)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all",
                      form.priority === p.id
                        ? "border-[#8735C9] bg-[#8735C9]/15 text-white"
                        : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b]"
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", p.dot)} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors [color-scheme:dark] focus:border-[#8735C9]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => update("dueDate", e.target.value)}
                  className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors [color-scheme:dark] focus:border-[#8735C9]"
                />
              </div>
            </div>

            {/* Label color preview */}
            {selectedLabel && (
              <div className="flex items-center gap-2 rounded-lg border border-[#1e2a4a] bg-[#07112b] px-3 py-2">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: selectedLabel.color }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: selectedLabel.color }}
                >
                  {selectedLabel.label}
                </span>
                <span className="ml-auto text-[10px] text-[#4B5578]">
                  Label preview
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
            <Button
              onClick={handleNext}
              className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Team & Members ── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="max-h-[55vh] space-y-5 overflow-y-auto pr-1">
            {/* Team — searchable + scrollable */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                Assign Team{" "}
                <span className="font-normal normal-case text-[#4B5578]">
                  (optional)
                </span>
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
                <input
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Search teams…"
                  className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                />
              </div>
              <div className="max-h-[180px] space-y-1.5 overflow-y-auto pr-0.5">
                {filteredTeams.length === 0 && (
                  <p className="py-3 text-center text-[11px] text-[#4B5578]">
                    No teams match your search.
                  </p>
                )}
                {filteredTeams.map((team) => {
                  const sel = form.teamId === team.id;
                  return (
                    <button
                      key={team.id}
                      onClick={() => update("teamId", sel ? "" : team.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                        sel
                          ? "border-[#8735C9] bg-[#8735C9]/10"
                          : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg",
                          sel ? "bg-[#8735C9]/20" : "bg-[#132353]"
                        )}
                      >
                        <Users
                          className={cn(
                            "h-3.5 w-3.5",
                            sel ? "text-[#c084fc]" : "text-[#6b7db3]"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            "text-xs font-medium",
                            sel ? "text-white" : "text-[#8b9cc8]"
                          )}
                        >
                          {team.name}
                        </p>
                        <p className="text-[10px] text-[#4B5578]">
                          {team.memberIds.length} members
                        </p>
                      </div>
                      {sel && <Check className="h-3.5 w-3.5 text-[#c084fc]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Members — searchable + scrollable */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                Invite Members{" "}
                <span className="font-normal normal-case text-[#4B5578]">
                  (optional)
                </span>
              </label>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
                <input
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search members…"
                  className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                />
              </div>
              <div className="max-h-[220px] space-y-1.5 overflow-y-auto pr-0.5">
                {filteredMembers.length === 0 && (
                  <p className="py-3 text-center text-[11px] text-[#4B5578]">
                    No members match your search.
                  </p>
                )}
                {filteredMembers.map((m) => {
                  const sel = form.memberIds.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMember(m.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all",
                        sel
                          ? "border-[#8735C9] bg-[#8735C9]/10"
                          : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                      )}
                    >
                      <Avatar className="h-7 w-7 flex-shrink-0 border border-[#1e2a4a]">
                        <AvatarFallback className="bg-[#8735C9]/20 text-[10px] font-bold text-[#c084fc]">
                          {initials(m.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-xs font-medium",
                            sel ? "text-white" : "text-[#8b9cc8]"
                          )}
                        >
                          {m.user.name}
                        </p>
                        <p className="text-[10px] capitalize text-[#4B5578]">
                          {m.role}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
                          sel
                            ? "border-[#8735C9] bg-[#8735C9]"
                            : "border-[#293d6b]"
                        )}
                      >
                        {sel && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {form.memberIds.length > 0 && (
                <p className="mt-2 text-[11px] text-[#c084fc]">
                  {form.memberIds.length} member
                  {form.memberIds.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Summary card */}
            <div className="space-y-2 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7db3]">
                Summary
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <FolderKanban className="h-4 w-4 text-[#c084fc]" />
                <p className="text-sm font-semibold text-white">
                  {form.name || "Untitled Project"}
                </p>
                {selectedLabel && (
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      color: selectedLabel.color,
                      borderColor: `${selectedLabel.color}30`,
                      backgroundColor: `${selectedLabel.color}10`,
                    }}
                  >
                    {selectedLabel.label}
                  </span>
                )}
                {selectedPriority && (
                  <span className="flex items-center gap-1 rounded-full border border-[#1e2a4a] px-2 py-0.5 text-[10px] text-[#8b9cc8]">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        selectedPriority.dot
                      )}
                    />
                    {selectedPriority.label}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6b7db3]">
                {selectedTeam && (
                  <>
                    <Users className="h-3 w-3" />
                    <span>{selectedTeam.name}</span>
                  </>
                )}
                {form.memberIds.length > 0 && (
                  <>
                    <Users className="h-3 w-3" />
                    <span>{form.memberIds.length} members invited</span>
                  </>
                )}
                {form.startDate && (
                  <>
                    <Calendar className="h-3 w-3" />
                    <span>Starts {form.startDate}</span>
                  </>
                )}
                {form.dueDate && (
                  <>
                    <Calendar className="h-3 w-3" />
                    <span>Due {form.dueDate}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* end scrollable */}

          <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
            >
              ← Back
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90"
            >
              <Zap className="h-4 w-4" />
              Create Project
            </Button>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

// ─── Project Card (grid view) ─────────────────────────────
const ProjectCard = ({
  project,
  onEnter,
}: {
  project: (typeof demoProjects)[0];
  onEnter: () => void;
}) => {
  const stats = projectStats(project.id);
  const members = demoMembers.slice(0, 3); // in real app: filter by project membership

  return (
    <div
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635] transition-all duration-200 hover:border-[#293d6b]"
      onClick={onEnter}
    >
      {/* top gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Main content */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-[0_2px_8px_rgba(135,53,201,0.3)]">
                <FolderKanban className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white transition-colors group-hover:text-[#c084fc]">
                  {project.name}
                </p>
                <p className="text-[10px] text-[#4B5578]">
                  Created{" "}
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                project.status === "active"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3]"
              )}
            >
              {project.status === "active" ? "Active" : "Archived"}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-[#6b7db3]">
          {project.description ?? "No description."}
        </p>

        {/* Sprint badge */}
        {stats.sprint && (
          <div className="flex items-center gap-2 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-3 py-2">
            <Zap className="h-3 w-3 flex-shrink-0 text-amber-400" />
            <span className="flex-1 truncate text-[11px] font-medium text-amber-300">
              {stats.sprint.name}
            </span>
            <span className="flex-shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[10px] text-amber-400/70">
              {daysLeft(stats.sprint.endDate)}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              icon: BookOpen,
              val: stats.tasks.length,
              label: "Tasks",
              color: "#60a5fa",
            },
            {
              icon: CheckCircle2,
              val: stats.done.length,
              label: "Done",
              color: "#34d399",
            },
            {
              icon: Star,
              val: `${stats.ptsDone}/${stats.ptsTotal}`,
              label: "Pts",
              color: "#c084fc",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-0.5 rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2"
            >
              <s.icon className="mb-0.5 h-3 w-3" style={{ color: s.color }} />
              <p className="text-xs font-bold text-white">{s.val}</p>
              <p className="text-[9px] text-[#4B5578]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7db3]">Progress</span>
            <span className="text-[10px] font-bold text-white">
              {stats.pct}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#07112b]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${stats.pct}%`,
                background:
                  stats.pct >= 80
                    ? "linear-gradient(90deg,#8735C9,#34d399)"
                    : "linear-gradient(90deg,#8735C9,#6a29a0)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#1e2a4a] px-5 py-3">
        {/* Member avatars */}
        <div className="flex -space-x-2">
          {members.map((m, i) => (
            <Avatar
              key={m.id}
              className="h-6 w-6 flex-shrink-0 border-2 border-[#0C1635]"
              style={{ zIndex: 10 - i }}
            >
              <AvatarFallback className="bg-[#8735C9]/30 text-[9px] font-bold text-[#c084fc]">
                {initials(m.user.name)}
              </AvatarFallback>
            </Avatar>
          ))}
          {demoMembers.length > 3 && (
            <div className="z-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0C1635] bg-[#132353]">
              <span className="text-[8px] font-bold text-[#8b9cc8]">
                +{demoMembers.length - 3}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
          className="group/btn flex items-center gap-1 text-[11px] font-medium text-[#8b9cc8] transition-colors hover:text-[#c084fc]"
        >
          Open{" "}
          <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Project Row (list view) ──────────────────────────────
const ProjectRow = ({
  project,
  onEnter,
}: {
  project: (typeof demoProjects)[0];
  onEnter: () => void;
}) => {
  const stats = projectStats(project.id);
  const members = demoMembers.slice(0, 3);

  return (
    <div
      className="group flex cursor-pointer items-center gap-4 rounded-xl border border-[#1e2a4a] bg-[#0C1635] px-5 py-4 transition-all hover:border-[#293d6b] hover:bg-[#0f1d3d]"
      onClick={onEnter}
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0]">
        <FolderKanban className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#c084fc]">
          {project.name}
        </p>
        <p className="truncate text-[11px] text-[#6b7db3]">
          {project.description}
        </p>
      </div>

      {/* Sprint */}
      <div className="hidden min-w-[130px] items-center gap-1.5 md:flex">
        {stats.sprint ? (
          <>
            <Zap className="h-3 w-3 text-amber-400" />
            <span className="truncate text-[11px] text-amber-300">
              {stats.sprint.name}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-[#4B5578]">No active sprint</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="hidden min-w-[100px] items-center gap-2 md:flex">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#07112b]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8735C9] to-[#60a5fa]"
            style={{ width: `${stats.pct}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-[10px] font-bold text-white">
          {stats.pct}%
        </span>
      </div>

      {/* Pts */}
      <div className="hidden min-w-[70px] items-center gap-1.5 lg:flex">
        <Star className="h-3 w-3 text-[#c084fc]" />
        <span className="text-[11px] text-[#8b9cc8]">
          {stats.ptsDone}/{stats.ptsTotal} pts
        </span>
      </div>

      {/* Members */}
      <div className="hidden flex-shrink-0 -space-x-1.5 md:flex">
        {members.map((m) => (
          <Avatar key={m.id} className="h-6 w-6 border-2 border-[#0C1635]">
            <AvatarFallback className="bg-[#8735C9]/30 text-[9px] font-bold text-[#c084fc]">
              {initials(m.user.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>

      {/* Status */}
      <span
        className={cn(
          "hidden flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:block",
          project.status === "active"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-[#1e2a4a] text-[#6b7db3]"
        )}
      >
        {project.status === "active" ? "Active" : "Archived"}
      </span>

      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#4B5578] transition-colors group-hover:text-[#c084fc]" />
    </div>
  );
};

// ─── Main ProjectsView ────────────────────────────────────
export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onEnterProject,
}) => {
  const [view, setView] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = demoProjects.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalTasks = demoTasks.length;
  const doneTasks = demoTasks.filter((t) => t.status === "done").length;
  const totalPts = demoTasks.reduce((s, t) => s + (t.points ?? 0), 0);
  const donePts = demoTasks
    .filter((t) => t.status === "done")
    .reduce((s, t) => s + (t.points ?? 0), 0);
  const activeSprints = demoSprints.filter((s) => s.status === "active").length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Projects
          </h1>
          <p className="mt-0.5 text-sm text-[#6b7db3]">
            {demoProjects.filter((p) => p.status === "active").length} active ·{" "}
            {demoProjects.length} total
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* ── Summary stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Total Projects",
            value: demoProjects.length,
            icon: FolderKanban,
            color: "#8735C9",
          },
          {
            label: "Tasks Done",
            value: `${doneTasks}/${totalTasks}`,
            icon: CheckCircle2,
            color: "#34d399",
          },
          {
            label: "Story Points",
            value: `${donePts}/${totalPts}`,
            icon: Star,
            color: "#c084fc",
          },
          {
            label: "Active Sprints",
            value: activeSprints,
            icon: Zap,
            color: "#f59e0b",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#0C1635] px-4 py-3"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${s.color}15` }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-base font-black text-white">{s.value}</p>
              <p className="text-[10px] text-[#6b7db3]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[180px] max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-xl border border-[#1e2a4a] bg-[#0C1635] py-2 pl-9 pr-4 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
          {(["all", "active", "archived"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all",
                filter === f
                  ? "bg-[#8735C9] text-white"
                  : "text-[#6b7db3] hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
          {(
            [
              ["grid", LayoutGrid],
              ["list", List],
            ] as [ViewMode, React.ElementType][]
          ).map(([v, Icon]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-lg p-1.5 transition-all",
                view === v
                  ? "bg-[#8735C9] text-white"
                  : "text-[#6b7db3] hover:text-white"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects ───────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1e2a4a] bg-[#0C1635]">
            <FolderKanban className="h-6 w-6 text-[#4B5578]" />
          </div>
          <p className="mb-1 text-sm font-semibold text-white">
            No projects found
          </p>
          <p className="text-xs text-[#4B5578]">
            Try adjusting your search or filter.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEnter={() => onEnterProject(p.id)}
            />
          ))}
          {/* Empty slot — add new */}
          <button
            onClick={() => setCreateOpen(true)}
            className="group flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#1e2a4a] bg-[#0C1635] p-6 transition-all hover:border-[#8735C9]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-[#1e2a4a] transition-colors group-hover:border-[#8735C9]">
              <Plus className="h-5 w-5 text-[#4B5578] group-hover:text-[#8735C9]" />
            </div>
            <span className="text-xs font-medium text-[#6b7db3] transition-colors group-hover:text-white">
              New project
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* List header */}
          <div className="hidden items-center gap-4 px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#4B5578] md:flex">
            <div className="w-9 flex-shrink-0" />
            <div className="flex-1">Project</div>
            <div className="min-w-[130px]">Sprint</div>
            <div className="min-w-[100px]">Progress</div>
            <div className="hidden min-w-[70px] lg:block">Points</div>
            <div className="hidden min-w-[80px] md:block">Members</div>
            <div className="hidden min-w-[60px] sm:block">Status</div>
            <div className="w-4" />
          </div>
          {filtered.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              onEnter={() => onEnterProject(p.id)}
            />
          ))}
        </div>
      )}

      {/* ── Create Project Modal ─────────────────────────── */}
      {createOpen && (
        <CreateProjectModal onClose={() => setCreateOpen(false)} />
      )}
    </div>
  );
};
