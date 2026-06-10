import { workspaceService } from "@/services/workspace.service";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { InviteAcceptClient } from "./InviteAcceptClient";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const session = await getSession();

  // Not logged in → send to login with invite param so it redirects back after auth
  if (!session.accessToken) {
    redirect(`/login?invite=${token}`);
  }

  try {
    const res = await workspaceService.validateInvite(token);
    const { workspaceName, email } = res.data?.data?.validation ?? {};

    return (
      <InviteAcceptClient
        token={token}
        workspaceName={workspaceName ?? "a workspace"}
        invitedEmail={email ?? ""}
      />
    );
  } catch {
    return <InviteInvalidView />;
  }
}

function InviteInvalidView() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#040A1D]">
      <div className="w-full max-w-sm rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-lg font-bold text-white">
          Invalid or Expired Link
        </h1>
        <p className="mt-2 text-sm text-[#6b7db3]">
          This invite link is no longer valid. It may have expired or been
          revoked.
        </p>
        <a
          href="/login"
          className="mt-6 block w-full rounded-xl border border-[#1e2a4a] py-2.5 text-sm font-semibold text-[#8b9cc8] transition-colors hover:bg-[#0f1d3d] hover:text-white"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
}
