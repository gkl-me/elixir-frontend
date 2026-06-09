import { WORKSPACE_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";
import { WorkspaceContextData } from "@/types/IWorkspaceType";

export const workspaceService = {
  handleWorkspaceContext: async (data: WorkspaceContextData) => {
    return api.get(WORKSPACE_API_ROUTES.GET_WORKSPACE_CONTEXT + '/' + data?.slug);
  },
};
