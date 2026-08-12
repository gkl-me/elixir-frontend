"use server";

import { workspaceService } from "@/services/workspace.service";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { handlerServerError } from "@/lib/authHelper";
import {
  AddMembersData,
  CreateTeamData,
  GetUniqueTeamMembers,
  RemoveTeamMemberData,
  ToggleWorkspaceStatusData,
} from "@/types/IWorkspaceType";

// // ── Types ──────────────────────────────────────────────────────────────────

// export type WorkspaceRole = {
//   _id?: string;
//   workspaceId: string;
//   key: string;
//   name: string;
//   permissions: string[];
//   isEditable: boolean;
//   isDeletable: boolean;
//   isDeleted: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// };

// export type WorkspaceMember = {
//   memberId: string;
//   userId: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
//   roleId: string;
//   roleKey: string;
//   joinedAt: string;
// };

// export type WorkspaceInvite = {
//   _id?: string;
//   workspaceId: string;
//   email: string;
//   roleId: string;
//   invitedByUserId: string;
//   status: "pending" | "accepted" | "revoked" | "expired";
//   sentAt: string;
//   expiresAt: string;
//   acceptedAt?: string;
//   revokedAt?: string;
// };

// ── Role Actions ───────────────────────────────────────────────────────────

export async function createRoleAction(
  workspaceId: string,
  data: { name: string; permissions: string[] }
) {
  try {
    const res = await workspaceService.createRole(workspaceId, data);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function updateRoleAction(
  workspaceId: string,
  roleId: string,
  data: { name?: string; permissions?: string[] }
) {
  try {
    const res = await workspaceService.updateRole(workspaceId, roleId, data);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function deleteRoleAction(workspaceId: string, roleId: string) {
  try {
    const res = await workspaceService.deleteRole(workspaceId, roleId);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

// ── Member Actions ─────────────────────────────────────────────────────────

export async function updateMemberRoleAction(
  workspaceId: string,
  memberId: string,
  roleId: string
) {
  try {
    const res = await workspaceService.updateMemberRole(
      workspaceId,
      memberId,
      roleId
    );
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function removeMemberAction(
  workspaceId: string,
  memberId: string
) {
  try {
    const res = await workspaceService.removeMember(workspaceId, memberId);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

// ── Invite Actions ─────────────────────────────────────────────────────────

export async function sendInviteAction(
  workspaceId: string,
  data: { email: string; roleId: string }
) {
  try {
    const res = await workspaceService.sendInvite(workspaceId, data);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function resendInviteAction(
  workspaceId: string,
  inviteId: string
) {
  try {
    const res = await workspaceService.resendInvite(workspaceId, inviteId);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function revokeInviteAction(
  workspaceId: string,
  inviteId: string
) {
  try {
    const res = await workspaceService.revokeInvite(workspaceId, inviteId);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function acceptInviteAction(inviteToken: string) {
  try {
    const res = await workspaceService.acceptInvite(inviteToken);
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function createTeamAction(data: CreateTeamData) {
  try {
    const res = await workspaceService.createTeam(data);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function addMembersAction(data: AddMembersData) {
  try {
    const res = await workspaceService.addMembers(data);
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function removeTeamMemberAction(data: RemoveTeamMemberData) {
  try {
    const res = await workspaceService.removeTeamMember(data);
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}

export async function toggleWorkspaceStatusAction(
  data: ToggleWorkspaceStatusData
) {
  try {
    const res = await workspaceService.handletoggleWorkspaceStatus(data);
    return {
      success: res.data.success,
      message: res.data.message,
    };
  } catch (error) {
    handlerServerError(error);
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}



export async function getUniqueTeamMembersAction(data: GetUniqueTeamMembers) {
  try {
    const res = await workspaceService.getUniqueTeamMembers(data)
    return {
      success: res.data.success,
      message: res.data.message,
      data: res.data.data,
    }
  } catch (error) {
    handlerServerError(error)
    return {
      success: false,
      error: AxiosErrorHandler(error).message,
    };
  }
}