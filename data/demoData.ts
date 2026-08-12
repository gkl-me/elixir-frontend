export type UserRole = "owner" | "admin" | "member";

export type SubscriptionPlan = "Free" | "Pro" | "Enterprise";

export interface PlanLimit {
  projects: number;
  teams: number;
  members: number;
  customRoles: number;
  storageBytes: number;
}

export interface SubscriptionFeature {
  githubAutomation: boolean;
  automationScripts: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionPlan;
  features: SubscriptionFeature;
  limits: PlanLimit;
  price: number;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Member {
  id: string;
  userId: string;
  user: User;
  role: UserRole | string; // Built-in or custom role Id
  joinedAt: string;
}

export interface CustomRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  subscriptionPlan: string; // Subscription ID
  members: Member[];
  customRoles: CustomRole[];
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  status: "active" | "archived";
  createdAt: string;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  memberIds: string[]; // references Member.id
}

export interface ActiveSprint {
  id: string;
  projectId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "planned";
}

export type TaskStatus = "todo" | "in-progress" | "in-review" | "done";
export type TaskType = "story" | "bug" | "epic";

export interface Task {
  id: string;
  projectId: string;
  sprintId?: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  assigneeId?: string | null;
  reporterId: string;
  points?: number;
}

// ----------------------------------------------------
// DEMO DATA
// ----------------------------------------------------

export const demoSubscriptions: Subscription[] = [
  {
    id: "6989ec0133a8db26e161fb02",
    name: "Free",
    type: "Free",
    features: { githubAutomation: false, automationScripts: false },
    limits: {
      projects: 5,
      teams: 2,
      members: 5,
      customRoles: 0,
      storageBytes: 104857600,
    },
    price: 0,
    isActive: true,
  },
  {
    id: "6989ec0233a8db26e161fb03",
    name: "Pro",
    type: "Pro",
    features: { githubAutomation: true, automationScripts: true },
    limits: {
      projects: 10,
      teams: 5,
      members: 10,
      customRoles: 3,
      storageBytes: 314572800,
    },
    price: 1000,
    isActive: true,
  },
  {
    id: "6989ec0433a8db26e161fb04",
    name: "Enterprise",
    type: "Enterprise",
    features: { githubAutomation: true, automationScripts: true },
    limits: {
      projects: -1,
      teams: -1,
      members: -1,
      customRoles: 5,
      storageBytes: 524288000,
    },
    price: 2000,
    isActive: true,
  },
];

export const demoUsers: User[] = [
  { id: "u1", name: "Alice Smith", email: "alice@example.com" },
  { id: "u2", name: "Bob Johnson", email: "bob@example.com" },
  { id: "u3", name: "Charlie Dave", email: "charlie@example.com" },
  { id: "u4", name: "Diana Park", email: "diana@example.com" },
  { id: "u5", name: "Ethan Morris", email: "ethan@example.com" },
  { id: "u6", name: "Fiona Chen", email: "fiona@example.com" },
  { id: "u7", name: "George Kim", email: "george@example.com" },
  { id: "u8", name: "Hannah Lee", email: "hannah@example.com" },
  { id: "u9", name: "Ivan Petrov", email: "ivan@example.com" },
  { id: "u10", name: "Julia Santos", email: "julia@example.com" },
];

export const demoMembers: Member[] = [
  {
    id: "m1",
    userId: "u1",
    user: demoUsers[0],
    role: "owner",
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "m2",
    userId: "u2",
    user: demoUsers[1],
    role: "admin",
    joinedAt: "2026-01-02T00:00:00.000Z",
  },
  {
    id: "m3",
    userId: "u3",
    user: demoUsers[2],
    role: "member",
    joinedAt: "2026-01-05T00:00:00.000Z",
  },
  {
    id: "m4",
    userId: "u4",
    user: demoUsers[3],
    role: "member",
    joinedAt: "2026-01-08T00:00:00.000Z",
  },
  {
    id: "m5",
    userId: "u5",
    user: demoUsers[4],
    role: "admin",
    joinedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "m6",
    userId: "u6",
    user: demoUsers[5],
    role: "member",
    joinedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "m7",
    userId: "u7",
    user: demoUsers[6],
    role: "member",
    joinedAt: "2026-01-20T00:00:00.000Z",
  },
  {
    id: "m8",
    userId: "u8",
    user: demoUsers[7],
    role: "member",
    joinedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "m9",
    userId: "u9",
    user: demoUsers[8],
    role: "admin",
    joinedAt: "2026-02-05T00:00:00.000Z",
  },
  {
    id: "m10",
    userId: "u10",
    user: demoUsers[9],
    role: "member",
    joinedAt: "2026-02-10T00:00:00.000Z",
  },
];

