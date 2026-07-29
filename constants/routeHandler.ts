export const NEXT_API_ROUTES = {
  USERS_LIST_API: "/api/users",

  USERS_ME_API: "/api/users/me",

  WORKSPACE_CONTEXT_API: "/api/workspace/context",

  LIST_ACTIVE_SESSIONS: "/api/users/active-sessions",

  GOOGLE_AUTH: "/api/auth/google-verify",
  GITHUB_AUTH: "/api/auth/github-verify",

  UPDATE_SESSION: "/api/auth/update-session",

  GET_ALL_SUBSCRIPTION: "/api/subscription",

  GET_ALL_TRANSACTION: "/api/transaction",

  GET_WORKSPACE_MEMBERS: "/api/workspace/members",
  GET_WORKSPACE_INVITES: "/api/workspace/invites",
  GET_WORKSPACE_ROLES: "/api/workspace/roles",
  GET_WORKSPACE_TEAMS: "/api/workspace/teams",
  GET_WORKSPACE_TEAM: (teamId: string) => `/api/workspace/teams/${teamId}`,
  GET_WORKSPACE_LIMITS: "/api/workspace/limits",

  GET_ALL_WORKSPACE: "/api/workspace",

  GET_USER_ME: "/api/users/me",

  GET_BILLING_INFO: "/api/payment",

  GET_ALL_COMPANY: "/api/company",
};
