"use client";

import { usePermission } from "@/hooks/usePermission";
import { ReactNode } from "react";

interface Props {
  require: string | string[];
  mode?: "hide" | "fallback";
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  require,
  mode = "hide",
  fallback = null,
  children,
}: Props) {
  const perms = Array.isArray(require) ? require : [require];
  const allowed = usePermission(...perms);

  if (allowed) {
    return <>{children}</>;
  }
  if (mode === "fallback") {
    return <>{fallback}</>;
  }
  return null;
}
