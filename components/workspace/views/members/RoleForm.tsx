"use client";

import React, { useState } from "react";
import { Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PERMISSION_GROUPS, ROLE_PRESETS } from "./shared";

interface RoleFormProps {
  initialName?: string;
  initialPerms?: string[];
  onSave: (name: string, perms: string[]) => void;
  onClose: () => void;
  saveLabel?: string;
}

export const RoleForm = ({
  initialName = "",
  initialPerms = [...ROLE_PRESETS.member],
  onSave,
  onClose,
  saveLabel = "Create Role",
}: RoleFormProps) => {
  const [name, setName] = useState(initialName);
  const [perms, setPerms] = useState<string[]>(initialPerms);
  const [preset, setPreset] = useState<"blank" | "member" | "admin">("member");
  const [err, setErr] = useState("");

  const toggle = (id: string) =>
    setPerms((ps) =>
      ps.includes(id) ? ps.filter((p) => p !== id) : [...ps, id]
    );

  const applyPreset = (p: "blank" | "member" | "admin") => {
    setPreset(p);
    setPerms(p === "blank" ? [] : [...ROLE_PRESETS[p]]);
  };

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

        {/* Preset selector */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8b9cc8]">
            Start From
          </label>
          <div className="flex gap-2">
            {(["blank", "member", "admin"] as const).map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={cn(
                  "flex-1 rounded-xl border py-2 text-xs font-semibold capitalize transition-all",
                  preset === p
                    ? "border-[#8735C9] bg-[#8735C9]/15 text-[#c084fc]"
                    : "border-[#1e2a4a] bg-[#07112b] text-[#6b7db3] hover:border-[#293d6b] hover:text-white"
                )}
              >
                {p === "blank" ? "Blank" : p === "member" ? "Member" : "Admin"}
              </button>
            ))}
          </div>
        </div>

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
          <div className="space-y-4">
            {PERMISSION_GROUPS.map((g) => (
              <div key={g.group}>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#4B5578]">
                  {g.group}
                </p>
                <div className="space-y-1">
                  {g.items.map((item) => {
                    const on = perms.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-all",
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
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-xs font-medium",
                              on ? "text-white" : "text-[#8b9cc8]"
                            )}
                          >
                            {item.label}
                          </p>
                          <p className="text-[10px] text-[#4B5578]">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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
