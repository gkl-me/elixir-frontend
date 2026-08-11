// ─── Shared types & utilities for workspace-level Projects view ───────────────

export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";
export type ProjectPriority = "urgent" | "high" | "medium" | "low";

export interface WorkspaceProject {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  /** Tag names — colors are derived on the frontend, never stored */
  tags: string[];
  taskCount: number;
  doneCount: number;
  memberCount: number;
  memberNames: string[];
  progress: number; // 0-100
  dueDate?: string;
  createdAt: string;
  teamNames: string[]; // multi-team support
  key: string; // e.g. "ELX", "MKTG"
}

// ─── Tag colour — deterministic, frontend-only ─────────────────────────────────
const TAG_PALETTE = [
  { color: "#60a5fa", border: "#60a5fa30", bg: "#60a5fa10" }, // blue
  { color: "#34d399", border: "#34d39930", bg: "#34d39910" }, // emerald
  { color: "#f59e0b", border: "#f59e0b30", bg: "#f59e0b10" }, // amber
  { color: "#c084fc", border: "#c084fc30", bg: "#c084fc10" }, // purple
  { color: "#f87171", border: "#f8717130", bg: "#f8717110" }, // red
  { color: "#fb923c", border: "#fb923c30", bg: "#fb923c10" }, // orange
  { color: "#38bdf8", border: "#38bdf830", bg: "#38bdf810" }, // sky
  { color: "#a3e635", border: "#a3e63530", bg: "#a3e63510" }, // lime
  { color: "#e879f9", border: "#e879f930", bg: "#e879f910" }, // fuchsia
  { color: "#2dd4bf", border: "#2dd4bf30", bg: "#2dd4bf10" }, // teal
];

/** Returns a stable color swatch for any tag name (no backend storage needed) */
export const tagColor = (tag: string) =>
  TAG_PALETTE[
  [...tag].reduce((acc, c) => acc + c.charCodeAt(0), 0) % TAG_PALETTE.length
  ];



// ─── Helpers ──────────────────────────────────────────────────────────────────
export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export const GRADS = [
  "from-[#8735C9] to-[#6a29a0]",
  "from-[#3b82f6] to-[#1d4ed8]",
  "from-[#10b981] to-[#059669]",
  "from-[#f59e0b] to-[#d97706]",
  "from-[#ef4444] to-[#b91c1c]",
  "from-[#06b6d4] to-[#0284c7]",
];

export const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

export const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "#34d399",
    bg: "border-emerald-500/30 bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  on_hold: {
    label: "On Hold",
    color: "#f59e0b",
    bg: "border-amber-500/30 bg-amber-500/10",
    dot: "bg-amber-400",
  },
  completed: {
    label: "Completed",
    color: "#60a5fa",
    bg: "border-blue-500/30 bg-blue-500/10",
    dot: "bg-blue-400",
  },
  archived: {
    label: "Archived",
    color: "#6b7db3",
    bg: "border-[#1e2a4a] bg-[#07112b]",
    dot: "bg-slate-500",
  },
};

export const PRIORITY_CONFIG: Record<
  ProjectPriority,
  { label: string; color: string; dot: string }
> = {
  urgent: { label: "Urgent", color: "#ef4444", dot: "bg-red-500" },
  high: { label: "High", color: "#f97316", dot: "bg-orange-500" },
  medium: { label: "Medium", color: "#f59e0b", dot: "bg-amber-500" },
  low: { label: "Low", color: "#6b7db3", dot: "bg-slate-500" },
};

export const daysLeft = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) { return "Overdue"; }
  if (diff === 0) { return "Due today"; }
  return `${diff}d left`;
};
