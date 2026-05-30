"use client";

import React from "react";
import { Button } from "@/components/ui/button";

const INTEGRATIONS = [
  {
    name: "GitHub",
    desc: "Sync PRs, issues, and commits to tasks.",
    connected: true,
    icon: "🐙",
  },
  {
    name: "Slack",
    desc: "Send notifications and updates to channels.",
    connected: false,
    icon: "💬",
  },
  {
    name: "Figma",
    desc: "Attach design files directly to tasks.",
    connected: true,
    icon: "🎨",
  },
  {
    name: "Jira",
    desc: "Import and sync issues from Jira projects.",
    connected: false,
    icon: "🔷",
  },
  {
    name: "Notion",
    desc: "Link Notion docs to projects.",
    connected: false,
    icon: "📄",
  },
  {
    name: "Zapier",
    desc: "Connect to thousands of apps via Zapier.",
    connected: false,
    icon: "⚡",
  },
];

export const IntegrationsTab = () => (
  <div className="space-y-3">
    {INTEGRATIONS.map((int) => (
      <div
        key={int.name}
        className="flex items-center gap-4 rounded-xl border border-[#1e2a4a] bg-[#0C1635] p-4"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#1e2a4a] bg-[#07112b] text-2xl">
          {int.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{int.name}</p>
            {int.connected && (
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                Connected
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[#6b7db3]">{int.desc}</p>
        </div>
        <Button
          size="sm"
          onClick={() => {}}
          className={
            int.connected
              ? "border border-[#1e2a4a] bg-transparent text-xs text-[#6b7db3] hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              : "bg-[#8735C9] text-xs text-white hover:bg-[#6a29a0]"
          }
        >
          {int.connected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    ))}
  </div>
);
