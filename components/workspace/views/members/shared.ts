// ─── Types (from backend DTO) ──────────────────────────────
import { Crown, Shield, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export type Member = {
  memberId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: string;
  roleKey: string;
  joinedAt: string;
};

export type WorkspaceRole = {
  id?: string;
  workspaceId: string;
  key: string;
  name: string;
  permissions: string[];
  isEditable: boolean;
  isDeletable: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WorkspaceInvite = {
  id?: string;
  workspaceId: string;
  email: string;
  roleId: string;
  invitedByUserId: string;
  status: "pending" | "accepted" | "revoked" | "expired";
  sentAt: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
};

// ─── Helpers ──────────────────────────────────────────────
export const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const GRADS = [
  "from-[#8735C9] to-[#6a29a0]",
  "from-[#3b82f6] to-[#1d4ed8]",
  "from-[#10b981] to-[#059669]",
  "from-[#f59e0b] to-[#d97706]",
];
export const grad = (name: string) => GRADS[name.charCodeAt(0) % GRADS.length];

// ─── Role badge configs ────────────────────────────────────
export const ROLE_BADGE: Record<
  string,
  { color: string; bg: string; icon: React.ElementType }
> = {
  owner: {
    color: "#f59e0b",
    bg: "bg-amber-500/10 border-amber-500/30",
    icon: Crown,
  },
  admin: {
    color: "#60a5fa",
    bg: "bg-blue-500/10 border-blue-500/30",
    icon: Shield,
  },
  member: {
    color: "#8b9cc8",
    bg: "bg-[#1e2a4a] border-[#293d6b]",
    icon: Users,
  },
};

export const getRoleBadge = (key: string) =>
  ROLE_BADGE[key] ?? {
    color: "#c084fc",
    bg: "bg-[#8735C9]/10 border-[#8735C9]/30",
    icon: Shield,
  };

// ─── Status badge configs ──────────────────────────────────
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
  revoked: {
    color: "#f87171",
    bg: "bg-red-500/10 border-red-500/30",
    icon: AlertCircle,
    label: "Revoked",
  },
};

// ─── Permission groups (matches backend WORKSPACE_PERMISSIONS) ─────────────
export const PERMISSION_GROUPS = [
  {
    group: "Members",
    items: [
      { id: "members.view", label: "View Members", desc: "See the member list" },
      { id: "members.invite", label: "Invite Members", desc: "Send workspace invitations" },
      { id: "members.remove", label: "Remove Members", desc: "Remove members from workspace" },
      { id: "members.role.update", label: "Change Roles", desc: "Assign or change member roles" },
    ],
  },
  {
    group: "Roles",
    items: [
      { id: "roles.view", label: "View Roles", desc: "See all custom roles" },
      { id: "roles.create", label: "Create Roles", desc: "Create new custom roles" },
      { id: "roles.update", label: "Edit Roles", desc: "Edit existing custom roles" },
      { id: "roles.delete", label: "Delete Roles", desc: "Delete custom roles" },
    ],
  },
  {
    group: "Projects",
    items: [
      { id: "projects.view", label: "View Projects", desc: "See all projects" },
      { id: "projects.create", label: "Create Projects", desc: "Create new projects" },
      { id: "projects.update", label: "Update Projects", desc: "Edit project settings" },
      { id: "projects.delete", label: "Delete Projects", desc: "Archive or delete projects" },
    ],
  },
  {
    group: "Billing",
    items: [
      { id: "billing.view", label: "View Billing", desc: "See plan & invoices" },
      { id: "billing.manage", label: "Manage Billing", desc: "Upgrade or cancel plan" },
    ],
  },
];

// Dependency map — mirrors backend PERMISSION_DEPENDENCIES
export const PERMISSION_DEPS: Record<string, string[]> = {
  "members.invite": ["members.view"],
  "members.remove": ["members.view", "members.invite"],
  "members.role.update": ["members.view", "members.invite"],
  "roles.create": ["roles.view"],
  "roles.update": ["roles.view", "roles.create"],
  "roles.delete": ["roles.view", "roles.create"],
  "projects.create": ["projects.view"],
  "projects.update": ["projects.view", "projects.create"],
  "projects.delete": ["projects.view", "projects.create"],
  "billing.manage": ["billing.view"],
};

/** Returns the full set of permissions (including auto-required parents) for a given selection. */
export function resolveDepsForward(selected: string[], depsMap: Record<string, string[]> = PERMISSION_DEPS): string[] {
  const result = new Set(selected);
  let changed = true;
  while (changed) {
    changed = false;
    for (const perm of [...result]) {
      for (const dep of depsMap[perm] ?? []) {
        if (!result.has(dep)) {
          result.add(dep);
          changed = true;
        }
      }
    }
  }
  return [...result];
}

/** When unchecking `perm`, also removes any permission that depends on it. */
export function resolveRemoval(perm: string, current: string[], depsMap: Record<string, string[]> = PERMISSION_DEPS): string[] {
  const toRemove = new Set([perm]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key, deps] of Object.entries(depsMap)) {
      if (deps.some((d) => toRemove.has(d)) && !toRemove.has(key)) {
        toRemove.add(key);
        changed = true;
      }
    }
  }
  return current.filter((p) => !toRemove.has(p));
}
