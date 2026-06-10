import { Lock } from "lucide-react";

interface Props {
  label: string;
  tooltip?: string;
  className?: string;
}

export function NoPermissionInline({
  label,
  tooltip = "You need permission for this action",
  className,
}: Props) {
  return (
    <div className="group relative inline-block">
      <button
        disabled
        className={[
          "flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-[#1e2a4a] px-3 py-1.5 text-xs text-[#4B5578] opacity-60",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Lock className="h-3 w-3" />
        {label}
      </button>
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-max max-w-[200px] -translate-x-1/2 rounded-lg border border-[#1e2a4a] bg-[#0C1635] px-2.5 py-1.5 text-center text-[10px] text-[#8b9cc8] group-hover:block">
        {tooltip}
      </div>
    </div>
  );
}
