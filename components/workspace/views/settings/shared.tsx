"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Section card ─────────────────────────────────────────
export const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="overflow-hidden rounded-2xl border border-[#1e2a4a] bg-[#0C1635]">
    <div className="border-b border-[#1e2a4a] px-6 py-4">
      <h3 className="font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-0.5 text-xs text-[#6b7db3]">{description}</p>
      )}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Field wrapper ────────────────────────────────────────
export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-[#c9d3ed]">{label}</Label>
    {children}
    {hint && <p className="text-xs text-[#4B5578]">{hint}</p>}
  </div>
);

// ─── Styled input ─────────────────────────────────────────
export const StyledInput = (props: React.ComponentProps<typeof Input>) => (
  <Input
    {...props}
    className={cn(
      "border-[#1e2a4a] bg-[#07112b] text-white placeholder:text-[#4B5578]",
      "transition-colors focus-visible:border-[#8735C9] focus-visible:ring-[#8735C9]",
      props.className
    )}
  />
);

// ─── Toggle row ───────────────────────────────────────────
export const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-[#c9d3ed]">{label}</p>
      {description && (
        <p className="mt-0.5 text-xs text-[#4B5578]">{description}</p>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0 rounded-full transition-colors duration-200"
      style={{
        height: 22,
        width: 40,
        backgroundColor: checked ? "#8735C9" : "#1e2a4a",
      }}
    >
      <span
        className={cn(
          "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200",
          checked ? "left-5" : "left-0.5"
        )}
      />
    </button>
  </div>
);
