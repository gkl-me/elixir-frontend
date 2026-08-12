"use client";

import React, { useMemo, useState, useEffect, useCallback, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  BookOpen,
  Bug,
  Plus,
  AlignLeft,
  Users,
  Check,
  Zap,
  ChevronRight,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { WorkspaceProject, initials, grad } from "./shared";
import { Task } from "@/data/demoData";
import { CustomForm } from "@/components/form/CustomForm";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { createIssueAction } from "@/app/actions/issue.action";
import { toastHandler } from "@/lib/toastHandler";
import { useDebounce } from "@/hooks/useDebounce";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { IssuePriority, IssueStatus } from "@/types/IIssueType";
import { useApi } from "@/hooks/useApi";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

interface CreateIssueModalProps {
  project: WorkspaceProject;
  onClose: () => void;
  onCreateIssue?: (newIssue: Partial<Task>) => void;
  onSuccess?: () => void;
}

const STEPS = ["Basics", "Estimation", "Assignment"];

const PRIORITIES = [
  { id: "urgent", label: "Urgent", dot: "bg-red-500" },
  { id: "high", label: "High", dot: "bg-orange-500" },
  { id: "medium", label: "Medium", dot: "bg-amber-500" },
  { id: "low", label: "Low", dot: "bg-slate-500" },
] as const;

const STATUSES = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_review", label: "In Review" },
  { id: "done", label: "Done" },
] as const;

const STORY_POINTS = [1, 2, 3, 5, 8, 13];

// ─── Zod Schema for Issue Creation ──────────────────────────────────────────────
export const CreateIssueSchema = z.object({
  type: z.enum(["story", "bug"]).default("story"),
  title: z.string().min(2, "Summary title must be at least 2 characters"),
  description: z.string().optional().default(""),
  storyPoints: z.number().min(1, "Story points must be at least 1").default(3),
  priority: z.enum(["urgent", "high", "medium", "low"]).default("medium"),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  assignee: z.string().optional().default(""),
});

export type CreateIssueFormValues = z.infer<typeof CreateIssueSchema>;

