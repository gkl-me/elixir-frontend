export interface WorkspaceContextData {
  slug: string;
}

export interface ListTeamsData {
  workspaceId: string;
}

export interface CreateTeamData {
  workspaceId: string;
  name: string;
  createdByUserId?: string;
  memberIds?: string[];
  description?: string;
}

export interface AddMembersData {
  workspaceId: string;
  teamId: string;
  memberIds: string[];
}

export interface RemoveTeamMemberData {
  workspaceId: string;
  teamId: string;
  memberId: string;
}

export interface WorkspaceTeamsList {
  id: string;
  name: string;
  memberCount: number;
  memberName: string[];
}

export interface GetTeamData {
  workspaceId: string;
  teamId: string;
}


export interface WorkspaceLimitsData {
  workspaceId: string
}


export interface ListWorkspaceData {
  search?: string,
  status?: string,
  page: number
  limit: number
}

export interface ToggleWorkspaceStatusData {
  workspaceId: string
}