export const demoWorkspace: Workspace = {
  id: "ws1",
  name: "Acme Corp",
  ownerId: "u1",
  subscriptionPlan: demoSubscriptions[1].id, // Pro
  members: demoMembers,
  customRoles: [
    {
      id: "cr1",
      name: "Guest Developer",
      permissions: ["read:project", "write:task"],
    },
  ],
};

export const demoProjects: Project[] = [
  {
    id: "p1",
    workspaceId: "ws1",
    name: "Website Redesign",
    description: "Redesigning the main landing pages",
    status: "active",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "p2",
    workspaceId: "ws1",
    name: "Mobile App V2",
    description: "Major rewrite of the iOS app",
    status: "active",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
];

export const demoTeams: Team[] = [
  {
    id: "t1",
    workspaceId: "ws1",
    name: "Frontend Guild",
    memberIds: ["m1", "m2"],
  },
  { id: "t2", workspaceId: "ws1", name: "Backend Masters", memberIds: ["m3"] },
  {
    id: "t3",
    workspaceId: "ws1",
    name: "Mobile Core",
    memberIds: ["m4", "m5"],
  },
  {
    id: "t4",
    workspaceId: "ws1",
    name: "Design System",
    memberIds: ["m6", "m7", "m8"],
  },
  { id: "t5", workspaceId: "ws1", name: "DevOps & Infra", memberIds: ["m9"] },
  {
    id: "t6",
    workspaceId: "ws1",
    name: "Data Platform",
    memberIds: ["m10", "m1"],
  },
  {
    id: "t7",
    workspaceId: "ws1",
    name: "Growth & Marketing",
    memberIds: ["m2", "m3", "m6"],
  },
];

export const demoSprints: ActiveSprint[] = [
  {
    id: "s1",
    projectId: "p1",
    name: "Sprint 1 - Foundations",
    startDate: "2026-03-01T00:00:00.000Z",
    endDate: "2026-03-14T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "s2",
    projectId: "p1",
    name: "Sprint 2 - Core UI",
    startDate: "2026-03-15T00:00:00.000Z",
    endDate: "2026-03-29T00:00:00.000Z",
    status: "active",
  },
];

export const demoTasks: Task[] = [
  {
    id: "tk1",
    projectId: "p1",
    sprintId: "s1",
    title: "Setup Next.js",
    description: "Initialize the base repo",
    status: "done",
    type: "story",
    assigneeId: "m1",
    reporterId: "m2",
    points: 3,
  },
  {
    id: "tk2",
    projectId: "p1",
    sprintId: "s2",
    title: "Create Navigation",
    description: "Implement the sidebar and navbar",
    status: "in-progress",
    type: "story",
    assigneeId: "m2",
    reporterId: "m1",
    points: 5,
  },
  {
    id: "tk3",
    projectId: "p1",
    sprintId: "s2",
    title: "Fix CSS Bug",
    description: "Sidebar is transparent on mobile",
    status: "todo",
    type: "bug",
    assigneeId: null,
    reporterId: "m3",
    points: 1,
  },
  {
    id: "tk4",
    projectId: "p1",
    sprintId: null,
    title: "Implement Auth",
    description: "Need to add next-auth",
    status: "todo",
    type: "story",
    assigneeId: null,
    reporterId: "m1",
    points: 8,
  },
];

export const demoActivities = [
  {
    id: "a1",
    user: "Alice Smith",
    action: "completed task",
    target: "Setup Next.js",
    timestamp: "2 hours ago",
  },
  {
    id: "a2",
    user: "Bob Johnson",
    action: "moved task",
    target: "Create Navigation -> In Progress",
    timestamp: "4 hours ago",
  },
  {
    id: "a3",
    user: "Charlie Dave",
    action: "created bug",
    target: "Fix CSS Bug",
    timestamp: "1 day ago",
  },
];

export type NotificationType =
  | "mention"
  | "task_update"
  | "invite"
  | "sprint"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  avatarSeed?: string;
}

