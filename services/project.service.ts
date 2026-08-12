import { WORKSPACE_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { CreateProjectData, GetProjectDetailsParams, ListProjectParams } from "@/types/IProjectType"


export const projectService = {
    handleCreateProject: async (data: CreateProjectData) => {
        return api.post(WORKSPACE_API_ROUTES.CREATE_PROJECT(data.workspaceId), data)
    },
    handleListProjects: async (params: ListProjectParams) => {
        return api.get(WORKSPACE_API_ROUTES.LIST_PROJECTS(params.workspaceId), {
            params
        })
    },
    handleGetProjectDetails: async (params: GetProjectDetailsParams) => {
        return api.get(WORKSPACE_API_ROUTES.GET_PROJECT_DETAILS(params.workspaceId, params.projectId))
    }
}