/**
 * app/demo/constants/theme.ts
 *
 * Central theme constants for the Project Management Demo.
 * Import what you need — colors, icon maps, status configs, role configs, etc.
 */

import React from "react";
import {
  AtSign,
  CheckSquare,
  UserCircle,
  Timer,
  Zap,
  CircleDashed,
  Circle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Bug,
  BookOpen,
  Layers,
  Star,
  Shield,
  User,
  Crown,
  Eye,
  FolderKanban,
  Users,
  CheckSquare as TaskIcon,
  AlertTriangle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

// ─────────────────────────────────────────────
// BRAND COLORS
// ─────────────────────────────────────────────
export const COLORS = {
  // Primary Purple palette
  purple: "#8735C9",
  purpleDark: "#4B2070",
  purpleLight: "#c084fc",
  purpleGlow: "rgba(135, 53, 201, 0.3)",

  // Background layers (darkest → lightest)
  bgDeep: "#040A1D",
  bgBase: "#07112b",
  bgCard: "#0C1635",
  bgCardHover: "#0f1d3d",
  bgHighlight: "#132353",

  // Borders
  borderSubtle: "#1e2a4a",
  borderPurple: "#4B2070",

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#8b9cc8",
  textMuted: "#6b7db3",
  textDimmed: "#4B5578",

  // Semantic colors
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
} as const;

// ─────────────────────────────────────────────
// PLAN / SUBSCRIPTION BADGE CONFIG
// ─────────────────────────────────────────────
export const PLAN_CONFIG: Record<
  string,
  { label: string; color: string; textColor: string; bg: string }
> = {
  Free: {
    label: "Free",
    color: "#6b7280",
    textColor: "#9ca3af",
    bg: "rgba(107,114,128,0.1)",
  },
  Pro: {
    label: "Pro",
    color: "#8735C9",
    textColor: "#c084fc",
    bg: "rgba(135,53,201,0.1)",
  },
  Enterprise: {
    label: "Enterprise",
    color: "#b45309",
    textColor: "#fbbf24",
    bg: "rgba(180,83,9,0.1)",
  },
};

// ─────────────────────────────────────────────
// NOTIFICATION TYPE CONFIG
// ─────────────────────────────────────────────
export type NotificationType =
  | "mention"
  | "task_update"
  | "invite"
  | "sprint"
  | "system";

export const NOTIFICATION_CONFIG: Record<
  NotificationType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }
> = {
  mention: {
    label: "mention",
    icon: AtSign,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
  },
  task_update: {
    label: "task update",
    icon: CheckSquare,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  invite: {
    label: "invite",
    icon: UserCircle,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  },
  sprint: {
    label: "sprint",
    icon: Timer,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
  },
  system: {
    label: "system",
    icon: Zap,
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
  },
};

// ─────────────────────────────────────────────
// TASK STATUS CONFIG
// ─────────────────────────────────────────────
export type TaskStatus =
  | "todo"
  | "in-progress"
  | "in-review"
  | "done"
  | "cancelled";

export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }
> = {
  todo: {
    label: "To Do",
    icon: CircleDashed,
    color: "#6b7db3",
    bg: "rgba(107,125,179,0.1)",
    border: "rgba(107,125,179,0.2)",
  },
  "in-progress": {
    label: "In Progress",
    icon: ArrowRight,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
  },
  "in-review": {
    label: "In Review",
    icon: Circle,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
  },
};

// ─────────────────────────────────────────────
// TASK TYPE CONFIG
// ─────────────────────────────────────────────
export type TaskType = "story" | "bug" | "epic" | "task";

export const TASK_TYPE_CONFIG: Record<
  TaskType,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  story: {
    label: "Story",
    icon: BookOpen,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
  },
  bug: {
    label: "Bug",
    icon: Bug,
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
  },
  epic: {
    label: "Epic",
    icon: Layers,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
  },
  task: {
    label: "Task",
    icon: TaskIcon,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
  },
};