export const demoNotifications: Notification[] = [
  {
    id: "n1",
    type: "mention",
    title: "Bob Johnson mentioned you",
    description: 'In task: Create Navigation — "@Alice can you review?"',
    timestamp: "5 min ago",
    read: false,
    avatarSeed: "Bob Johnson",
  },
  {
    id: "n2",
    type: "task_update",
    title: "Task moved to In Review",
    description: '"Fix CSS Bug" was moved to In Review by Charlie Dave',
    timestamp: "30 min ago",
    read: false,
    avatarSeed: "Charlie Dave",
  },
  {
    id: "n3",
    type: "sprint",
    title: "Sprint 2 ending soon",
    description: "Sprint 2 - Core UI ends in 3 days. 2 tasks remaining.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "n4",
    type: "invite",
    title: "New member joined",
    description: "Charlie Dave joined the workspace as a Member.",
    timestamp: "1 day ago",
    read: true,
    avatarSeed: "Charlie Dave",
  },
  {
    id: "n5",
    type: "system",
    title: "Automation triggered",
    description: "GitHub PR #42 was merged. Deploy workflow started.",
    timestamp: "2 days ago",
    read: true,
  },
];

// Combined Search Index – used by the Navbar global search
export interface SearchResult {
  id: string;
  kind: "project" | "task" | "member" | "team";
  label: string;
  sublabel?: string;
  viewTarget?: string; // which view to navigate to
}

export const demoSearchIndex: SearchResult[] = [
  ...demoProjects.map((p) => ({
    id: p.id,
    kind: "project" as const,
    label: p.name,
    sublabel: p.description,
    viewTarget: "projects",
  })),
  ...demoTasks.map((t) => ({
    id: t.id,
    kind: "task" as const,
    label: t.title,
    sublabel: t.description,
    viewTarget: "backlogs",
  })),
  ...demoMembers.map((m) => ({
    id: m.id,
    kind: "member" as const,
    label: m.user.name,
    sublabel: m.user.email,
    viewTarget: "members",
  })),
  ...demoTeams.map((t) => ({
    id: t.id,
    kind: "team" as const,
    label: t.name,
    sublabel: `${t.memberIds.length} members`,
    viewTarget: "teams",
  })),
];

// Multiple workspaces the user can switch between
export interface WorkspaceSummary {
  id: string;
  name: string;
  plan: string;
  memberCount: number;
  avatarColor: string;
  isActive: boolean;
}

export const demoWorkspaceList: WorkspaceSummary[] = [
  {
    id: "ws1",
    name: "Acme Corp",
    plan: "Pro",
    memberCount: 3,
    avatarColor: "#8735C9",
    isActive: true,
  },
  {
    id: "ws2",
    name: "Side Project",
    plan: "Free",
    memberCount: 1,
    avatarColor: "#0f766e",
    isActive: false,
  },
  {
    id: "ws3",
    name: "Client — BETA",
    plan: "Enterprise",
    memberCount: 12,
    avatarColor: "#b45309",
    isActive: false,
  },
  {
    id: "ws4",
    name: "Design Studio",
    plan: "Pro",
    memberCount: 5,
    avatarColor: "#1d4ed8",
    isActive: false,
  },
  {
    id: "ws5",
    name: "Startup Ventures",
    plan: "Free",
    memberCount: 2,
    avatarColor: "#be185d",
    isActive: false,
  },
  {
    id: "ws6",
    name: "Open Source Hub",
    plan: "Free",
    memberCount: 8,
    avatarColor: "#065f46",
    isActive: false,
  },
  {
    id: "ws7",
    name: "Consulting Co",
    plan: "Enterprise",
    memberCount: 20,
    avatarColor: "#c2410c",
    isActive: false,
  },
];

// ─────────────────────────────────────────────────────────
// INVOICES (Billing History)
// ─────────────────────────────────────────────────────────
export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  period: string;
  amount: number; // in cents
  status: "paid" | "failed" | "refunded" | "pending";
  plan: string;
  seats: number;
  paymentMethod: string;
  last4: string;
  downloadUrl?: string; // placeholder: replace with actual API endpoint
}

