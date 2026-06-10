"use client";

import React, { useState } from "react";
import { UserPlus, Shield, Users, Crown, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MembersTab } from "./members/MembersTab";
import { InvitesTab } from "./members/InvitesTab";
import { RolesTab } from "./members/RolesTab";
import { InviteModal } from "./members/modals/InviteModal";
import { PermissionGate } from "@/components/workspace/PermissionGate";

type ActiveTab = "members" | "invites" | "roles";

const STAT_CARDS = [
  { label: "Total Members", color: "#8735C9", icon: Users },
  { label: "Owners", color: "#f59e0b", icon: Crown },
  { label: "Admins", color: "#60a5fa", icon: Shield },
  { label: "Pending Invites", color: "#c084fc", icon: Mail },
];

export const MembersView = () => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const TABS: [ActiveTab, string][] = [
    ["members", "Members"],
    ["invites", "Invites"],
    ["roles", "Custom Roles"],
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Members
          </h1>
          <p className="mt-0.5 text-sm text-[#6b7db3]">
            Manage your workspace members, roles, and invitations.
          </p>
        </div>
        <div className="flex gap-2">
          <PermissionGate require="roles.view">
            <Button
              variant="outline"
              onClick={() => setActiveTab("roles")}
              className="h-9 gap-2 border-[#1e2a4a] text-sm text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
            >
              <Shield className="h-4 w-4" />
              Manage Roles
            </Button>
          </PermissionGate>
          <PermissionGate require="members.invite">
            <Button
              onClick={() => setInviteOpen(true)}
              className="h-9 gap-2 bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-sm text-white shadow-[0_2px_12px_rgba(135,53,201,0.35)] hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </PermissionGate>
        </div>
      </div>

      {/* Stat cards — values are dynamic but placeholders for now, 
          filled when tab data loads; using 0 as skeleton */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-[#1e2a4a] bg-[#0C1635] px-4 py-3"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${s.color}15` }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-base font-black text-white">—</p>
              <p className="text-[10px] text-[#6b7db3]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex w-fit items-center gap-1 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-1">
        {TABS.map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-all",
              activeTab === tab
                ? "bg-[#8735C9] text-white"
                : "text-[#6b7db3] hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "members" && (
        <MembersTab
          refreshTrigger={refreshTrigger}
          onInviteOpen={() => setInviteOpen(true)}
        />
      )}
      {activeTab === "invites" && (
        <InvitesTab
          refreshTrigger={refreshTrigger}
          onInviteOpen={() => setInviteOpen(true)}
        />
      )}
      {activeTab === "roles" && (
        <RolesTab refreshTrigger={refreshTrigger} onCreateRole={() => { }} />
      )}

      {/* Global invite modal */}
      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onSuccess={() => {
            setInviteOpen(false);
            triggerRefresh();
          }}
        />
      )}
    </div>
  );
};
