import { WORKSPACE_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { CreateBacklogIssueData } from "@/types/IIssueType"




export const issueService = {
    handleCreateBacklogIssue: async (data: CreateBacklogIssueData) => {
        return api.post(WORKSPACE_API_ROUTES.CREATE_BACKLOG_ISSUE(data.workspaceId), data)
    }
}