export const demoInvoices: Invoice[] = [
  {
    id: "inv_001",
    invoiceNumber: "INV-2026-003",
    date: "Mar 1, 2026",
    period: "Mar 1 – Mar 31, 2026",
    amount: 2900,
    status: "paid",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Visa",
    last4: "4242",
  },
  {
    id: "inv_002",
    invoiceNumber: "INV-2026-002",
    date: "Feb 1, 2026",
    period: "Feb 1 – Feb 28, 2026",
    amount: 2900,
    status: "paid",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Visa",
    last4: "4242",
  },
  {
    id: "inv_003",
    invoiceNumber: "INV-2026-001",
    date: "Jan 1, 2026",
    period: "Jan 1 – Jan 31, 2026",
    amount: 2900,
    status: "paid",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Visa",
    last4: "4242",
  },
  {
    id: "inv_004",
    invoiceNumber: "INV-2025-012",
    date: "Dec 1, 2025",
    period: "Dec 1 – Dec 31, 2025",
    amount: 2900,
    status: "paid",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Mastercard",
    last4: "8888",
  },
  {
    id: "inv_005",
    invoiceNumber: "INV-2025-011",
    date: "Nov 1, 2025",
    period: "Nov 1 – Nov 30, 2025",
    amount: 0,
    status: "refunded",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Mastercard",
    last4: "8888",
  },
  {
    id: "inv_006",
    invoiceNumber: "INV-2025-010",
    date: "Oct 1, 2025",
    period: "Oct 1 – Oct 31, 2025",
    amount: 900,
    status: "paid",
    plan: "Free → Pro",
    seats: 1,
    paymentMethod: "Mastercard",
    last4: "8888",
  },
  {
    id: "inv_007",
    invoiceNumber: "INV-2025-009",
    date: "Sep 1, 2025",
    period: "Sep 1 – Sep 30, 2025",
    amount: 2900,
    status: "failed",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Visa",
    last4: "1234",
  },
  {
    id: "inv_008",
    invoiceNumber: "INV-2025-008",
    date: "Aug 1, 2025",
    period: "Aug 1 – Aug 31, 2025",
    amount: 2900,
    status: "paid",
    plan: "Pro",
    seats: 3,
    paymentMethod: "Visa",
    last4: "1234",
  },
];

// ─────────────────────────────────────────────────────────
// INVITES
// ─────────────────────────────────────────────────────────
export type InviteStatus = "pending" | "accepted" | "expired";

export interface Invite {
  id: string;
  email: string;
  role: string;
  status: InviteStatus;
  invitedBy: string;
  sentAt: string;
  expiresAt: string;
}

export const demoInvites: Invite[] = [
  {
    id: "inv1",
    email: "dave@acme.com",
    role: "member",
    status: "pending",
    invitedBy: "Alice Smith",
    sentAt: "2026-03-22T10:00:00.000Z",
    expiresAt: "2026-03-29T10:00:00.000Z",
  },
  {
    id: "inv2",
    email: "sara@acme.com",
    role: "admin",
    status: "pending",
    invitedBy: "Alice Smith",
    sentAt: "2026-03-21T09:00:00.000Z",
    expiresAt: "2026-03-28T09:00:00.000Z",
  },
  {
    id: "inv3",
    email: "mike@partner.io",
    role: "cr1",
    status: "accepted",
    invitedBy: "Bob Johnson",
    sentAt: "2026-03-15T08:00:00.000Z",
    expiresAt: "2026-03-22T08:00:00.000Z",
  },
  {
    id: "inv4",
    email: "old@example.com",
    role: "member",
    status: "expired",
    invitedBy: "Charlie Dave",
    sentAt: "2026-03-01T07:00:00.000Z",
    expiresAt: "2026-03-08T07:00:00.000Z",
  },
];

// ─────────────────────────────────────────────────────────
// ADMIN SUBSCRIPTIONS & TRANSACTIONS
// ─────────────────────────────────────────────────────────
export interface AdminSubscription {
  id: string;
  workspaceName: string;
  companyName: string;
  ownerEmail: string;
  planName: "Free" | "Pro" | "Enterprise";
  status: "active" | "canceled" | "past_due" | "paused";
  billingCycle: "monthly" | "yearly";
  price: number; // in cents
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: string;
  createdAt: string;
}

