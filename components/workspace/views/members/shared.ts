// ─── Types ────────────────────────────────────────────────
import { demoMembers, demoWorkspace } from "../../../../data/demoData";

export type Member = (typeof demoMembers)[0];
export type CustomRole = (typeof demoWorkspace.customRoles)[0];

// ─── Helpers ──────────────────────────────────────────────
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
];
export const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

// ─── Role & status badge configs ──────────────────────────
import {
  Crown,
  Shield,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const ROLE_BADGE: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  owner: {
    color: "#f59e0b",
    bg: "bg-amber-500/10  border-amber-500/30",
    icon: Crown,
  },
  admin: {
    color: "#60a5fa",
    bg: "bg-blue-500/10   border-blue-500/30",
    icon: Shield,
  },
  member: {
    color: "#8b9cc8",
    bg: "bg-[#1e2a4a]     border-[#293d6b]",
    icon: Users,
  },
};

export const STATUS_BADGE: Record<
  string,
  { color: string; bg: string; icon: React.ElementType; label: string }
> = {
  pending: {
    color: "#f59e0b",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: Clock,
    label: "Pending",
  },
  accepted: {
    color: "#34d399",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    icon: CheckCircle2,
    label: "Accepted",
  },
  expired: {
    color: "#6b7db3",
    bg: "bg-[#1e2a4a] border-[#293d6b]",
    icon: AlertCircle,
    label: "Expired",
  },
};

// ─── Permission groups for role builder ───────────────────
export const PERMISSION_GROUPS = [
  {
    group: "Projects",
    items: [
      { id: "projects.view", label: "View Projects", desc: "See all projects" },
      {
        id: "projects.create",
        label: "Create Projects",
        desc: "Create new projects",
      },
      {
        id: "projects.manage",
        label: "Manage Projects",
        desc: "Archive, rename, delete",
      },
    ],
  },
  {
    group: "Backlog & Tasks",
    items: [
      {
        id: "backlog.view",
        label: "View Tasks",
        desc: "See all issues and tasks",
      },
      {
        id: "backlog.manage",
        label: "Manage Tasks",
        desc: "Create, edit, close issues",
      },
      {
        id: "sprints.manage",
        label: "Manage Sprints",
        desc: "Start, close, plan sprints",
      },
    ],
  },
  {
    group: "Members",
    items: [
      { id: "members.view", label: "View Members", desc: "See member list" },
      {
        id: "members.invite",
        label: "Invite Members",
        desc: "Send workspace invitations",
      },
      {
        id: "members.manage",
        label: "Manage Members",
        desc: "Change roles, remove members",
      },
    ],
  },
  {
    group: "Workspace",
    items: [
      {
        id: "activity.view_all",
        label: "View All Activity",
        desc: "Full team audit log",
      },
      {
        id: "automations.view",
        label: "View Automations",
        desc: "See automation rules",
      },
      {
        id: "automations.manage",
        label: "Manage Automations",
        desc: "Create/edit automations",
      },
      { id: "storage.view", label: "View Storage", desc: "Browse files" },
      {
        id: "billing.view",
        label: "View Billing",
        desc: "See plan & invoices",
      },
      {
        id: "billing.manage",
        label: "Manage Billing",
        desc: "Upgrade or cancel plan",
      },
      {
        id: "roles.manage",
        label: "Manage Roles",
        desc: "Create and edit roles",
      },
      {
        id: "workspace.manage",
        label: "Workspace Admin",
        desc: "Full workspace control",
      },
    ],
  },
];

export const ROLE_PRESETS: Record<string, string[]> = {
  admin: [
    "projects.view",
    "projects.create",
    "projects.manage",
    "backlog.view",
    "backlog.manage",
    "sprints.manage",
    "members.view",
    "members.invite",
    "members.manage",
    "activity.view_all",
    "automations.view",
    "automations.manage",
    "storage.view",
    "billing.view",
  ],
  member: [
    "projects.view",
    "backlog.view",
    "backlog.manage",
    "members.view",
    "storage.view",
  ],
};

// ─── All available roles for pickers ──────────────────────
export const allRoles = () => [
  {
    id: "admin",
    label: "Admin",
    desc: "Manage projects, members, automations",
  },
  { id: "member", label: "Member", desc: "Standard contributor access" },
  ...demoWorkspace.customRoles.map((r) => ({
    id: r.id,
    label: r.name,
    desc: `Custom · ${r.permissions.length} permissions`,
  })),
];
