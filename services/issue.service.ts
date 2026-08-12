import { WORKSPACE_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { CreateBacklogIssueData, ListBacklogParams } from "@/types/IIssueType"




export const issueService = {
    handleCreateBacklogIssue: async (data: CreateBacklogIssueData) => {
        return api.post(WORKSPACE_API_ROUTES.CREATE_BACKLOG_ISSUE(data.workspaceId), data)
    },
    handleListBacklogs: async (params: ListBacklogParams) => {
        return api.get(WORKSPACE_API_ROUTES.LIST_BACKLOGS(params.workspaceId, params.projectId), { params })
    }
}