export const demoAdminSubscriptions: AdminSubscription[] = [
  {
    id: "sub_101",
    workspaceName: "Acme Corp Workspace",
    companyName: "Acme Corporation",
    ownerEmail: "alice@acme.com",
    planName: "Enterprise",
    status: "active",
    billingCycle: "yearly",
    price: 19900,
    currentPeriodStart: "2026-01-01T00:00:00.000Z",
    currentPeriodEnd: "2027-01-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "Visa •••• 4242",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "sub_102",
    workspaceName: "DevOps Core",
    companyName: "TechCorp Labs",
    ownerEmail: "bob@techcorp.io",
    planName: "Pro",
    status: "active",
    billingCycle: "monthly",
    price: 2900,
    currentPeriodStart: "2026-03-01T00:00:00.000Z",
    currentPeriodEnd: "2026-04-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "Mastercard •••• 8888",
    createdAt: "2025-11-15T00:00:00.000Z",
  },
  {
    id: "sub_103",
    workspaceName: "Design Systems",
    companyName: "Creative Pulse Studio",
    ownerEmail: "charlie@designpulse.co",
    planName: "Pro",
    status: "active",
    billingCycle: "monthly",
    price: 2900,
    currentPeriodStart: "2026-03-10T00:00:00.000Z",
    currentPeriodEnd: "2026-04-10T00:00:00.000Z",
    cancelAtPeriodEnd: true,
    paymentMethod: "Visa •••• 1234",
    createdAt: "2025-12-10T00:00:00.000Z",
  },
  {
    id: "sub_104",
    workspaceName: "Alpha Sandbox",
    companyName: "Starlight Media",
    ownerEmail: "diana@starlight.org",
    planName: "Free",
    status: "active",
    billingCycle: "monthly",
    price: 0,
    currentPeriodStart: "2026-02-01T00:00:00.000Z",
    currentPeriodEnd: "2026-03-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "N/A",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "sub_105",
    workspaceName: "FinTech Hub",
    companyName: "Nova Pay Inc",
    ownerEmail: "ethan@novapay.com",
    planName: "Enterprise",
    status: "past_due",
    billingCycle: "monthly",
    price: 9900,
    currentPeriodStart: "2026-02-15T00:00:00.000Z",
    currentPeriodEnd: "2026-03-15T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "Amex •••• 9012",
    createdAt: "2025-08-20T00:00:00.000Z",
  },
  {
    id: "sub_106",
    workspaceName: "Legacy Portal",
    companyName: "Vintage Goods Co",
    ownerEmail: "fiona@vintagegoods.net",
    planName: "Pro",
    status: "canceled",
    billingCycle: "monthly",
    price: 2900,
    currentPeriodStart: "2026-01-01T00:00:00.000Z",
    currentPeriodEnd: "2026-02-01T00:00:00.000Z",
    cancelAtPeriodEnd: true,
    paymentMethod: "Visa •••• 5555",
    createdAt: "2025-05-10T00:00:00.000Z",
  },
  {
    id: "sub_107",
    workspaceName: "Cloud Ops Base",
    companyName: "Strato Cloud Services",
    ownerEmail: "george@stratocloud.io",
    planName: "Pro",
    status: "paused",
    billingCycle: "yearly",
    price: 29000,
    currentPeriodStart: "2025-09-01T00:00:00.000Z",
    currentPeriodEnd: "2026-09-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "Mastercard •••• 7777",
    createdAt: "2025-09-01T00:00:00.000Z",
  },
  {
    id: "sub_108",
    workspaceName: "Growth Engine",
    companyName: "Vanguard Dynamics",
    ownerEmail: "hannah@vanguard.com",
    planName: "Enterprise",
    status: "active",
    billingCycle: "yearly",
    price: 19900,
    currentPeriodStart: "2026-02-01T00:00:00.000Z",
    currentPeriodEnd: "2027-02-01T00:00:00.000Z",
    cancelAtPeriodEnd: false,
    paymentMethod: "Visa •••• 3333",
    createdAt: "2026-02-01T00:00:00.000Z",
  },
];

export interface AdminTransaction {
  id: string;
  invoiceNumber: string;
  workspaceName: string;
  customerEmail: string;
  amount: number; // in cents
  currency: string;
  status: "succeeded" | "failed" | "refunded" | "pending";
  paymentMethod: string;
  last4: string;
  invoicePdfUrl: string;
  planType: string;
  createdAt: string;
}