const DEMO_TEAM_MEMBERS: TeamMember[] = [
  { id: "u1", name: "Alice Smith", email: "alice@example.com", role: "Frontend Lead" },
  { id: "u2", name: "Bob Johnson", email: "bob@example.com", role: "Backend Developer" },
  { id: "u3", name: "Charlie Dave", email: "charlie@example.com", role: "Full Stack Engineer" },
  { id: "u4", name: "Diana Park", email: "diana@example.com", role: "UI/UX Designer" },
  { id: "u5", name: "Ethan Morris", email: "ethan@example.com", role: "DevOps Engineer" },
];

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  project,
  onClose,
  onCreateIssue,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  const form = useForm<CreateIssueFormValues>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: {
      type: "story",
      title: "",
      description: "",
      storyPoints: 3,
      priority: "medium",
      status: "todo",
      assignee: (project as any)?.memberNames?.[0] || "",
    },
  });

  const { watch, setValue, trigger, formState } = form;
  const formValues = watch();

  // Team members loading & pagination state
  const [members, setMembers] = useState<TeamMember[]>(DEMO_TEAM_MEMBERS);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const debouncedMemberSearch = useDebounce(memberSearch, 300);
  const [memberPage, setMemberPage] = useState(1);
  const MEMBERS_PER_PAGE = 5;
  const [totalCount, setTotalCount] = useState(DEMO_TEAM_MEMBERS.length);


  // Load team members based on project.teams (array of team IDs)
  const fetchProjectTeamMembers = useCallback(async () => {
    if (!workspaceId) {
      return;
    }
    setIsLoadingMembers(true);
    try {
      const fetchedMembers: TeamMember[] = [];
      const teamIds = project.teams || [];

      if (teamIds.length > 0) {
        await Promise.all(
          teamIds.map(async (teamId) => {
            try {
              const res = await axios.get(NEXT_API_ROUTES.GET_WORKSPACE_TEAM(teamId), {
                params: { workspaceId },
              });
              if (res.data?.success && res.data?.data?.team?.members) {
                fetchedMembers.push(...res.data.data.team.members);
              }
            } catch {
              // Ignore fetch failure per team
            }
          })
        );
      }

      if (fetchedMembers.length > 0) {
        const uniqueMap = new Map<string, TeamMember>();
        fetchedMembers.forEach((m) => {
          const key = m.id || m.email || m.name;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, m);
          }
        });
        const list = Array.from(uniqueMap.values());
        setMembers(list);
        setTotalCount(list.length);
      } else {
        setMembers(DEMO_TEAM_MEMBERS);
        setTotalCount(DEMO_TEAM_MEMBERS.length);
      }

    } catch {
      setMembers(DEMO_TEAM_MEMBERS);
      setTotalCount(DEMO_TEAM_MEMBERS.length);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [workspaceId, project.teams]);

  useEffect(() => {
    fetchProjectTeamMembers();
  }, [fetchProjectTeamMembers]);

  // Default selection if assignee empty
  useEffect(() => {
    if (!formValues.assignee && members.length > 0) {
      setValue("assignee", members[0].name, { shouldValidate: true });
    }
  }, [members, formValues.assignee, setValue]);



  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 0) {
      const valid = await trigger(["type", "title", "description"]);
      if (!valid) {
        return;
      }
    } else if (step === 1) {
      const valid = await trigger(["storyPoints", "priority", "status"]);
      if (!valid) {
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (values: CreateIssueFormValues) => {
    if (!workspaceId) {
      toastHandler({ success: false, error: "Workspace ID is required" });
      return;
    }

    startTransition(async () => {
      const res = await createIssueAction({
        workspaceId,
        projectId: project.id,
        title: values.title,
        type: values.type,
        description: values.description || "",
        storyPoints: values.storyPoints,
        priority: values.priority,
        status: values.status,
        assignee: values.assignee || "",
        reporter: "",
      });

      toastHandler(res);
      if (res.success) {
        onCreateIssue?.({
          id: `task-${Date.now()}`,
          projectId: project.id,
          title: values.title.trim(),
          description: values.description?.trim() || "",
          type: values.type,
          status: values.status as Task["status"],
          points: values.storyPoints,
          assigneeId: values.assignee,
        });
        onSuccess?.();
        onClose();
      }
    });
  };

  const selectedPriorityObj = PRIORITIES.find((p) => p.id === formValues.priority);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0a1628] shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-[#1e2a4a] px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0] shadow-md">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white">Create New Issue</h3>
            <p className="text-[11px] text-[#6b7db3]">
              Step {step + 1} of {STEPS.length} — <span className="font-semibold text-[#c084fc]">{STEPS[step]}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6b7db3] transition-colors hover:bg-[#1e2a4a] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Step Progress Indicator ────────────────────────────────────── */}
        <div className="flex border-b border-[#1e2a4a] bg-[#07112b]">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors border-b-2",
                i === step
                  ? "border-[#8735C9] bg-[#8735C9]/10 text-white"
                  : i < step
                    ? "border-emerald-500/50 text-emerald-400"
                    : "border-transparent text-[#4B5578]"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                  i < step
                    ? "bg-emerald-400 text-[#07112b]"
                    : i === step
                      ? "bg-[#8735C9] text-white"
                      : "bg-[#1e2a4a] text-[#4B5578]"
                )}
              >
                {i < step ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>

        {/* ── CustomForm Container ───────────────────────────────────────── */}
        <CustomForm<CreateIssueFormValues>
          schema={CreateIssueSchema}
          form={form}
          onSubmit={handleSubmit}
          fields={[]}
          hideSubmitButton
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* ── Modal Step Body ───────────────────────────────────────────── */}
          <div className="flex-1 space-y-5 overflow-y-auto p-6 min-h-[320px]">
            {/* ════════════ Step 0: Basics ═════════════════════════════════ */}
            {step === 0 && (
              <div className="space-y-5">
                {/* Issue Type */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    Issue Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("type", "story", { shouldValidate: true })}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        formValues.type === "story"
                          ? "border-[#8735C9] bg-[#8735C9]/15 text-white shadow-sm"
                          : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b] hover:text-white"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                          formValues.type === "story" ? "bg-[#8735C9]/30 text-[#c084fc]" : "bg-[#132353] text-[#6b7db3]"
                        )}
                      >
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">User Story</p>
                        <p className="text-[10px] text-[#4B5578]">Feature / Improvement</p>
                      </div>
                      {formValues.type === "story" && <Check className="h-4 w-4 text-[#c084fc]" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setValue("type", "bug", { shouldValidate: true })}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        formValues.type === "bug"
                          ? "border-red-500/60 bg-red-500/15 text-white shadow-sm"
                          : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b] hover:text-white"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                          formValues.type === "bug" ? "bg-red-500/20 text-red-400" : "bg-[#132353] text-[#6b7db3]"
                        )}
                      >
                        <Bug className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">Defect / Bug</p>
                        <p className="text-[10px] text-[#4B5578]">Problem / Exception</p>
                      </div>
                      {formValues.type === "bug" && <Check className="h-4 w-4 text-red-400" />}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    Summary Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={formValues.title}
                    onChange={(e) => setValue("title", e.target.value, { shouldValidate: true })}
                    placeholder="e.g. Implement workspace authentication middleware"
                    className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                  />
                  {formState.errors.title && (
                    <p className="mt-1 text-xs text-red-400">
                      {formState.errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    <AlignLeft className="h-3 w-3" />
                    Description & Acceptance Criteria
                  </label>
                  <textarea
                    value={formValues.description}
                    onChange={(e) => setValue("description", e.target.value, { shouldValidate: true })}
                    placeholder="Provide context, acceptance criteria, or reproduction steps…"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                  />
                </div>
              </div>
            )}

            {/* ════════════ Step 1: Estimation & Priority ══════════════════ */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Story Points */}
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    <span>Story Points (Estimation)</span>
                    <span className="font-mono text-xs font-bold text-[#c084fc]">{formValues.storyPoints} pts</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {STORY_POINTS.map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setValue("storyPoints", pt, { shouldValidate: true })}
                        className={cn(
                          "flex h-10 flex-1 min-w-[50px] items-center justify-center rounded-xl border font-mono text-xs font-bold transition-all",
                          formValues.storyPoints === pt
                            ? "border-[#8735C9] bg-[#8735C9] text-white shadow-md scale-105"
                            : "border-[#1e2a4a] bg-[#07112b] text-[#8b9cc8] hover:border-[#293d6b] hover:text-white"
                        )}
                      >
                        {pt} {pt === 1 ? "pt" : "pts"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIORITIES.map((p) => {
                      const sel = formValues.priority === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setValue("priority", p.id, { shouldValidate: true })}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-medium transition-all",
                            sel
                              ? "border-[#8735C9] bg-[#8735C9]/15 text-white"
                              : "border-[#1e2a4a] bg-[#07112b] text-[#8b9cc8] hover:border-[#293d6b]"
                          )}
                        >
                          <span className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", p.dot)} />
                          <span>{p.label} Priority</span>
                          {sel && <Check className="ml-auto h-3.5 w-3.5 text-[#c084fc]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    Initial Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUSES.map((s) => {
                      const sel = formValues.status === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setValue("status", s.id, { shouldValidate: true })}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all",
                            sel
                              ? "border-[#8735C9] bg-[#8735C9]/15 text-white"
                              : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b]"
                          )}
                        >
                          {s.label}
                          {sel && <Check className="ml-auto h-3 w-3 text-[#c084fc]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════════════ Step 2: Assignment & Review ════════════════════ */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Member Search & Assignment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                      <Users className="h-3 w-3" />
                      Assignee
                    </label>
                    <span className="text-[10px] text-[#6b7db3]">
                      Selected: <strong className="text-white">{formValues.assignee || "Unassigned"}</strong>
                    </span>
                  </div>

                  {/* Search Input */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
                    <input
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setMemberPage(1);
                      }}
                      placeholder="Search team members by name or email…"
                      className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                    />
                    {memberSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setMemberSearch("");
                          setMemberPage(1);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5578] hover:text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Member selection grid */}
                  <div className="max-h-[170px] space-y-1.5 overflow-y-auto pr-0.5">
                    {isLoadingMembers ? (
                      <div className="flex items-center justify-center py-8 text-xs text-[#6b7db3]">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#8735C9]" />
                        Loading project team members…
                      </div>
                    ) : members.length === 0 ? (
                      <p className="py-6 text-center text-[11px] text-[#4B5578]">
                        No team members match your search.
                      </p>
                    ) : (
                      members.map((m) => {
                        const sel = formValues.assignee === m.name || formValues.assignee === m.id;
                        return (
                          <button
                            key={m.id || m.name}
                            type="button"
                            onClick={() => setValue("assignee", m.name, { shouldValidate: true })}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-all",
                              sel
                                ? "border-[#8735C9] bg-[#8735C9]/15 text-white"
                                : "border-[#1e2a4a] bg-[#07112b] text-[#8b9cc8] hover:border-[#293d6b]"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-bold text-white shadow-sm",
                                grad(m.name)
                              )}
                            >
                              {initials(m.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-semibold">{m.name}</p>
                              <p className="truncate text-[10px] text-[#4B5578]">
                                {m.email || m.role || "Team Member"}
                              </p>
                            </div>
                            {sel && <Check className="h-4 w-4 text-[#c084fc]" />}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination if multiple pages exist */}
                  <div className="mt-2 flex justify-end">
                    <Pagination
                      currentPage={memberPage}
                      totalPages={totalCount / MEMBERS_PER_PAGE}
                      onPageChange={(page) => setMemberPage(page)}
                    />
                  </div>
                </div>

                {/* Summary Preview Card */}
                <div className="rounded-xl border border-[#1e2a4a] bg-[#07112b] p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#6b7db3]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[#c084fc]" /> Preview
                    </span>
                    <span>[{project.key || "ELX"}]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#8735C9]/20 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#c084fc] uppercase">
                      {formValues.type}
                    </span>
                    <p className="truncate text-xs font-bold text-white">
                      {formValues.title || "Untitled Issue"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#6b7db3]">
                    <span>Estimate: <strong className="text-white">{formValues.storyPoints} pts</strong></span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <span className={cn("h-1.5 w-1.5 rounded-full", selectedPriorityObj?.dot)} />
                      {selectedPriorityObj?.label} Priority
                    </span>
                    <span>·</span>
                    <span>Assignee: <strong className="text-white">{formValues.assignee || "Unassigned"}</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Modal Footer Controls ─────────────────────────────────────── */}
          <div className="flex items-center gap-2 border-t border-[#1e2a4a] px-6 py-4">
            {step > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={isPending}
                className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
              >
                ← Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
              >
                Cancel
              </Button>
            )}

            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={step === 0 && formValues.title.trim().length < 2}
                className="ml-auto gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-xs font-semibold text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90 disabled:opacity-40"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending || formValues.title.trim().length < 2}
                className="ml-auto gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-xs font-semibold text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90 disabled:opacity-40"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5" />
                    Create Issue
                  </>
                )}
              </Button>
            )}
          </div>
        </CustomForm>
      </div>
    </div>
  );
};
