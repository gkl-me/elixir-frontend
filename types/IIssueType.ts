export type IssueType = "story" | "bug";
export type IssuePriority = "urgent" | "high" | "medium" | "low";
export type IssueStatus = "todo" | "in_progress" | "in_review" | "done";

export interface CreateBacklogIssueData {
  type: IssueType;
  title: string;
  description: string;
  storyPoints: number;
  priority: IssuePriority;
  status: IssueStatus;
  assignee: string;
  reporter: string;

  projectId: string;
  workspaceId: string;
}

export interface ListBacklogParams {
  search?: string;
  type?: string;
  status?: string;
  workspaceId: string;
  projectId: string;
}

export interface IIssueResDto {
  id: string;
  title: string;
  key: string;
  description: string;
  type: IssueType;
  storyPoints: number;
  priority: IssuePriority;
  status: IssueStatus;
  assignee: string;
  reporter: string;
  projectId: string;
  workspaceId: string;
  sprintId?: string;
  labels: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IBackLogsDetailsDto {
  backLogs: IIssueResDto[];
  totalCount: number;
  stories: number;
  bugs: number;
  totalStoryPoint: number;
}
