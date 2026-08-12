
export type IssueType = "story" | "bug"
export type IssuePriority = "urgent" | "high" | "medium" | "low"
export type IssueStatus = "todo" | "in_progress" | "in_review" | "done"



export interface CreateBacklogIssueData {
    type: IssueType,
    title: string,
    description: string,
    storyPoints: number,
    priority: IssuePriority,
    status: IssueStatus
    assignee: string
    reporter: string

    projectId: string,
    workspaceId: string
}