import { WORKSPACE_API_ROUTES } from "@/constants/apiRoutes";
import api from "@/lib/api";

export const workspaceService = {
  handleWorkspaceContext: async () => {
    return api.get(WORKSPACE_API_ROUTES.GET_WORKSPACE_CONTEXT);
  },
};
