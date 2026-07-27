import { Lock } from "lucide-react";
import Link from "next/link";

interface Props {
  message?: string;
}

export function NoPermissionPage({
  message = "You don't have access to this section.",
}: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8735C9]/20 bg-[#8735C9]/10">
        <Lock className="h-7 w-7 text-[#8735C9]/60" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">Access Restricted</p>
        <p className="mt-1 max-w-xs text-xs text-[#6b7db3]">{message}</p>
      </div>
      <Link
        href=".."
        className="mt-2 rounded-lg border border-[#1e2a4a] px-4 py-2 text-xs text-[#8b9cc8] transition-colors hover:bg-[#0f1d3d] hover:text-white"
      >
        ← Go back
      </Link>
    </div>
  );
}
