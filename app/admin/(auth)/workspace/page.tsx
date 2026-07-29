export const dynamic = "force-dynamic";

import WorkspaceDataTable from "@/components/workspace/WorkspaceDataTable";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { workspaceService } from "@/services/workspace.service";

export default async function WorkspacePage() {
  let data;

  try {
    const res = await workspaceService.handleListWorkspace({});
    data = res.data.data;
  } catch (error) {
    throw new Error(AxiosErrorHandler(error).message);
  }

  return (
    <div className="space-y-6">
      <WorkspaceDataTable
        intialData={data.workspaces}
        intialTotalCount={data.totalCount}
      />
    </div>
  );
}
