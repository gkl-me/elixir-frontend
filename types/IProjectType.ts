export interface CreateProjectData {
  workspaceId: string;
  name: string;
  description: string;
  priority: string;
  tags: string[];
  startDate: Date;
  dueDate: Date;
  teams: string[];
}

export interface ListProjectParams {
  search?: string;
  status?: string;
  filter?: string;
  page: number;
  limit: number;
  workspaceId: string;
}

export interface GetProjectDetailsParams {
  workspaceId: string;
  projectId: string;
}
