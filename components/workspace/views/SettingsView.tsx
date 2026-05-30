"use client";

import React, { useState } from "react";
import { User, Shield, ChevronRight, CreditCard, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileTab } from "./settings/ProfileTab";
import { SecurityTab } from "./settings/SecurityTab";
import { UsageTab } from "./settings/UsageTab";
import { BillingTab } from "./settings/BillingTab";

// ─── Tab definitions ──────────────────────────────────────
type SettingsTab = "profile" | "security" | "usage" | "billing";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "usage", label: "Usage", icon: Zap },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const TAB_CONTENT: Record<SettingsTab, React.ReactNode> = {
  profile: <ProfileTab />,
  security: <SecurityTab />,
  usage: <UsageTab />,
  billing: <BillingTab />,
};

// ─── SettingsView ─────────────────────────────────────────
export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-[#6b7db3]">
          Manage your profile, workspace, and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar nav */}
        <aside className="w-full flex-shrink-0 md:w-52">
          <nav className="sticky top-4 space-y-0.5 rounded-2xl border border-[#1e2a4a] bg-[#0C1635] p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-gradient-to-r from-[#8735C9] to-[#6a29a0] text-white shadow-[0_2px_8px_rgba(135,53,201,0.3)]"
                      : "text-[#8b9cc8] hover:bg-[#0f1d3d] hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-white" : "text-[#6b7db3]"
                      )}
                    />
                    {tab.label}
                  </div>
                  {active && (
                    <ChevronRight className="h-3.5 w-3.5 text-white/50" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab content */}
        <div className="min-w-0 flex-1">{TAB_CONTENT[activeTab]}</div>
      </div>
    </div>
  );
};
