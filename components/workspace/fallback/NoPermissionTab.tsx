import { Lock } from "lucide-react";

interface Props {
  message?: string;
}

export function NoPermissionTab({
  message = "You don't have permission to view this.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#1e2a4a] bg-[#0C1635] py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8735C9]/20 bg-[#8735C9]/10">
        <Lock className="h-4 w-4 text-[#8735C9]/60" />
      </div>
      <div>
        <p className="text-xs font-semibold text-white">Access Restricted</p>
        <p className="mt-0.5 max-w-[240px] text-[11px] text-[#4B5578]">{message}</p>
      </div>
    </div>
  );
}
