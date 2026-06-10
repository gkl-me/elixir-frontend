"use client";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";

export function usePermission(...required: string[]): boolean {
  const permissions = useWorkspaceStore((s) => s.context?.permissions) ?? [];
  if (permissions.includes("*")) {
    return true;
  }
  return required.every((p) => permissions.includes(p));
}

export function useAnyPermission(...perms: string[]): boolean {
  const permissions = useWorkspaceStore((s) => s.context?.permissions) ?? [];
  if (permissions.includes("*")) {
    return true;
  }
  return perms.some((p) => permissions.includes(p));
}
