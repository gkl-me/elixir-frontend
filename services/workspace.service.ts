import { WORKSPACE_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";
import {
  AddMembersData,
  CreateTeamData,
  GetTeamData,
  ListTeamsData,
  RemoveTeamMemberData,
  WorkspaceContextData,
  WorkspaceLimitsData,
} from "@/types/IWorkspaceType";

export const workspaceService = {
  handleWorkspaceContext: async (data: WorkspaceContextData) => {
    return api.get(
      WORKSPACE_API_ROUTES.GET_WORKSPACE_CONTEXT + "/" + data?.slug
    );
  },

  getRoles: async (workspaceId: string) => {
    return api.get(WORKSPACE_API_ROUTES.GET_ROLES(workspaceId));
  },

  createRole: async (
    workspaceId: string,
    payload: { name: string; permissions: string[] }
  ) => {
    return api.post(WORKSPACE_API_ROUTES.CREATE_ROLE(workspaceId), payload);
  },

  updateRole: async (
    workspaceId: string,
    roleId: string,
    payload: { name?: string; permissions?: string[] }
  ) => {
    return api.patch(
      WORKSPACE_API_ROUTES.UPDATE_ROLE(workspaceId, roleId),
      payload
    );
  },

  deleteRole: async (workspaceId: string, roleId: string) => {
    return api.delete(WORKSPACE_API_ROUTES.DELETE_ROLE(workspaceId, roleId));
  },

  getMembers: async (workspaceId: string) => {
    return api.get(WORKSPACE_API_ROUTES.GET_MEMBERS(workspaceId));
  },

  updateMemberRole: async (
    workspaceId: string,
    memberId: string,
    roleId: string
  ) => {
    return api.patch(
      WORKSPACE_API_ROUTES.UPDATE_MEMBER_ROLE(workspaceId, memberId),
      { roleId }
    );
  },

  removeMember: async (workspaceId: string, memberId: string) => {
    return api.delete(
      WORKSPACE_API_ROUTES.REMOVE_MEMBER(workspaceId, memberId)
    );
  },

  getInvites: async (workspaceId: string) => {
    return api.get(WORKSPACE_API_ROUTES.GET_INVITES(workspaceId));
  },

  sendInvite: async (
    workspaceId: string,
    payload: { email: string; roleId: string }
  ) => {
    return api.post(WORKSPACE_API_ROUTES.SEND_INVITE(workspaceId), payload);
  },

  resendInvite: async (workspaceId: string, inviteId: string) => {
    return api.get(WORKSPACE_API_ROUTES.RESEND_INVITE(workspaceId, inviteId));
  },

  revokeInvite: async (workspaceId: string, inviteId: string) => {
    return api.patch(WORKSPACE_API_ROUTES.REVOKE_INVITE(workspaceId, inviteId));
  },

  validateInvite: async (token: string) => {
    return api.get(WORKSPACE_API_ROUTES.VALIDATE_INVITE(token));
  },

  acceptInvite: async (inviteToken: string) => {
    return api.post(WORKSPACE_API_ROUTES.ACCEPT_INVITE, { inviteToken });
  },

  listTeams: async (data: ListTeamsData) => {
    return api.get(WORKSPACE_API_ROUTES.GET_TEAMS(data?.workspaceId));
  },

  createTeam: async (data: CreateTeamData) => {
    return api.post(WORKSPACE_API_ROUTES.CREATE_TEAM(data?.workspaceId), {
      ...data,
    });
  },

  addMembers: async (data: AddMembersData) => {
    return api.patch(
      WORKSPACE_API_ROUTES.ADD_MEMBERS(data?.workspaceId, data?.teamId),
      { ...data }
    );
  },

  removeTeamMember: async (data: RemoveTeamMemberData) => {
    return api.delete(
      WORKSPACE_API_ROUTES.REMOVE_TEAM_MEMBER(
        data?.workspaceId,
        data?.teamId,
        data?.memberId
      )
    );
  },

  getTeam: async (data: GetTeamData) => {
    return api.get(
      WORKSPACE_API_ROUTES.GET_TEAM(data?.workspaceId, data?.teamId)
    );
  },

  getWorkspaceLimits: async (data: WorkspaceLimitsData) => {
    return api.get(
      WORKSPACE_API_ROUTES.GET_WORKSPACE_LIMITS(data?.workspaceId)
    )
  }
};
