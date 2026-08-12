export const AUTH_API_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GOOGLE_AUTH: "/auth/google-auth",
  GITHUB_AUTH: "/auth/github-auth",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  LOGOUT_ALL: "/auth/logout-all",

  VERIFY_EMAIL: "/auth/verify",
  RESEND_EMAIL: "/auth/resend-email",

  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/resend-otp",

  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const USER_API_ROUTES = {
  GET_ALL_USER: "/users/",
  TOGGLE_USER_STATUS: "/users",
  GET_ME: "/users/me",
  CHANGE_PASSWORD: "/users/change-password",
  ACTIVE_SESSIONS: "/users/active-sessions",
  UPDATE_PROFILE: "/users/update-profile",
  REVOKE_SESSION: "/users/revoke-session",
};

export const PLAN_API_ROUTES = {
  GET_ALL_PLANS: "/plans/",
  CREATE_PLAN: "/plans/create",
  TOGGLE_PLAN_STATUS: "/plans/toggle",
};

export const ONBOARDING_API_ROUTES = {
  GET_USER_ONBOARDING: "/onboarding/",
  SAVE_ONBOARDING_STEP: "/onboarding/step",
  COMPLETE_ONBOARDING_STEP: "/onboarding/complete",
  COMPLETE_ONBOARDING_PAYMENT: "/onboarding/complete-payment",
  CHANGE_PLAN: "/onboarding/change-plan",
};

export const PAYMENT_API_ROUTES = {
  VERIFY_PAYMENT: "/payment/verify",
  RETRY_PAYMENT: "/payment/retry",
  BILLING_INFO: "/payment/billing",
  CUSTOMER_PORTAL: "/payment/customer-portal",
  UPRGADE_CHECKOUT: "/payment/upgrade-checkout"
};

export const COMPANY_API_ROUTES = {
  GET_ALL_COMPANY: "/company",
  TOGGLE_COMPANY_STATUS: (companyId: string) => `/company/${companyId}/status`,
};

export const TRANSACTION_API_ROUTES = {
  GET_ALL_TRANSACTION: "/transaction",
};

export const SUBSCRIPTION_API_ROUTES = {
  GET_ALL_SUBSCRIPTION: "/subscription",
  CANCEL_SUBSCRIPTION: (subscriptionId: string) =>
    `/subscription/${subscriptionId}/cancel`,
  REACTIVATE_SUBSCRIPTION: (subscriptionId: string) =>
    `/subscription/${subscriptionId}/reactivate`,
};

export const WORKSPACE_API_ROUTES = {
  GET_WORKSPACE_CONTEXT: "/workspace/context",

  GET_ALL_WORKSPACE: "/workspace",
  TOGGLE_WORKSPACE_STATUS: (workspaceId: string) =>
    `/workspace/${workspaceId}/status`,

  // Roles
  GET_ROLES: (workspaceId: string) => `/workspace/${workspaceId}/roles`,
  CREATE_ROLE: (workspaceId: string) => `/workspace/${workspaceId}/roles`,
  UPDATE_ROLE: (workspaceId: string, roleId: string) =>
    `/workspace/${workspaceId}/roles/${roleId}`,
  DELETE_ROLE: (workspaceId: string, roleId: string) =>
    `/workspace/${workspaceId}/roles/${roleId}`,

  // Members
  GET_MEMBERS: (workspaceId: string) => `/workspace/${workspaceId}/members`,
  UPDATE_MEMBER_ROLE: (workspaceId: string, memberId: string) =>
    `/workspace/${workspaceId}/members/${memberId}`,
  REMOVE_MEMBER: (workspaceId: string, memberId: string) =>
    `/workspace/${workspaceId}/members/${memberId}`,

  // Invites
  GET_INVITES: (workspaceId: string) => `/workspace/${workspaceId}/invites`,
  SEND_INVITE: (workspaceId: string) => `/workspace/${workspaceId}/invites`,
  RESEND_INVITE: (workspaceId: string, inviteId: string) =>
    `/workspace/${workspaceId}/invites/${inviteId}/resend`,
  REVOKE_INVITE: (workspaceId: string, inviteId: string) =>
    `/workspace/${workspaceId}/invites/${inviteId}/revoke`,
  VALIDATE_INVITE: (token: string) => `/workspace/invites/validate/${token}`,
  ACCEPT_INVITE: "/workspace/invites/accept",

  GET_TEAMS: (workspaceId: string) => `/workspace/${workspaceId}/teams`,
  CREATE_TEAM: (workspaceId: string) => `/workspace/${workspaceId}/teams`,
  ADD_MEMBERS: (workspaceId: string, teamId: string) =>
    `/workspace/${workspaceId}/teams/${teamId}/members`,
  REMOVE_TEAM_MEMBER: (workspaceId: string, teamId: string, memberId: string) =>
    `/workspace/${workspaceId}/teams/${teamId}/members/${memberId}`,
  GET_TEAM: (workspaceId: string, teamId: string) =>
    `/workspace/${workspaceId}/teams/${teamId}`,

  GET_WORKSPACE_LIMITS: (workspaceId: string) =>
    `/workspace/${workspaceId}/limits`,



  //projects 
  CREATE_PROJECT: (workspaceId: string) =>
    `/workspace/${workspaceId}/projects`,
  LIST_PROJECTS: (workspaceId: string) =>
    `/workspace/${workspaceId}/projects`,


  CREATE_BACKLOG_ISSUE: (workspaceId: string) =>
    `/workspace/${workspaceId}/backlog/create-issue`,

  GET_PROJECT_DETAILS: (workspaceId: string, projectId: string) =>
    `/workspace/${workspaceId}/projects/${projectId}`
};
