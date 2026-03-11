"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBytes } from "@/lib/helper"
import { Check, X, LayoutGrid, Users, UserCheck, HardDrive, Shield } from "lucide-react"
import React from "react"
import { TogglePlanStatus } from "./TogglePlanStatus"

interface PlanProps {
  id: string
  name: string
  type: string
  price: number
  limits: {
    projects: number
    teams: number
    members: number
    customRoles: number
    storageBytes: number
  }
  features: {
    githubAutomation: boolean
    automationScripts: boolean
  }
  actionSlot?: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  showToggle?:boolean
  isActive:boolean,
  onToggle?:(id:string)=>void
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
        className={`
          bg-navy/50 backdrop-blur-sm relative overflow-hidden border group
          transition-all duration-300 h-full flex flex-col

          ${isSelected
            ? "border-purple shadow-[0_0_30px_-5px_var(--color-purple)] md:scale-105 z-10"
            : "border-purpleDark/50 hover:border-purple hover:shadow-[0_0_30px_-5px_var(--color-purple)]"
          }
        `}
      >
        {/* top glow bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blueDark via-purple to-blueDark opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

        {/* HEADER */}
        <CardHeader className="text-center pb-2 relative z-10">

           {/* TOP TOGGLE */}
          {showToggle && (
            <div className="absolute right-4 top-4">
              <TogglePlanStatus 
                id={id}
                isActive={isActive}
              />
            </div>
          )}

          <CardTitle className="text-white text-xl sm:text-2xl font-bold tracking-tight">
            {name}
          </CardTitle>

          <div className="flex items-baseline justify-center pt-3 sm:pt-4">
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              ${price/100}
            </span>
            <span className="text-gray-400 ml-1 sm:ml-2 text-xs sm:text-sm font-medium">
              /month
            </span>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 flex-1 flex flex-col z-10 relative">
          <div className="space-y-4 flex-1">
            {/* Limits */}
            <div className="space-y-2 sm:space-y-3">
              <FeatureRow
                icon={<LayoutGrid className="w-4 h-4 text-purple" />}
                label="Projects"
                value={limits.projects === -1 ? "Unlimited" : limits.projects}
              />
              <FeatureRow
                icon={<Users className="w-4 h-4 text-purple" />}
                label="Teams"
                value={limits.teams === -1 ? "Unlimited" : limits.teams}
              />
              <FeatureRow
                icon={<UserCheck className="w-4 h-4 text-purple" />}
                label="Members"
                value={limits.members === -1 ? "Unlimited" : limits.members}
              />
              <FeatureRow
                icon={<HardDrive className="w-4 h-4 text-purple" />}
                label="Storage"
                value={formatBytes(limits.storageBytes)}
              />
              <FeatureRow
                icon={<Shield className="w-4 h-4 text-purple" />}
                label="Custom Roles"
                value={limits.customRoles}
              />
            </div>

            <div className="w-full h-px bg-white/5 my-3 sm:my-4" />

            {/* Boolean Features */}
            <div className="space-y-2 sm:space-y-3">
              <BooleanFeature label="GitHub Automation" enabled={features.githubAutomation} />
              <BooleanFeature label="Automation Scripts" enabled={features.automationScripts} />
            </div>
          </div>

          {/* ACTION */}
          {actionSlot && <div className="pt-3 sm:pt-4 border-t border-white/5">
            {actionSlot}
          </div>}
        </CardContent>
      </Card>
    </div>
  )
}


function FeatureRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="flex items-center justify-between text-sm group/row">
            <div className="flex items-center text-gray-300 group-hover/row:text-white transition-colors">
                <span className="mr-3 p-1.5 rounded-md bg-white/5 group-hover/row:bg-purple/20 transition-colors">
                    {icon}
                </span>
                {label}
            </div>
            <span className="font-semibold text-white">{value}</span>
        </div>
    )
}

function BooleanFeature({ label, enabled }: { label: string, enabled: boolean }) {
    return (
        <div className="flex items-center text-sm">
            {enabled ? (
                <div className="bg-green-500/10 p-1 rounded-full mr-3">
                    <Check className="w-3 h-3 text-green-500" />
                </div>
            ) : (
                <div className="bg-red-500/10 p-1 rounded-full mr-3">
                    <X className="w-3 h-3 text-red-500" />
                </div>
            )}
            <span className={enabled ? "text-gray-200" : "text-gray-500"}>{label}</span>
        </div>
    )
}

