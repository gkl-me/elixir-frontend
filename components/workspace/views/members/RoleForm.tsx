"use client";

import React, { useState } from "react";
import { Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveDepsForward, resolveRemoval } from "./shared";
import { useWorkspaceStore } from "@/store/useWorkspaceContext";

interface RoleFormProps {
  initialName?: string;
  initialPerms?: string[];
  onSave: (name: string, perms: string[]) => void;
  onClose: () => void;
  saveLabel?: string;
}

export const RoleForm = ({
  initialName = "",
  initialPerms,
  onSave,
  onClose,
  saveLabel = "Create Role",
}: RoleFormProps) => {
  const context = useWorkspaceStore((s) => s.context);
  const allPermissions = context?.allPermissions ?? [];
  const permissionDeps = context?.permissionDependencies ?? {};
  const builtinRoles = context?.builtinRoles ?? {};

  const [name, setName] = useState(initialName);
  const [perms, setPerms] = useState<string[]>(() => {
    if (initialPerms !== undefined) return initialPerms;
    return builtinRoles.member ?? [];
  });
  const [err, setErr] = useState("");

  const toggle = (id: string) =>
    setPerms((ps) =>
      ps.includes(id)
        ? resolveRemoval(id, ps, permissionDeps)
        : resolveDepsForward([...ps, id], permissionDeps)
    );

  const handleSave = () => {
    if (!name.trim()) {
      setErr("Role name is required");
      return;
    }
    onSave(name, perms);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
            Role Name *
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErr("");
            }}
            placeholder="e.g. Guest Developer"
            className={cn(
              "w-full rounded-xl border bg-[#07112b] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-[#4B5578]",
              err
                ? "border-red-400/50"
                : "border-[#1e2a4a] focus:border-[#8735C9]"
            )}
          />
          {err && <p className="mt-1 text-[11px] text-red-400">{err}</p>}
        </div>

        {/* Load Preset Templates */}
        {builtinRoles && Object.keys(builtinRoles).length > 0 && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Load Preset Template
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(builtinRoles).map(([roleKey, rolePerms]) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => setPerms(rolePerms)}
                  className="rounded-lg border border-[#1e2a4a] bg-[#07112b] px-3 py-1.5 text-xs font-semibold text-[#8b9cc8] transition-colors hover:border-[#8735C9] hover:text-white capitalize"
                >
                  {roleKey} Preset
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Permissions */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
              Permissions
            </label>
            <span className="text-[10px] font-semibold text-[#c084fc]">
              {perms.length} selected
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {allPermissions.map((id) => {
              const on = perms.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    on
                      ? "bg-[#8735C9]/08 border-[#8735C9]/50"
                      : "border-[#1e2a4a] hover:border-[#293d6b]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-all",
                      on
                        ? "border-[#8735C9] bg-[#8735C9]"
                        : "border-[#293d6b]"
                    )}
                  >
                    {on && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium truncate",
                      on ? "text-white" : "text-[#8b9cc8]"
                    )}
                  >
                    {id}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 border-t border-[#1e2a4a] pt-2">
        <Button
          onClick={handleSave}
          className="flex-1 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] font-semibold text-white hover:opacity-90"
        >
          <Shield className="h-4 w-4" />
          {saveLabel}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          className="border-[#1e2a4a] text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