// ─────────────────────────────────────────────
// PRIORITY CONFIG
// ─────────────────────────────────────────────
export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; icon: React.ElementType; color: string }
> = {
  urgent: { label: "Urgent", icon: AlertCircle, color: "#ef4444" },
  high: { label: "High", icon: AlertTriangle, color: "#f97316" },
  medium: { label: "Medium", icon: ArrowUp, color: "#f59e0b" },
  low: { label: "Low", icon: ArrowDown, color: "#60a5fa" },
  none: { label: "None", icon: Minus, color: "#6b7db3" },
};

// ─────────────────────────────────────────────
// USER ROLE CONFIG
// ─────────────────────────────────────────────
export type UserRole = "owner" | "admin" | "member" | "guest";

export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
  }
> = {
  owner: {
    label: "Owner",
    icon: Crown,
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
  },
  member: {
    label: "Member",
    icon: User,
    color: "#8b9cc8",
    bg: "rgba(139,156,200,0.1)",
    border: "rgba(139,156,200,0.2)",
  },
  guest: {
    label: "Guest",
    icon: Eye,
    color: "#6b7db3",
    bg: "rgba(107,125,179,0.1)",
    border: "rgba(107,125,179,0.2)",
  },
};

// ─────────────────────────────────────────────
// PROJECT STATUS CONFIG
// ─────────────────────────────────────────────
export type ProjectStatus = "active" | "archived" | "paused";

export const PROJECT_STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    dot: "#34d399",
  },
  archived: {
    label: "Archived",
    color: "#6b7db3",
    bg: "rgba(107,125,179,0.1)",
    dot: "#6b7db3",
  },
  paused: {
    label: "Paused",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    dot: "#fbbf24",
  },
};

// ─────────────────────────────────────────────
// SEARCH RESULT KIND CONFIG
// ─────────────────────────────────────────────
export type SearchKind = "project" | "task" | "member" | "team";

export const SEARCH_KIND_CONFIG: Record<
  SearchKind,
  { label: string; icon: React.ElementType; color: string }
> = {
  project: { label: "Project", icon: FolderKanban, color: "#8735C9" },
  task: { label: "Task", icon: TaskIcon, color: "#60a5fa" },
  member: { label: "Member", icon: UserCircle, color: "#34d399" },
  team: { label: "Team", icon: Users, color: "#fbbf24" },
};

// ─────────────────────────────────────────────
// WORKSPACE AVATAR COLORS (cycling palette)
// ─────────────────────────────────────────────
export const WORKSPACE_AVATAR_COLORS = [
  "#8735C9", // purple (primary)
  "#0f766e", // teal
  "#b45309", // amber
  "#1d4ed8", // blue
  "#be185d", // pink
  "#065f46", // green
  "#7c3aed", // violet
  "#c2410c", // orange
] as const;

/** Pick a deterministic avatar color from the workspace name. */
export const getWorkspaceColor = (name: string): string => {
  const idx = name.charCodeAt(0) % WORKSPACE_AVATAR_COLORS.length;
  return WORKSPACE_AVATAR_COLORS[idx];
};

// ─────────────────────────────────────────────
// SPRINT STATUS CONFIG
// ─────────────────────────────────────────────
export type SprintStatus = "active" | "completed" | "planned";

export const SPRINT_STATUS_CONFIG: Record<
  SprintStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  active: {
    label: "Active",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
  },
  completed: {
    label: "Completed",
    color: "#8b9cc8",
    bg: "rgba(139,156,200,0.1)",
    border: "rgba(139,156,200,0.25)",
  },
  planned: {
    label: "Planned",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
  },
};

// ─────────────────────────────────────────────
// AUTOMATION EVENT TYPES
// ─────────────────────────────────────────────
export const AUTOMATION_TRIGGERS = [
  { id: "pr_merged", label: "PR Merged", icon: Star, color: "#c084fc" },
  {
    id: "issue_opened",
    label: "Issue Opened",
    icon: AlertCircle,
    color: "#f87171",
  },
  {
    id: "deploy_done",
    label: "Deploy Success",
    icon: CheckCircle2,
    color: "#34d399",
  },
] as const;
