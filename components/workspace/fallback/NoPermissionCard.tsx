import { Lock } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  message?: string;
}

export function NoPermissionCard({
  children,
  message = "Contact your admin to unlock this.",
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none opacity-40 blur-[2px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#07112b]/60 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#8735C9]/20 bg-[#8735C9]/10">
          <Lock className="h-4 w-4 text-[#8735C9]/60" />
        </div>
        <p className="text-xs font-semibold text-white">Restricted</p>
        <p className="max-w-[180px] text-[11px] text-[#6b7db3]">{message}</p>
      </div>
    </div>
  );
}
