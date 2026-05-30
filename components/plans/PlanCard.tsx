"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/lib/helper";
import {
  Check,
  X,
  LayoutGrid,
  Users,
  UserCheck,
  HardDrive,
  Shield,
} from "lucide-react";
import React from "react";
import { TogglePlanStatus } from "./TogglePlanStatus";

interface PlanProps {
  id: string;
  name: string;
  type: string;
  price: number;
  limits: {
    projects: number;
    teams: number;
    members: number;
    customRoles: number;
    storageBytes: number;
  };
  features: {
    githubAutomation: boolean;
    automationScripts: boolean;
  };
  actionSlot?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  showToggle?: boolean;
  isActive: boolean;
  onToggle?: (id: string) => void;
}

export function PlanCard({
  id,
  name,
  price,
  limits,
  features,
  actionSlot,
  isSelected,
  onClick,
  showToggle,
  isActive,
}: PlanProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer focus:outline-none"
      role="button"
      tabIndex={0}
    >
      <Card
        key={id}
        className={`group relative flex h-full flex-col overflow-hidden border bg-navy/50 backdrop-blur-sm transition-all duration-300 ${
          isSelected
            ? "z-10 border-purple shadow-[0_0_30px_-5px_var(--color-purple)] md:scale-105"
            : "border-purpleDark/50 hover:border-purple hover:shadow-[0_0_30px_-5px_var(--color-purple)]"
        } `}
      >
        {/* top glow bar */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-blueDark via-purple to-blueDark opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

        {/* HEADER */}
        <CardHeader className="relative z-10 pb-2 text-center">
          {/* TOP TOGGLE */}
          {showToggle && (
            <div className="absolute right-4 top-4">
              <TogglePlanStatus id={id} isActive={isActive} />
            </div>
          )}

          <CardTitle className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {name}
          </CardTitle>

          <div className="flex items-baseline justify-center pt-3 sm:pt-4">
            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl md:text-5xl">
              ${price / 100}
            </span>
            <span className="ml-1 text-xs font-medium text-gray-400 sm:ml-2 sm:text-sm">
              /month
            </span>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="relative z-10 flex flex-1 flex-col space-y-6 pt-4 sm:space-y-8 sm:pt-6">
          <div className="flex-1 space-y-4">
            {/* Limits */}
            <div className="space-y-2 sm:space-y-3">
              <FeatureRow
                icon={<LayoutGrid className="h-4 w-4 text-purple" />}
                label="Projects"
                value={limits.projects === -1 ? "Unlimited" : limits.projects}
              />
              <FeatureRow
                icon={<Users className="h-4 w-4 text-purple" />}
                label="Teams"
                value={limits.teams === -1 ? "Unlimited" : limits.teams}
              />
              <FeatureRow
                icon={<UserCheck className="h-4 w-4 text-purple" />}
                label="Members"
                value={limits.members === -1 ? "Unlimited" : limits.members}
              />
              <FeatureRow
                icon={<HardDrive className="h-4 w-4 text-purple" />}
                label="Storage"
                value={formatBytes(limits.storageBytes)}
              />
              <FeatureRow
                icon={<Shield className="h-4 w-4 text-purple" />}
                label="Custom Roles"
                value={limits.customRoles}
              />
            </div>

            <div className="my-3 h-px w-full bg-white/5 sm:my-4" />

            {/* Boolean Features */}
            <div className="space-y-2 sm:space-y-3">
              <BooleanFeature
                label="GitHub Automation"
                enabled={features.githubAutomation}
              />
              <BooleanFeature
                label="Automation Scripts"
                enabled={features.automationScripts}
              />
            </div>
          </div>

          {/* ACTION */}
          {actionSlot && (
            <div className="border-t border-white/5 pt-3 sm:pt-4">
              {actionSlot}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="group/row flex items-center justify-between text-sm">
      <div className="flex items-center text-gray-300 transition-colors group-hover/row:text-white">
        <span className="mr-3 rounded-md bg-white/5 p-1.5 transition-colors group-hover/row:bg-purple/20">
          {icon}
        </span>
        {label}
      </div>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function BooleanFeature({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center text-sm">
      {enabled ? (
        <div className="mr-3 rounded-full bg-green-500/10 p-1">
          <Check className="h-3 w-3 text-green-500" />
        </div>
      ) : (
        <div className="mr-3 rounded-full bg-red-500/10 p-1">
          <X className="h-3 w-3 text-red-500" />
        </div>
      )}
      <span className={enabled ? "text-gray-200" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );
}
