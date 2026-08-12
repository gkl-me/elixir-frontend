"use client";

import React, { useMemo, useState, useEffect, useCallback, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FolderKanban,
  X,
  Check,
  ChevronRight,
  Zap,
  Calendar,
  Users,
  AlignLeft,
  Tag,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { tagColor, ProjectPriority } from "./shared";
import { CustomForm } from "@/components/form/CustomForm";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";
import { createProjectAction } from "@/app/actions/project.action";
import { toastHandler } from "@/lib/toastHandler";
import { useDebounce } from "@/hooks/useDebounce";
import { WorkspaceTeamsList } from "@/types/IWorkspaceType";
import { NEXT_API_ROUTES } from "@/constants/routeHandler";
import { useApi } from "@/hooks/useApi";

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

// ─── Step config ───────────────────────────────────────────────────────────────
const STEPS = ["Basics", "Details", "Teams"];

const ALL_TAGS = [
  "Frontend",
  "Backend",
  "Mobile",
  "Design",
  "DevOps",
  "Research",
  "Marketing",
  "Data",
  "API",
  "Analytics",
  "Security",
  "Infrastructure",
  "QA",
  "Docs",
];

const PRIORITIES = [
  { id: "urgent", label: "Urgent", dot: "bg-red-500" },
  { id: "high", label: "High", dot: "bg-orange-500" },
  { id: "medium", label: "Medium", dot: "bg-amber-500" },
  { id: "low", label: "Low", dot: "bg-slate-500" },
] as const;

// ─── Zod Schema matching ICreateProjectDto / CreateProjectData ─────────────────
export const CreateProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).default([]),
  priority: z.enum(["urgent", "high", "medium", "low"]).default("medium"),
  startDate: z.coerce.date().default(() => new Date()),
  dueDate: z.coerce.date().default(() => new Date()),
  teams: z.array(z.string()).default([]),
});

export type CreateProjectFormValues = z.infer<typeof CreateProjectSchema>;


const formatDateForInput = (d: Date | string | undefined): string => {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
};

