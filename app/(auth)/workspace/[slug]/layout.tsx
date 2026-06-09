export const dynamic = "force-dynamic";

import WorkspacePageLayout from "@/components/workspace/layout/WorkspacePageLayout";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { WorkspaceContextProvider } from "@/providers/WorkspaceContextProvider";
import { workspaceService } from "@/services/workspace.service"


export default async function WorkspaceSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode,
  params: { slug: string }
}) {

  try {

    const { slug } = await params
    console.log(slug)

    const res = await workspaceService.handleWorkspaceContext({ slug })


    const context = res.data.data.workspaceContext

    return (
      <WorkspaceContextProvider context={context}>
        <WorkspacePageLayout>
          {children}
        </WorkspacePageLayout>
      </WorkspaceContextProvider>
    )

  } catch (error) {
    const err = AxiosErrorHandler(error);
    throw new Error(err.message);
  }

}