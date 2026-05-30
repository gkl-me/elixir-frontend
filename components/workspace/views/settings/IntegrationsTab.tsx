'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const INTEGRATIONS = [
  { name: 'GitHub',  desc: 'Sync PRs, issues, and commits to tasks.',    connected: true,  icon: '🐙' },
  { name: 'Slack',   desc: 'Send notifications and updates to channels.', connected: false, icon: '💬' },
  { name: 'Figma',   desc: 'Attach design files directly to tasks.',      connected: true,  icon: '🎨' },
  { name: 'Jira',    desc: 'Import and sync issues from Jira projects.',  connected: false, icon: '🔷' },
  { name: 'Notion',  desc: 'Link Notion docs to projects.',               connected: false, icon: '📄' },
  { name: 'Zapier',  desc: 'Connect to thousands of apps via Zapier.',    connected: false, icon: '⚡' },
];

export const IntegrationsTab = () => (
  <div className="space-y-3">
    {INTEGRATIONS.map((int) => (
      <div
        key={int.name}
        className="bg-[#0C1635] border border-[#1e2a4a] rounded-xl p-4 flex items-center gap-4"
      >
        <div className="w-11 h-11 rounded-xl bg-[#07112b] border border-[#1e2a4a] flex items-center justify-center text-2xl flex-shrink-0">
          {int.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{int.name}</p>
            {int.connected && (
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full font-semibold">
                Connected
              </span>
            )}
          </div>
          <p className="text-xs text-[#6b7db3] mt-0.5">{int.desc}</p>
        </div>
        <Button
          size="sm"
          onClick={() =>
            console.log('[API TODO]', int.connected ? 'Disconnect' : 'Connect', int.name)
          }
          className={
            int.connected
              ? 'border border-[#1e2a4a] bg-transparent text-[#6b7db3] hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 text-xs'
              : 'bg-[#8735C9] hover:bg-[#6a29a0] text-white text-xs'
          }
        >
          {int.connected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    ))}
  </div>
);