export const CreateProjectModal = ({ onClose, onSuccess }: CreateProjectModalProps) => {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();

  const workspaceId = useWorkspaceStore((s) => s.context?.workspaceId ?? "");

  // Teams listing state
  const [teamSearch, setTeamSearch] = useState("");
  const debouncedSearch = useDebounce(teamSearch, 400);
  const [teams, setTeams] = useState<WorkspaceTeamsList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const TEAMS_PER_PAGE = 5;

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      priority: "medium",
      startDate: new Date(),
      dueDate: new Date(),
      teams: [],
    },
  });

  const { watch, setValue, trigger, formState } = form;
  const formValues = watch();

  const { execute } = useApi({
    url: NEXT_API_ROUTES.GET_WORKSPACE_TEAMS,
    method: "GET",
  });

  // Fetch teams from backend workspaceService.listTeams
  const fetchTeams = useCallback(async () => {
    if (!workspaceId) return;
    setIsLoadingTeams(true);
    try {
      const res = await execute({
        params: {
          workspaceId,
          search: debouncedSearch,
          page: currentPage,
          limit: TEAMS_PER_PAGE,
        }
      });

      if (res.success) {
        setTeams(res.data.teams);
        setTotalCount(res.data.totalCount);
      }

    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setIsLoadingTeams(false);
    }
  }, [workspaceId, debouncedSearch, currentPage]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Tag helper
  const toggleTag = (tag: string) => {
    const currentTags = formValues.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    setValue("tags", newTags, { shouldValidate: true });
  };

  // Team helper
  const toggleTeam = (id: string) => {
    const currentTeams = formValues.teams || [];
    const newTeams = currentTeams.includes(id)
      ? currentTeams.filter((t) => t !== id)
      : [...currentTeams, id];
    setValue("teams", newTeams, { shouldValidate: true });
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (step === 0) {
      const valid = await trigger(["name", "description"]);
      if (!valid) return;
    } else if (step === 1) {
      const valid = await trigger(["tags", "priority", "startDate", "dueDate"]);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (values: CreateProjectFormValues) => {
    if (!workspaceId) {
      toastHandler({ success: false, error: "Workspace ID is required" });
      return;
    }

    startTransition(async () => {
      const res = await createProjectAction({
        workspaceId,
        name: values.name,
        description: values.description || "",
        tags: values.tags,
        priority: values.priority as ProjectPriority,
        startDate: values.startDate,
        dueDate: values.dueDate,
        teams: values.teams,
      });

      toastHandler(res);
      if (res.success) {
        onClose();
        onSuccess?.();
      }
    });
  };

  const selectedTeams = useMemo(() => {
    return teams.filter((t) => formValues.teams.includes(t.id));
  }, [teams, formValues.teams]);

  const selectedPriority = PRIORITIES.find((p) => p.id === formValues.priority);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0a1628] shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-[#1e2a4a] px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#8735C9] to-[#6a29a0]">
            <FolderKanban className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Create New Project</p>
            <p className="text-[10px] text-[#4B5578]">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
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

        {/* ── Step indicator ───────────────────────────────────────────────── */}
        <div className="flex border-b border-[#1e2a4a]">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors",
                i < step
                  ? "text-[#34d399]"
                  : i === step
                    ? "text-white"
                    : "text-[#4B5578]"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px]",
                  i < step
                    ? "bg-[#34d399] text-[#07112b]"
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

        {/* ── Form Container using CustomForm ────────────────────────────── */}
        <CustomForm<CreateProjectFormValues>
          schema={CreateProjectSchema}
          form={form}
          onSubmit={handleSubmit}
          fields={[]}
          hideSubmitButton
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* ── Body ────────────────────────────────────────────────────────── */}
          <div className="flex-1 space-y-5 overflow-y-auto p-6">
            {/* ════ Step 0: Basics ═══════════════════════════════════════════ */}
            {step === 0 && (
              <>
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={formValues.name}
                    onChange={(e) => setValue("name", e.target.value, { shouldValidate: true })}
                    placeholder="e.g. Elixir Platform"
                    className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                  />
                  {formState.errors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    <AlignLeft className="h-3 w-3" />
                    Description
                    <span className="font-normal normal-case text-[#4B5578]">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={formValues.description}
                    onChange={(e) => setValue("description", e.target.value)}
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-[#1e2a4a] bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                  />
                </div>
              </>
            )}

            {/* ════ Step 1: Details ══════════════════════════════════════════ */}
            {step === 1 && (
              <>
                {/* Tags — multi-select */}
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    <span className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      Tags
                      <span className="font-normal normal-case text-[#4B5578]">
                        (select multiple)
                      </span>
                    </span>
                    {formValues.tags.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setValue("tags", [], { shouldValidate: true })}
                        className="text-[10px] font-medium normal-case tracking-normal text-[#6b7db3] hover:text-red-400"
                      >
                        Clear all
                      </button>
                    )}
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {ALL_TAGS.map((tag) => {
                      const sel = formValues.tags.includes(tag);
                      const swatch = tagColor(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                            sel
                              ? "scale-105 shadow-sm"
                              : "border-[#1e2a4a] text-[#6b7db3] hover:border-[#293d6b] hover:text-white"
                          )}
                          style={
                            sel
                              ? {
                                color: swatch.color,
                                borderColor: swatch.border,
                                backgroundColor: swatch.bg,
                              }
                              : undefined
                          }
                        >
                          {sel && <Check className="h-2.5 w-2.5" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected tags summary strip */}
                  {formValues.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-3 py-2">
                      <span className="mr-1 text-[10px] text-[#4B5578]">Selected:</span>
                      {formValues.tags.map((tag) => {
                        const swatch = tagColor(tag);
                        return (
                          <span
                            key={tag}
                            className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              color: swatch.color,
                              borderColor: swatch.border,
                              backgroundColor: swatch.bg,
                            }}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => toggleTag(tag)}
                              className="ml-0.5 opacity-60 hover:opacity-100"
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    Priority
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIORITIES.map((p) => {
                      const sel = formValues.priority === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setValue("priority", p.id as any, { shouldValidate: true })}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-all",
                            sel
                              ? "border-[#8735C9] bg-[#8735C9]/10 text-white"
                              : "border-[#1e2a4a] bg-[#07112b] text-[#8b9cc8] hover:border-[#293d6b]"
                          )}
                        >
                          <span className={cn("h-2 w-2 rounded-full", p.dot)} />
                          {p.label}
                          {sel && <Check className="ml-auto h-3 w-3 text-[#c084fc]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                      <Calendar className="h-3 w-3" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(formValues.startDate)}
                      onChange={(e) =>
                        setValue("startDate", new Date(e.target.value), { shouldValidate: true })
                      }
                      className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#8735C9] [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                      <Calendar className="h-3 w-3" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(formValues.dueDate)}
                      onChange={(e) =>
                        setValue("dueDate", new Date(e.target.value), { shouldValidate: true })
                      }
                      className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#8735C9] [color-scheme:dark]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ════ Step 2: Teams ════════════════════════════════════════════ */}
            {step === 2 && (
              <>
                {/* Team assignment — multi-select with search */}
                <div>
                  <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      Assign to Teams
                      <span className="font-normal normal-case text-[#4B5578]">
                        (optional · multiple)
                      </span>
                    </span>
                    {formValues.teams.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setValue("teams", [], { shouldValidate: true })}
                        className="text-[10px] font-medium normal-case tracking-normal text-[#6b7db3] hover:text-red-400"
                      >
                        Clear all
                      </button>
                    )}
                  </label>

                  {/* Search */}
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#4B5578]" />
                    <input
                      value={teamSearch}
                      onChange={(e) => {
                        setTeamSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder="Search teams…"
                      className="w-full rounded-xl border border-[#1e2a4a] bg-[#07112b] py-2 pl-9 pr-4 text-xs text-white outline-none transition-colors placeholder:text-[#4B5578] focus:border-[#8735C9]"
                    />
                  </div>

                  {/* Scrollable team list */}
                  <div className="max-h-[220px] space-y-1.5 overflow-y-auto pr-0.5">
                    {isLoadingTeams ? (
                      <div className="flex items-center justify-center py-8 text-xs text-[#6b7db3]">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#8735C9]" />
                        Loading teams…
                      </div>
                    ) : teams.length === 0 ? (
                      <p className="py-6 text-center text-[11px] text-[#4B5578]">
                        No teams found.
                      </p>
                    ) : (
                      teams.map((team) => {
                        const sel = formValues.teams.includes(team.id);
                        return (
                          <button
                            key={team.id}
                            type="button"
                            onClick={() => toggleTeam(team.id)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                              sel
                                ? "border-[#8735C9] bg-[#8735C9]/10"
                                : "border-[#1e2a4a] bg-[#07112b] hover:border-[#293d6b]"
                            )}
                          >
                            {/* Checkbox */}
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

                            {/* Team icon */}
                            <div
                              className={cn(
                                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
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

                            {/* Info */}
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
                                {team.memberCount} member{team.memberCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Pagination if multiple pages exist */}
                  <div className="mt-2 flex justify-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(totalCount / TEAMS_PER_PAGE)}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>

                  {/* Selected teams summary */}
                  {formValues.teams.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-xl border border-[#1e2a4a] bg-[#07112b] px-3 py-2">
                      <span className="mr-1 text-[10px] text-[#4B5578]">
                        {formValues.teams.length} team{formValues.teams.length !== 1 ? "s" : ""} selected:
                      </span>
                      {selectedTeams.map((t) => (
                        <span
                          key={t.id}
                          className="flex items-center gap-1 rounded-full border border-[#8735C9]/30 bg-[#8735C9]/10 px-2 py-0.5 text-[10px] font-medium text-[#c084fc]"
                        >
                          {t.name}
                          <button
                            type="button"
                            onClick={() => toggleTeam(t.id)}
                            className="ml-0.5 opacity-60 hover:opacity-100"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Summary card ────────────────────────────────────────── */}
                <div className="space-y-2 rounded-xl border border-[#1e2a4a] bg-[#07112b] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7db3]">
                    Summary
                  </p>

                  {/* Name + identifier + tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-[#c084fc]" />
                    <p className="text-sm font-semibold text-white">
                      {formValues.name || "Untitled Project"}
                    </p>
                    {formValues.tags.map((tag) => {
                      const swatch = tagColor(tag);
                      return (
                        <span
                          key={tag}
                          className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            color: swatch.color,
                            borderColor: swatch.border,
                            backgroundColor: swatch.bg,
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                    {selectedPriority && (
                      <span className="flex items-center gap-1 rounded-full border border-[#1e2a4a] px-2 py-0.5 text-[10px] text-[#8b9cc8]">
                        <span className={cn("h-1.5 w-1.5 rounded-full", selectedPriority.dot)} />
                        {selectedPriority.label}
                      </span>
                    )}
                  </div>

                  {/* Teams + dates */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#6b7db3]">
                    {selectedTeams.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {selectedTeams.map((t) => t.name).join(", ")}
                      </span>
                    )}
                    {formValues.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Starts {formatDateForInput(formValues.startDate)}
                      </span>
                    )}
                    {formValues.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {formatDateForInput(formValues.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
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
                onClick={(e) => handleNext(e)}
                disabled={step === 0 && formValues.name.trim().length < 2}
                className="ml-auto gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm text-white hover:opacity-90 disabled:opacity-40"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="ml-auto gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm font-semibold text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Create Project
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
