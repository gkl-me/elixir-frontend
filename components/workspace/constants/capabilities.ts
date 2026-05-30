/**
 * capabilities.ts
 *
 * Permission capability system for the application.
 * The home page (and any other view) uses a `Capabilities` object to decide
 * what to render — NOT a role name string. This means custom roles work
 * automatically: derive their Capabilities from the permissions[] on their
 * CustomRole record and the UI adapts with no extra code.
 *
 * Permission string format: "<resource>.<action>"
 *   e.g. "billing.manage", "members.invite", "projects.create"
 */

// ─── All known permission strings ────────────────────────────────────────────
export const PERMISSIONS = {
  // Billing & Plan
  BILLING_MANAGE: "billing.manage", // view/change billing, see plan usage
  BILLING_VIEW: "billing.view", // read-only plan info

  // Members
  MEMBERS_INVITE: "members.invite", // send invitations
  MEMBERS_MANAGE: "members.manage", // edit roles, remove members
  MEMBERS_VIEW: "members.view", // see member list

  // Projects
  PROJECTS_CREATE: "projects.create",
  PROJECTS_MANAGE: "projects.manage", // archive, settings
  PROJECTS_VIEW: "projects.view",

  // Sprints & Backlog
  SPRINTS_MANAGE: "sprints.manage", // create/close sprints
  BACKLOG_MANAGE: "backlog.manage", // create/edit/delete issues
  BACKLOG_VIEW: "backlog.view",

  // Activity
  ACTIVITY_VIEW_ALL: "activity.view_all", // see all workspace activity (not just own)

  // Workspace
  WORKSPACE_MANAGE: "workspace.manage", // rename, delete, transfer

  // Roles (admin feature)
  ROLES_MANAGE: "roles.manage",

  // Automation
  AUTOMATIONS_MANAGE: "automations.manage",
  AUTOMATIONS_VIEW: "automations.view",

  // Storage
  STORAGE_MANAGE: "storage.manage",
  STORAGE_VIEW: "storage.view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Capabilities shape ───────────────────────────────────────────────────────
// Each boolean maps to a specific permission. The home page & other views
// read these booleans — never the raw role name.
export interface Capabilities {
  // Billing
  canManageBilling: boolean; // show plan banner, upgrade button, seats count
  canViewBilling: boolean; // show read-only plan badge

  // Members
  canInviteMembers: boolean; // show Invite button
  canManageMembers: boolean; // show "Manage" link on member list
  canViewMembers: boolean; // show member list on home

  // Projects
  canCreateProjects: boolean; // show "+ New Project" button
  canManageProjects: boolean; // show project settings/archive
  canViewProjects: boolean;

  // Sprints / Backlog
  canManageSprints: boolean; // create / close sprints
  canManageBacklog: boolean; // create/edit issues
  canViewBacklog: boolean;

  // Activity feed
  canViewAllActivity: boolean; // full team feed vs own-only feed

  // Workspace
  canManageWorkspace: boolean;

  // Roles
  canManageRoles: boolean;

  // Automations
  canManageAutomations: boolean;
  canViewAutomations: boolean;

  // Storage
  canManageStorage: boolean;
  canViewStorage: boolean;
}

// ─── Preset capability sets for built-in roles ───────────────────────────────
const OWNER_CAPS: Capabilities = {
  canManageBilling: true,
  canViewBilling: true,
  canInviteMembers: true,
  canManageMembers: true,
  canViewMembers: true,
  canCreateProjects: true,
  canManageProjects: true,
  canViewProjects: true,
  canManageSprints: true,
  canManageBacklog: true,
  canViewBacklog: true,
  canViewAllActivity: true,
  canManageWorkspace: true,
  canManageRoles: true,
  canManageAutomations: true,
  canViewAutomations: true,
  canManageStorage: true,
  canViewStorage: true,
};

const ADMIN_CAPS: Capabilities = {
  canManageBilling: false,
  canViewBilling: true,
  canInviteMembers: true,
  canManageMembers: true,
  canViewMembers: true,
  canCreateProjects: true,
  canManageProjects: true,
  canViewProjects: true,
  canManageSprints: true,
  canManageBacklog: true,
  canViewBacklog: true,
  canViewAllActivity: true,
  canManageWorkspace: false,
  canManageRoles: false,
  canManageAutomations: true,
  canViewAutomations: true,
  canManageStorage: true,
  canViewStorage: true,
};

const MEMBER_CAPS: Capabilities = {
  canManageBilling: false,
  canViewBilling: false,
  canInviteMembers: false,
  canManageMembers: false,
  canViewMembers: true,
  canCreateProjects: false,
  canManageProjects: false,
  canViewProjects: true,
  canManageSprints: false,
  canManageBacklog: true, // members can create/update their own issues
  canViewBacklog: true,
  canViewAllActivity: false, // only own activity
  canManageWorkspace: false,
  canManageRoles: false,
  canManageAutomations: false,
  canViewAutomations: false,
  canManageStorage: false,
  canViewStorage: true,
};

// Fallback for completely unknown roles — same as member
const GUEST_CAPS: Capabilities = {
  ...MEMBER_CAPS,
  canManageBacklog: false,
  canViewStorage: false,
};

// ─── Built-in role preset map ─────────────────────────────────────────────────
const BUILT_IN: Record<string, Capabilities> = {
  owner: OWNER_CAPS,
  admin: ADMIN_CAPS,
  member: MEMBER_CAPS,
  guest: GUEST_CAPS,
};

// ─── Permission → capability mapping ─────────────────────────────────────────
// Used to derive capabilities from a custom role's permissions[] array.
const PERM_TO_CAP: Partial<Record<Permission, keyof Capabilities>> = {
  [PERMISSIONS.BILLING_MANAGE]: "canManageBilling",
  [PERMISSIONS.BILLING_VIEW]: "canViewBilling",
  [PERMISSIONS.MEMBERS_INVITE]: "canInviteMembers",
  [PERMISSIONS.MEMBERS_MANAGE]: "canManageMembers",
  [PERMISSIONS.MEMBERS_VIEW]: "canViewMembers",
  [PERMISSIONS.PROJECTS_CREATE]: "canCreateProjects",
  [PERMISSIONS.PROJECTS_MANAGE]: "canManageProjects",
  [PERMISSIONS.PROJECTS_VIEW]: "canViewProjects",
  [PERMISSIONS.SPRINTS_MANAGE]: "canManageSprints",
  [PERMISSIONS.BACKLOG_MANAGE]: "canManageBacklog",
  [PERMISSIONS.BACKLOG_VIEW]: "canViewBacklog",
  [PERMISSIONS.ACTIVITY_VIEW_ALL]: "canViewAllActivity",
  [PERMISSIONS.WORKSPACE_MANAGE]: "canManageWorkspace",
  [PERMISSIONS.ROLES_MANAGE]: "canManageRoles",
  [PERMISSIONS.AUTOMATIONS_MANAGE]: "canManageAutomations",
  [PERMISSIONS.AUTOMATIONS_VIEW]: "canViewAutomations",
  [PERMISSIONS.STORAGE_MANAGE]: "canManageStorage",
  [PERMISSIONS.STORAGE_VIEW]: "canViewStorage",
};

// ─── Main API ─────────────────────────────────────────────────────────────────
/**
 * Returns the Capabilities object for any role — built-in or custom.
 *
 * @param role       Role name string ("owner", "admin", "member", or custom role id)
 * @param permissions Optional permissions array from a CustomRole record.
 *                    If provided, capabilities are derived from this array
 *                    (starting from GUEST/member baseline + each granted permission).
 *
 * Usage:
 *   const caps = getCapabilities('owner');
 *   const caps = getCapabilities('custom-role-id', customRole.permissions);
 */
export function getCapabilities(
  role: string,
  permissions?: string[],
): Capabilities {
  // Built-in role — return preset caps
  if (!permissions && BUILT_IN[role]) {
    return BUILT_IN[role];
  }

  // Custom role — start from member baseline and grant extra caps
  const base: Capabilities = { ...MEMBER_CAPS };

  if (permissions) {
    for (const perm of permissions) {
      const capKey = PERM_TO_CAP[perm as Permission];
      if (capKey) base[capKey] = true;
    }
    // Ensure that manage → view is always implied
    if (base.canManageBilling) base.canViewBilling = true;
    if (base.canManageMembers) base.canViewMembers = true;
    if (base.canManageProjects) base.canViewProjects = true;
    if (base.canManageBacklog) base.canViewBacklog = true;
    if (base.canManageAutomations) base.canViewAutomations = true;
    if (base.canManageStorage) base.canViewStorage = true;
  }

  return base;
}
